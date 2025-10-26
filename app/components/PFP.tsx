'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

export default function EditableProfilePicture() {
  const [pfp, setPfp] = useState<string | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch profile data from API
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/about');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.data.pfp) {
          setPfp(data.data.pfp);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []);

  // Rest of the existing code remains exactly the same...
  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setMediaPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string);
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload image to Cloudinary');
    }

    return await response.json();
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let cloudinaryResponse = null;
      
      if (fileInputRef.current?.files?.[0]) {
        cloudinaryResponse = await uploadToCloudinary(fileInputRef.current.files[0]);
      }
  
      const links = {
        ...(instagram && { instagram }),
        ...(linkedin && { linkedin }),
        ...(github && { github })
      };
  
      const apiResponse = await fetch('http://localhost:3000/api/uploadabout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          pfp: cloudinaryResponse?.secure_url || pfp,
          bio: bio || '',
          links
        }),
      });
  
      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || 'Failed to save profile data');
      }
  
      if (cloudinaryResponse?.secure_url) {
        setPfp(cloudinaryResponse.secure_url);
      }
      setShowEdit(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // The return statement remains exactly the same...
  return (
    <div className="relative w-fit mx-auto">
      {/* Profile Picture with Edit Button */}
      <motion.div 
        className="relative group"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <div 
          className="w-50 h-50 rounded-full overflow-hidden border-4 border-white shadow-lg relative"
          style={pfp ? { 
            backgroundImage: `url(${pfp})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          } : {}}
        >
          {!pfp && (
            <div className="w-full h-full bg-gradient-to-br from-orange-300 to-amber-700 flex items-center justify-center">
              <span className="text-white font-medium">Add Photo</span>
            </div>
          )}
          
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
        </div>

        <motion.button
          className="absolute -bottom-2 -right-2 bg-gradient-to-r from-[#cc7722] to-[#9A4D00] text-white rounded-full p-2 shadow-md hover:shadow-lg transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowEdit(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </motion.button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleMediaChange}
          accept="image/*"
          className="hidden"
        />
      </motion.div>

      {/* Edit Modal */}
      {showEdit && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 25 }}
          >
            <button
              onClick={() => setShowEdit(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              disabled={isSaving}
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Edit Profile</h2>

            <div className="space-y-4">
              {/* Profile Picture Upload */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Profile Picture</label>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-orange-400 transition-all duration-200 bg-gray-50 h-48 flex flex-col items-center justify-center cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {mediaPreview ? (
                    <img 
                      src={mediaPreview} 
                      alt="Preview" 
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : pfp ? (
                    <img 
                      src={pfp} 
                      alt="Current Profile" 
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <>
                      <svg className="w-10 h-10 text-orange-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-gray-600 text-center">
                        <span className="font-medium text-orange-500">Click to upload</span>
                      </p>
                      <p className="text-gray-400 text-sm mt-1">PNG, JPG (max. 5MB)</p>
                    </>
                  )}
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:ring-1 focus:ring-orange-200 transition-all duration-200 text-gray-700 bg-gray-50 placeholder-gray-400"
                  placeholder="Enter your username"
                  disabled={isSaving}
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:ring-1 focus:ring-orange-200 transition-all duration-200 text-gray-700 bg-gray-50 placeholder-gray-400 min-h-[100px]"
                  placeholder="Tell something about yourself"
                  rows={3}
                  disabled={isSaving}
                />
              </div>

              {/* Social Links */}
              <div className="space-y-3">
                <label className="block text-gray-700 font-medium mb-2">Social Links</label>
                
                <div>
                  <label className="block text-gray-600 text-sm mb-1">Instagram</label>
                  <input
                    type="url"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:ring-1 focus:ring-orange-200 transition-all duration-200 text-gray-700 bg-gray-50 placeholder-gray-400"
                    placeholder="https://instagram.com/username"
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <label className="block text-gray-600 text-sm mb-1">LinkedIn</label>
                  <input
                    type="url"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:ring-1 focus:ring-orange-200 transition-all duration-200 text-gray-700 bg-gray-50 placeholder-gray-400"
                    placeholder="https://linkedin.com/in/username"
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <label className="block text-gray-600 text-sm mb-1">GitHub</label>
                  <input
                    type="url"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:ring-1 focus:ring-orange-200 transition-all duration-200 text-gray-700 bg-gray-50 placeholder-gray-400"
                    placeholder="https://github.com/username"
                    disabled={isSaving}
                  />
                </div>
              </div>

              {/* Save Button */}
              <motion.button
                className="w-full py-3 bg-gradient-to-r from-[#cc7722] to-[#9A4D00] text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-70"
                whileHover={{ scale: isSaving ? 1 : 1.02 }}
                whileTap={{ scale: isSaving ? 1 : 0.98 }}
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}