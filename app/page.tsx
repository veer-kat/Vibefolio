'use client';

import Navbar from './components/Navbar';
import FeedPosts from './components/FeedPosts';
import Stories from './components/Stories';

export default function Home() {
  return (
    <main>
      <Navbar />
      
      {/* Clix heading above Stories */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        margin: '20px 0 10px 0'
      }}>
        <h2 style={{
          fontWeight: 'bold',
          fontSize: '2rem',
          background: 'linear-gradient(45deg, #ffffff, rgba(185, 185, 185, 1))',
          backgroundClip: 'text',
          color: 'transparent',
          margin: 0,
          textTransform: 'uppercase'
        }}>
          Clix
        </h2>
      </div>
      <Stories />
      
      {/* History heading above FeedPosts */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        margin: '30px 0 10px 0'
      }}>
        <h2 style={{
          fontWeight: 'bold',
          fontSize: '2rem',
          background: 'linear-gradient(45deg, #ffffff, rgba(185, 185, 185, 1))',
          backgroundClip: 'text',
          color: 'transparent',
          margin: 0,
          textTransform: 'uppercase'
        }}>
          History
        </h2>
      </div>
      <FeedPosts />
    </main>
  );
}