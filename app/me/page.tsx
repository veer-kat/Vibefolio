"use client";

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Carousel from '../components/Carousel';
import PFP from '../components/PFP';
import Image from 'next/image';

interface UserData {
  name: string;
  bio: string;
  links?: {
    instagram?: string;
    linkedin?: string;
    github?: string;
  };
}

const techStack = [
  { 
    name: 'MongoDB', 
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
    color: 'text-green-500',
    docs: 'https://www.mongodb.com/docs/' 
  },
  { 
    name: 'Express', 
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
    color: 'text-gray-400',
    docs: 'https://expressjs.com/' 
  },
  { 
    name: 'Next.js', 
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
    color: 'text-white',
    docs: 'https://nextjs.org/docs' 
  },
  { 
    name: 'Node.js', 
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
    color: 'text-green-600',
    docs: 'https://nodejs.org/en/docs/' 
  },
  { 
    name: 'HTML', 
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
    color: 'text-orange-500',
    docs: 'https://developer.mozilla.org/en-US/docs/Web/HTML' 
  },
  { 
    name: 'CSS', 
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
    color: 'text-blue-500',
    docs: 'https://developer.mozilla.org/en-US/docs/Web/CSS' 
  },
  { 
    name: 'JavaScript', 
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
    color: 'text-yellow-400',
    docs: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' 
  },
  { 
    name: 'Android', 
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg',
    color: 'text-green-400',
    docs: 'https://developer.android.com/studio' 
  },
  { 
    name: 'Java', 
    logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
    color: 'text-red-500',
    docs: 'https://docs.oracle.com/en/java/' 
  }
];

export default function Home() {
  const [userData, setUserData] = useState<UserData>({ name: '', bio: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/about');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        
        if (result.success) {
          setUserData({
            name: result.data?.username || '',
            bio: result.data?.bio || '',
            links: result.data?.links || {}
          });
        } else {
          throw new Error(result.message || 'Invalid data format');
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
  
    fetchAboutData();
  }, []);

  const handleSocialClick = (url: string | undefined) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleTechClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <main className="relative min-h-screen pb-[25vh]">
      <Navbar />
      
      {/* Profile Section */}
      <div className="pt-20 px-4 max-w-4xl mx-auto">
        <div className="flex items-start gap-8">
          <PFP />
          <div className="flex-1 ml-6">
            {loading ? (
              <p className="font-inter text-gray-300">Loading profile...</p>
            ) : error ? (
              <p className="font-inter text-red-400">Error: {error}</p>
            ) : (
              <>
                <h2 className="font-inter text-3xl font-bold text-white mb-2 leading-tight">
                  {userData.name}
                </h2>
                <p className="font-inter text-gray-400 text-sm leading-relaxed max-w-2xl mb-4">
                  {userData.bio}
                </p>
                
                {/* Social Icons */}
                <div className="flex gap-4 mt-4">
                  {userData.links?.instagram && (
                    <button 
                      onClick={() => handleSocialClick(userData.links?.instagram)}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      <Image 
                        src="/Instagram.png" 
                        alt="Instagram" 
                        width={16} 
                        height={16} 
                      />
                    </button>
                  )}
                  
                  {userData.links?.linkedin && (
                    <button 
                      onClick={() => handleSocialClick(userData.links?.linkedin)}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      <Image 
                        src="/LinkedIn.png" 
                        alt="LinkedIn" 
                        width={16} 
                        height={16} 
                      />
                    </button>
                  )}
                  
                  {userData.links?.github && (
                    <button 
                      onClick={() => handleSocialClick(userData.links?.github)}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      <Image 
                        src="/Github.png" 
                        alt="Github" 
                        width={16} 
                        height={16} 
                      />
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tech Stack Marquee */}
      <div className="mt-12 mx-auto max-w-4xl overflow-hidden relative">
        <div className="marquee-container py-6">
          <div className="marquee-content flex">
            {[...techStack, ...techStack].map((tech, index) => (
              <div 
                key={`${tech.name}-${index}`}
                className="flex-shrink-0 mx-8 cursor-pointer group"
                onClick={() => handleTechClick(tech.docs)}
              >
                <div className="flex flex-col items-center">
                  <div className="relative">
                    {/* White circle background */}
                    <div className="absolute inset-0 bg-white rounded-full blur-md opacity-30"></div>
                    <div className="relative z-10 h-16 w-16 bg-white rounded-full flex items-center justify-center p-3 group-hover:scale-110 transition-transform">
                      <img 
                        src={tech.logo} 
                        alt={tech.name} 
                        className="h-10 w-10 object-contain" 
                      />
                    </div>
                  </div>
                  <span className={`mt-2 font-bold ${tech.color} group-hover:underline`}>
                    {tech.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black to-transparent z-10"></div>
      </div>

      {/* Separator Line */}
      <div
        style={{
          width: '50%',
          height: '6px',
          background: 'linear-gradient(to right, #666 5%, white 50%, #666 95%)',
          borderRadius: '4px',
          margin: '20px auto',
        }}
      />

      {/* Carousel Section */}
      <div className="mt-[30px]">
        <h2 className="font-inter text-2xl font-bold text-white mb-4 text-center">History</h2>
        <Carousel />
      </div>

      {/* Marquee Animation CSS */}
      <style jsx>{`
        .marquee-container {
          overflow: hidden;
          position: relative;
        }
        .marquee-content {
          display: flex;
          animation: scroll 30s linear infinite;
          will-change: transform;
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-150%); }
        }
      `}</style>
    </main>
  );
}