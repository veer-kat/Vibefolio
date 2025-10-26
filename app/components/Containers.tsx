'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Venture {
  ventureId: number;
  vContentLink: string;
  likes: number;
  duration: number;
  captions: string;
}

interface ContainersProps {
  selectedIndex: number | null;
  setSelectedIndex: (index: number | null) => void;
}

const Containers = ({ selectedIndex, setSelectedIndex }: ContainersProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [loading, setLoading] = useState(true);
  const containerCount = 15;
  const radius = 800;
  const containerSize = { width: 300, height: 168.75 };

  // Animation variants
  const containerVariants = {
    initial: { rotate: 0 },
    animate: {
      rotate: 360,
      transition: {
        duration: 45,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  useEffect(() => {
    const fetchVentures = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/ventures');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        
        if (result.success && Array.isArray(result.data)) {
          setVentures(result.data);
        }
      } catch (error) {
        console.error('Error fetching ventures:', error);
      } finally {
        setLoading(false);
        setIsMounted(true);
      }
    };

    fetchVentures();
  }, []);

  if (!isMounted || loading) {
    return <div className="fixed inset-0 flex items-center justify-center">Loading...</div>;
  }

  console.log('Venture index:', selectedIndex);

  return (
    <div className="fixed inset-0 flex items-end justify-center pb-8">
      <motion.div 
        className="relative w-[1600px] h-[1600px]"
        variants={containerVariants}
        initial="initial"
        animate={isMounted ? "animate" : "initial"}
      >
        {Array.from({ length: containerCount }).map((_, i) => {
          const angle = (i * (360 / containerCount));
          const radian = angle * (Math.PI / 180);
          const x = radius * Math.cos(radian);
          const y = radius * Math.sin(radian);
          const tangentAngle = angle + 90;

          const venture = ventures[i % ventures.length];
          const videoUrl = venture?.vContentLink;

          return (
            <motion.div
              key={i}
              className={`absolute bg-[#000000] rounded-lg flex items-center justify-center overflow-hidden z-50 cursor-pointer ${
                selectedIndex === i ? 'ring-4 ring-blue-500' : ''
              }`}
              style={{
                width: `${containerSize.width}px`,
                height: `${containerSize.height}px`,
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: `translate(-50%, -50%) rotate(${tangentAngle}deg)`,
                transformOrigin: 'center center',
                boxShadow: '0 0 10px 1px rgb(255, 255, 255)'
              }}
              // Inside the map function where you render each container, change the onClick handler:
              onClick={() => {
                const originalIndex = i % ventures.length;
                setSelectedIndex(originalIndex);
              }}
            >
              {videoUrl ? (
                <div className="w-full h-full">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    preload="auto"
                    crossOrigin="anonymous"
                  >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-1 text-xs">
                    {venture.captions}
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center">
                  <span className="text-white font-bold text-2xl">{i+1}</span>
                  <p className="text-white text-xs mt-2">No video available</p>
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
      
      {selectedIndex !== null && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-4 rounded-lg">
          Selected Container Index: {selectedIndex}
        </div>
      )}
    </div>
  );
};

export default Containers;