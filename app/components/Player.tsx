'use client';

import { useEffect, useState } from 'react';

interface Venture {
  id: number;
  captions?: string;
  vContentLink?: string;
}

interface PlayerProps {
  selectedIndex?: number | null;
}


const Player = ({ selectedIndex = null }: PlayerProps) => {  // Default to null if not provided
  const playerWidth = 764;
  const playerHeight = 430;
  const [ventures, setVentures] = useState<Venture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVentures = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/ventures');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setVentures(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchVentures();
  }, []);

  console.log('Selected:', selectedIndex);

  // Determine which venture to display
  const displayIndex = selectedIndex !== null ? selectedIndex : 0;
  const currentVenture = ventures[displayIndex];

  return (
    <div
      className="rounded-xl border border-gray-800 overflow-hidden"
      style={{
        width: `${playerWidth}px`,
        height: `${playerHeight}px`,
        background: 'linear-gradient(135deg,rgb(255, 255, 255) 0%)',
        boxShadow: '0 0 50px rgba(255, 255, 255, 0.18)'
      }}
    >
      {/* Main content area */}
      <div className="w-full h-[90%]">
        <div className="h-full flex items-center justify-center text-gray-400">
          {loading ? (
            <div className="text-center">
              <div className="text-sm text-gray-500">Loading...</div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">
              <div className="text-sm">Error: {error}</div>
            </div>
          ) : currentVenture?.vContentLink ? (
            <div className="w-full h-full">
              <video
                src={currentVenture.vContentLink}
                className="w-full h-full object-cover"
                autoPlay
                muted
                controls
              />
            </div>
          ) : (
            <div className="text-center">
              <div className="text-sm text-gray-500">
                {ventures.length > 0 ? 'Selected video not available' : 'No ventures found'}
              </div>
            </div>
          )}
        </div>
      </div>
  
      {/* Captions area */}
      {!loading && !error && currentVenture?.captions && (
        <div className="w-full px-6 py-2 bg-gradient-to-r from-white via-gray-100 to-white rounded-b-lg shadow-md">
          <p className="text-gray-800 text-center text-lg font-semibold font-sans tracking-wide leading-relaxed">
            {currentVenture.captions}
          </p>
        </div>
      )}
    </div>
  );  
};

export default Player;