'use client';

import { useState, useEffect } from 'react';

interface Post {
  nContentLink: string;
}

interface UserData {
  username: string;
  pfp: string;
}

export default function FeedPosts() {
  const [posts, setPosts] = useState<string[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch posts
        const postsRes = await fetch('http://localhost:5000/api/posts');
        if (!postsRes.ok) throw new Error('Failed to fetch posts');
        const postsData = await postsRes.json();
        
        const postsArray = Array.isArray(postsData) 
          ? postsData 
          : Array.isArray(postsData.data) 
            ? postsData.data 
            : Array.isArray(postsData.posts) 
              ? postsData.posts 
              : [];
        
        setPosts(postsArray.map((item: Post) => item.nContentLink));

        // Fetch user data
        const userRes = await fetch('http://localhost:5000/api/about');
        if (!userRes.ok) throw new Error('Failed to fetch user data');
        const userData = await userRes.json();
        setUserData(userData.data);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Fetch error');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '25px',
      padding: '20px'
    }}>
      {posts.slice(0, 10).map((url, i) => [
        <div 
          key={`divider-${i}`}
          style={{
            backgroundImage: 'url(/bgbox.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '600px',
            height: '60px', // Adjust based on your bgbox.png aspect ratio
            marginTop: i === 0 ? '0' : '20px',
            marginBottom: '7px',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '20px',
            boxShadow: '0 0 15px rgba(255, 255, 255, 1)'
          }}
        >
          {userData && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img 
                src={userData.pfp} 
                alt="Profile" 
                style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '5%',
                  objectFit: 'cover'
                }} 
              />
              <span style={{ 
                color: 'white',
                fontWeight: 'bold',
                fontSize: '16px'
              }}>
                {userData.username}
              </span>
            </div>
          )}
        </div>,
        <div 
          key={`container-${i}`}
          style={{
            width: '600px',
            height: '600px',
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 0 15px rgba(255, 255, 255, 1)',
            position: 'relative'
          }}
        >
          {url?.match(/\.(jpe?g|png|gif|webp)$/i) ? (
            <img 
              src={url} 
              alt="" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                display: 'block'
              }} 
            />
          ) : (
            <div style={{ 
              padding: '20px',
              height: '100%',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {url || 'No content available'}
            </div>
          )}
        </div>
      ])}
    </div>
  );
}