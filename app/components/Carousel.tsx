'use client';

import { useState, useEffect } from 'react';

interface Post {
  nContentLink: string;
  caption?: string;
}

export default function Carousel() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setPosts(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Fetch error');
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const openOverlay = (post: Post) => {
    setSelectedPost(post);
  };

  const closeOverlay = () => {
    setSelectedPost(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 300px)',
        gap: '25px',
        justifyContent: 'center',
        padding: '20px',
      }}>
        {posts.slice(0, 10).map((post, i) => (
          <div 
            key={i} 
            onClick={() => openOverlay(post)}
            style={{
              height: '300px',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 0 10px rgba(255, 255, 255, 1)',
              position: 'relative',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
            }}
          >
            {post.nContentLink.match(/\.(jpe?g|png|gif|webp)$/i) ? (
              <img 
                src={post.nContentLink} 
                alt="" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  display: 'block',
                }} 
              />
            ) : (
              <div style={{ 
                padding: '20px',
                height: '100%',
                backgroundColor: '#f0f0f0',
                boxSizing: 'border-box',
              }}>{post.nContentLink}</div>
            )}
          </div>
        ))}
      </div>

      {/* Overlay */}
      {selectedPost && (
        <div 
          onClick={closeOverlay}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            cursor: 'pointer'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '500px',
              height: '550px',
              backgroundColor: 'white',
              borderRadius: '12px',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'default',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Close Button */}
            <button
              onClick={closeOverlay}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'rgb(0, 0, 0)',
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

            {/* Media Content (Top) - Cropped to 300x300 */}
            <div style={{
              height: '400px',
              width: '400px',
              margin: '0 auto',
              marginTop: '50px',
              overflow: 'hidden',
              borderRadius: '8px',
              border: '1px solid rgba(0, 0, 0, 0.1)'
            }}>
              {selectedPost.nContentLink.match(/\.(jpe?g|png|gif|webp)$/i) ? (
                <img 
                  src={selectedPost.nContentLink} 
                  alt="" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : selectedPost.nContentLink.match(/\.(mp4|webm|ogg)$/i) ? (
                <video
                  controls
                  autoPlay
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                >
                  <source src={selectedPost.nContentLink} />
                </video>
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'black',
                  backgroundColor: '#f0f0f0'
                }}>
                  {selectedPost.nContentLink}
                </div>
              )}
            </div>

            {/* Caption (Bottom) */}
            <div style={{
              height: 'calc(100% - 400px)', // Adjust height based on media and spacing
              padding: '25px',
              color: 'black',
              overflowY: 'auto',
              boxSizing: 'border-box',
              marginTop: '20px',
              textAlign: 'center'
            }}>
              <h3 style={{
                marginBottom: '15px',
                fontSize: '1.3rem',
                fontWeight: '500',
                letterSpacing: '0.5px'
              }}>
                Caption
              </h3>
              <p style={{
                lineHeight: '1.6',
                fontSize: '1rem',
                whiteSpace: 'pre-line',
                color: 'rgba(0, 0, 0, 0.8)',
                maxWidth: '400px',
                margin: '0 auto'
              }}>
                {selectedPost.caption || 'No caption available'}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}