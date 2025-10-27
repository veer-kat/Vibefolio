"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

const Skeels = () => {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/skills`);
        const data = await response.json();
        if (data.success) {
          setSkills(data.data);
        } else {
          setError('Failed to fetch skills');
        }
      } catch (err) {
        setError('Error fetching skills');
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const goToPreviousSkill = () => {
    setCurrentSkillIndex(prevIndex => 
      prevIndex === 0 ? skills.length - 1 : prevIndex - 1
    );
  };

  const goToNextSkill = () => {
    setCurrentSkillIndex(prevIndex => 
      prevIndex === skills.length - 1 ? 0 : prevIndex + 1
    );
  };

  const toggleOverlay = () => {
    setShowOverlay(!showOverlay);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (skills.length === 0) return <div>No skills found</div>;

  const currentSkill = skills[currentSkillIndex];

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
    }}>
      {/* Main Container with Video and Arrows */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        position: 'relative' // Added for positioning info button
      }}>
        {/* Video Container */}
        <div style={{
          position: 'relative',
          backgroundColor: 'white',
          height: '650px',
          width: '365.625px',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 0px 8px rgba(255, 255, 255, 1)'
        }}>
          {currentSkill.sContentLink && (
            <video
              key={currentSkill.skillId}
              autoPlay
              muted
              loop
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            >
              <source src={currentSkill.sContentLink} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}

          {/* Info Button */}
          <button 
            onClick={toggleOverlay}
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              background: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: 'none',
              cursor: 'pointer',
              zIndex: 10
            }}
          >
            <Image 
              src="/info.png" 
              alt="Show info" 
              width={24} 
              height={24}
            />
          </button>

          {/* Overlay */}
          {showOverlay && (
  <div style={{
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(5px)',
    zIndex: 20,
    padding: '30px',
    boxSizing: 'border-box',
    overflowY: 'auto',
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
    boxShadow: '0 -5px 15px rgba(0, 0, 0, 0.1)',
    animation: 'fadeIn 0.3s ease-out'
  }}>
    {/* Close Button */}
    <button 
      onClick={toggleOverlay}
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'rgba(0, 0, 0, 0.1)',
        border: 'none',
        borderRadius: '50%',
        width: '32px',
        height: '32px',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1.2rem',
        color: '#333',
        transition: 'all 0.2s ease'
      }}
      onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.2)'}
      onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)'}
    >
      X
    </button>
    
    {/* Caption Content */}
    <div style={{ 
      marginTop: '10px',
      color: '#333'
    }}>
      <h3 style={{ 
        marginBottom: '20px',
        fontSize: '1.5rem',
        fontWeight: '600',
        letterSpacing: '0.5px'
      }}>
        {'Caption'}
      </h3>
      <p style={{
        lineHeight: '1.6',
        fontSize: '1rem',
        whiteSpace: 'pre-line'
      }}>
        {currentSkill.caption || 'No caption available'}
      </p>
    </div>
  </div>
)}
        </div>

        {/* Arrows Container */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>
          <button 
            onClick={goToPreviousSkill}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              transform: 'rotate(90deg)',
              padding: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Image 
              src="/left_arrow.svg" 
              alt="Previous skill" 
              width={24} 
              height={24}
            />
          </button>
          <button 
            onClick={goToNextSkill}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              transform: 'rotate(90deg)',
              padding: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Image 
              src="/right_arrow.svg" 
              alt="Next skill" 
              width={24} 
              height={24}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Skeels;