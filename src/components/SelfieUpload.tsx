"use client";

import { useState, useRef } from "react";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { storage, db } from '@/lib/firebase';
import Image from "next/image";

interface SelfieUploadProps {
  userId: string;
  currentSelfie?: string;
  onSelfieUpdate: (url: string) => void;
}

export default function SelfieUpload({ userId, currentSelfie, onSelfieUpdate }: SelfieUploadProps) {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [cameraLoading, setCameraLoading] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    setError("");
    setShowCamera(true); // Show video element FIRST
    setCameraLoading(true);
    
    // Wait a tick for React to render the video element
    setTimeout(async () => {
      try {
        console.log('🎥 Checking camera support...');
        
        // Check if getUserMedia is supported
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Camera not supported in this browser");
        }

        console.log('📹 Requesting camera access...');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 480 }
          },
          audio: false
        });
        
        console.log('✓ Camera access granted');
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          
          // Wait for metadata to load
          videoRef.current.onloadedmetadata = async () => {
            console.log('✓ Video metadata loaded');
            try {
              if (videoRef.current) {
                await videoRef.current.play();
                console.log('✓ Video playing');
              }
            } catch (e) {
              console.log('Auto-play error (this is normal):', e);
            }
            setCameraLoading(false);
          };
          
          // Fallback timeout
          setTimeout(() => {
            console.log('⏰ Timeout - clearing loading state');
            setCameraLoading(false);
          }, 3000);
        }
      } catch (err: any) {
        setCameraLoading(false);
        setShowCamera(false);
        console.error('❌ Camera error:', err);
        console.error('Error name:', err.name);
        console.error('Error message:', err.message);
        
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError("🚫 Camera permission denied. Please allow camera access in your browser settings or upload a photo instead.");
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setError("📷 No camera found on your device. Please upload a photo instead.");
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          setError("⚠️ Camera is already in use by another app. Please close other apps and try again, or upload a photo instead.");
        } else {
          setError(`Unable to access camera: ${err.message}. Please upload a photo instead.`);
        }
      }
    }, 100); // Give React time to render the video element
  };

  const stopCamera = () => {
    console.log('🛑 Stopping camera...');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
    setCameraLoading(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError("Please select an image file");
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) {
        setError("Image must be less than 2MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadSelfie = async () => {
    if (!capturedImage) return;
    
    setUploading(true);
    setError("");
    
    try {
      console.log('📤 Starting selfie upload...');
      
      // Convert base64 to blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      console.log('✓ Image converted to blob:', blob.size, 'bytes');
      
      // Create unique filename
      const timestamp = Date.now();
      const fileName = `selfie_${timestamp}.jpg`;
      const filePath = `users/${userId}/selfies/${fileName}`;
      console.log('📁 Upload path:', filePath);
      
      // Upload to Firebase Storage
      const storageRef = ref(storage, filePath);
      console.log('📤 Uploading to Firebase Storage...');
      
      await uploadBytes(storageRef, blob, {
        contentType: 'image/jpeg',
        customMetadata: {
          userId,
          uploadedAt: new Date().toISOString()
        }
      });
      console.log('✓ Upload successful');
      
      // Get download URL
      console.log('🔗 Getting download URL...');
      const downloadURL = await getDownloadURL(storageRef);
      console.log('✓ Download URL obtained:', downloadURL);
      
      // Update user profile in Firestore
      console.log('💾 Updating Firestore...');
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        selfieUrl: downloadURL,
        updatedAt: new Date().toISOString()
      });
      console.log('✓ Firestore updated');
      
      onSelfieUpdate(downloadURL);
      setCapturedImage(null);
      alert('✓ Selfie saved! It will now appear on product cards.');
    } catch (err: any) {
      console.error('❌ Upload error:', err);
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);
      
      let errorMessage = 'Failed to upload selfie. ';
      
      if (err.code === 'storage/unauthorized') {
        errorMessage += 'Permission denied. Please check Firebase Storage rules.';
      } else if (err.code === 'storage/quota-exceeded') {
        errorMessage += 'Storage quota exceeded.';
      } else if (err.code === 'storage/unauthenticated') {
        errorMessage += 'Please log in again.';
      } else if (err.code === 'permission-denied') {
        errorMessage += 'Firestore permission denied.';
      } else {
        errorMessage += err.message || 'Please try again.';
      }
      
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const removeSelfie = async () => {
    if (!confirm('Remove your selfie from product cards?')) return;
    
    setUploading(true);
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        selfieUrl: null,
        updatedAt: new Date().toISOString()
      });
      
      onSelfieUpdate('');
      alert('✓ Selfie removed');
    } catch (err) {
      setError('Failed to remove selfie');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-serif text-2xl font-bold text-navy mb-4">
        📸 Your Product Card Selfie
      </h3>
      <p className="text-navy/70 mb-6 text-sm">
        Add a personal touch! Your selfie will appear in the corner of every product card when you browse.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Current Selfie */}
      {currentSelfie && !capturedImage && (
        <div className="mb-6">
          <p className="text-sm font-medium text-navy mb-2">Current selfie:</p>
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-gold/30 mx-auto">
            <Image
              src={currentSelfie}
              alt="Your selfie"
              fill
              className="object-cover"
            />
          </div>
          <button
            onClick={removeSelfie}
            disabled={uploading}
            className="mt-3 w-full py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm disabled:opacity-50"
          >
            Remove Selfie
          </button>
        </div>
      )}

      {/* Camera View */}
      {showCamera && (
        <div className="mb-4">
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {cameraLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-5xl mb-3 animate-bounce">📷</div>
                  <p className="text-white font-semibold text-lg mb-2">Starting Camera...</p>
                  <p className="text-white/70 text-sm">Please allow camera access if prompted</p>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={capturePhoto}
              disabled={cameraLoading}
              className="flex-1 py-3 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              📸 Capture Photo
            </button>
            <button
              onClick={stopCamera}
              className="px-6 py-3 bg-gray-200 text-navy rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              ✕ Cancel
            </button>
          </div>
        </div>
      )}

      {/* Captured/Selected Image Preview */}
      {capturedImage && (
        <div className="mb-4">
          <p className="text-sm font-medium text-navy mb-2">Preview:</p>
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gold/30 mx-auto">
            <img
              src={capturedImage}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={uploadSelfie}
              disabled={uploading}
              className="flex-1 py-2 bg-olive text-white rounded-lg hover:bg-olive/90 transition-colors disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : '✓ Save Selfie'}
            </button>
            <button
              onClick={() => setCapturedImage(null)}
              disabled={uploading}
              className="flex-1 py-2 bg-gray-200 text-navy rounded-lg hover:bg-gray-300 transition-colors"
            >
              Retake
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {!showCamera && !capturedImage && (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={startCamera}
            disabled={cameraLoading}
            className="py-4 bg-gradient-to-r from-terracotta to-terracotta/90 text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span className="text-2xl">📷</span>
            <span>Take Photo</span>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="py-4 bg-gradient-to-r from-olive to-olive/90 text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2"
          >
            <span className="text-2xl">📁</span>
            <span>Upload Photo</span>
          </button>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Hidden Canvas for Photo Capture */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="mt-4 p-3 bg-cream rounded-lg">
        <p className="text-xs text-navy/60">
          💡 Tip: Your selfie will appear as a small circular image on the bottom-left corner of product cards for a personalized shopping experience!
        </p>
      </div>
    </div>
  );
}


