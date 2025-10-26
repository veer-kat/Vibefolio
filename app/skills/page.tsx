import Skeels from '../components/Skeels';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <main style={{ position: 'relative' }}>
      <Navbar />
      
      {/* Skeels text in top right corner */}
      <h1 style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        fontWeight: 'bold',
        fontSize: '2.5rem',
        background: 'linear-gradient(45deg, #ffffff, rgba(185, 185, 185, 1))',
        backgroundClip: 'text',
        color: 'transparent',
        margin: 0,
        zIndex: 10,
        lineHeight: 1
      }}>
        Skeels
      </h1>
      
      <Skeels />
    </main>
  );
}