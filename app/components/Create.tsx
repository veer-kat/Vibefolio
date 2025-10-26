"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface CreateProps {
  onClose: () => void;
}

type ContentType = 'post' | 'stories' | 'skill' | 'project' | null;

const Create = ({ onClose }: CreateProps) => {
  const [expanded, setExpanded] = useState(false);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [selectedType, setSelectedType] = useState<ContentType>(null);
  const [isUploading, setIsUploading] = useState(false); // Add loading state

  const handleButtonClick = (type: ContentType) => {
    setSelectedType(type);
    setExpanded(true);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {isUploading && (
        <div className="absolute inset-0 z-[300] flex items-center justify-center bg-black/80">
          <div className="text-white text-xl flex flex-col items-center">
            <svg className="animate-spin h-12 w-12 text-white mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading...
          </div>
        </div>
      )}

      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        className="relative w-200 rounded-2xl bg-white p-8 shadow-xl flex items-center justify-center"
        initial={{ scale: 5, y: 20, height: 500 }}
        animate={{ 
          scale: 1, 
          y: 0, 
          height: expanded ? (selectedType === 'stories' ? 650 : 850) : 500 
        }}
        transition={{ type: "spring", damping: 20 }}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {!expanded ? (
          <div className="grid grid-cols-2 gap-4 w-100 h-100 mx-auto">
            {[
              { type: 'post', label: 'History' },
              { type: 'stories', label: 'Clix' },
              { type: 'skill', label: 'Skeels' },
              { type: 'project', label: 'Projects' }
            ].map((item, index) => (
              <motion.button
                key={index}
                className="relative overflow-hidden rounded-lg px-6 py-3 font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-md"
                onClick={() => handleButtonClick(item.type as ContentType)}
                whileTap={{ scale: 0.95 }}
              >
                <span
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(45deg, #cc7722 50%, #9A4D00 100%)",
                  }}
                />
                <span className="relative z-10">{item.label}</span>
              </motion.button>
            ))}
          </div>
        ) : (
          <motion.div 
            className="w-full p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="mb-6">
              <label className="block text-gray-800 font-medium mb-3">
                {selectedType === 'stories' ? 'Add to your story' : 'Add Media'}
              </label>
              <div className="relative">
                <input 
                  type="file" 
                  id="media-upload"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*,video/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setMediaPreview(event.target?.result as string);
                        setMediaType(file.type.startsWith('image') ? 'image' : 'video');
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {mediaPreview ? (
                  <div className={`border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 ${selectedType === 'stories' ? 'h-[400px]' : 'h-[300px]'} flex items-center justify-center overflow-hidden`}>
                    {mediaType === 'image' ? (
                      <img 
                        src={mediaPreview} 
                        alt="Preview" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <video
                        src={mediaPreview}
                        className="w-full h-full object-contain"
                        muted
                      />
                    )}
                    <button
                      onClick={() => setMediaPreview(null)}
                      className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                      aria-label="Remove media"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className={`border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-orange-400 transition-all duration-200 bg-gray-50 ${selectedType === 'stories' ? 'h-[400px]' : 'h-[200px]'} flex items-center justify-center`}>
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-gray-600 text-center">
                        <span className="font-medium text-orange-500">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-gray-400 text-sm">PNG, JPG, GIF or MP4 (max. 50MB)</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {selectedType !== 'stories' && (
              <div className="mb-6">
                <label className="block text-gray-800 font-medium mb-3">
                  {selectedType === 'skill' ? 'Skeel Details' : 
                   selectedType === 'project' ? 'Project title' : 'Captions'}
                </label>
                <div className="relative">
                  <textarea
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:ring-1 focus:ring-orange-200 transition-all duration-200 min-h-[120px] text-gray-700 bg-gray-50 placeholder-gray-400 resize-none"
                    placeholder={
                      selectedType === 'skill' ? 'Skeel details' :
                      selectedType === 'project' ? 'Project details' :
                      "Captions"
                    }
                    rows={4}
                  />
                  <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-orange-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}

            <button 
              className="w-full py-2 bg-gradient-to-r from-[#cc7722] to-[#9A4D00] text-white rounded-lg"
              onClick={async () => {
                setIsUploading(true); // Show loading overlay
                try {
                  let mediaUrl = null;
                  let captions = '';
                  let duration: number | null = null;

                  if (mediaPreview) {
                    const fileInput = document.getElementById('media-upload') as HTMLInputElement;
                    if (fileInput?.files?.[0]) {
                      const file = fileInput.files[0];
                      const formData = new FormData();
                      formData.append('file', file);
                      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string);
                      
                      if (mediaType === 'video') {
                        const video = document.createElement('video');
                        video.preload = 'metadata';
                        
                        const durationPromise = new Promise<number>((resolve) => {
                          video.onloadedmetadata = () => {
                            window.URL.revokeObjectURL(video.src);
                            resolve(Math.round(video.duration));
                          };
                        });
                        
                        video.src = URL.createObjectURL(file);
                        duration = await durationPromise;
                      }

                      const cloudinaryResponse = await fetch(
                        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${mediaType === 'video' ? 'video' : 'image'}/upload`, 
                        {
                          method: 'POST',
                          body: formData
                        }
                      );

                      if (!cloudinaryResponse.ok) {
                        const errorData = await cloudinaryResponse.json();
                        console.error('Cloudinary upload failed:', errorData);
                        throw new Error('Cloudinary upload failed');
                      }

                      const cloudinaryData = await cloudinaryResponse.json();
                      mediaUrl = cloudinaryData.secure_url;
                    }
                  }

                  if (selectedType !== 'stories') {
                    const textarea = document.querySelector('textarea');
                    if (textarea) {
                      captions = textarea.value;
                    }
                  }

                  const requestBody: Record<string, any> = { 
                    type: selectedType,
                    ...(mediaUrl && {
                      ...(selectedType === 'post' && { ncontentlink: mediaUrl }),
                      ...(selectedType === 'skill' && { scontentlink: mediaUrl }),
                      ...(selectedType === 'project' && { vcontentlink: mediaUrl }),
                      ...(selectedType === 'stories' && { acontentlink: mediaUrl })
                    }),
                    ...(captions && { captions }),
                    ...(duration !== null && { duration })
                  };

                  const apiResponse = await fetch('http://localhost:3000/api/upload', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                  });

                  const responseData = await apiResponse.json();
                  
                  if (!apiResponse.ok) {
                    console.error('API error response:', responseData);
                    throw new Error(`API upload failed: ${apiResponse.status}`);
                  }

                  onClose();
                } catch (error) {
                  console.error('Error uploading:', error);
                  alert('Upload failed. Please check console for details.');
                } finally {
                  setIsUploading(false); // Hide loading overlay
                }
              }}
            >
              {selectedType === 'stories' ? 'Share to Story' : 'Post'}
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Create;