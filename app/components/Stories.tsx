'use client';

import { useState, useEffect } from 'react';

interface Story {
  aContentLink: string;
}

export default function Stories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stories`);
        if (!res.ok) throw new Error('Failed to fetch stories');
        const data = await res.json();

        const storiesArray = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
            ? data.data
            : Array.isArray(data.stories)
              ? data.stories
              : [];

        setStories(storiesArray.slice(0, 6));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Fetch error');
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const openOverlay = (story: Story) => {
    setSelectedStory(story);
  };

  const closeOverlay = () => {
    setSelectedStory(null);
  };

  if (loading) return <div style={{ textAlign: 'center' }}>Loading stories...Render.com on free plan takes 50s to load the custom api, please have patience</div>;
  if (error) return <div style={{ textAlign: 'center' }}>Error: {error}</div>;

  return (
    <>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
        padding: '20px 0',
        flexWrap: 'wrap'
      }}>
        {stories.map((story, i) => (
          <div
            key={i}
            onClick={() => openOverlay(story)}
            style={{
              padding: '3px',
              background: 'linear-gradient(45deg, #cc7722, #9A4D00)',
              borderRadius: '16px',
              display: 'inline-flex',
              boxShadow: '0 0px 8px rgba(255, 255, 255,1)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
            }}
          >
            <div
              style={{
                width: '112.5px',
                height: '150px',
                backgroundColor: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                margin: '2px'
              }}
            >
              {story.aContentLink?.match(/\.(jpe?g|png|gif|webp)$/i) ? (
                <img
                  src={story.aContentLink}
                  alt="Story"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {story.aContentLink || 'No content'}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Overlay */}
      {selectedStory && (
        <div
          onClick={closeOverlay}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '478.125px',
              height: '850px',
              backgroundColor: 'black',
              borderRadius: '12px',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'default'
            }}
          >
            {/* Close Button */}
            <button
              onClick={closeOverlay}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                color: 'white',
                fontSize: '18px',
                cursor: 'pointer',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>

            {/* Content */}
            {selectedStory.aContentLink?.match(/\.(jpe?g|png|gif|webp)$/i) ? (
              <img
                src={selectedStory.aContentLink}
                alt="Story content"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            ) : selectedStory.aContentLink?.match(/\.(mp4|webm|ogg)$/i) ? (
              <video
                controls
                autoPlay
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              >
                <source src={selectedStory.aContentLink} />
              </video>
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                {selectedStory.aContentLink || 'No content available'}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}