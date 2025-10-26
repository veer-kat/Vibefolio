'use client';

import { useState } from 'react';
import Containers from '../components/Containers';
import Player from '../components/Player';
import Navbar from '../components/Navbar';

export default function Home() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <>
      <Navbar />
      
      {/* Player positioned at top center */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50">
        <Player selectedIndex={selectedIndex} />
      </div>

      {/* Adjusted containers positioning */}
      <div className="fixed bottom-[-1475px] left-1/2 -translate-x-1/2 w-full">
        <Containers 
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex} 
        />
      </div>
    </>
  );
}