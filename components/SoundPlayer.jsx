// components/SoundPlayer.js
'use client';

import { useEffect, useRef, useState } from 'react';

export default function SoundPlayer({ soundUrl, play, onPlayEnd }) {
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (play && !isMuted && audioRef.current) {
      audioRef.current.play()
        .then(() => console.log('Sound played successfully'))
        .catch(error => console.error('Error playing sound:', error));
    }
  }, [play, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.onended = onPlayEnd;
    }
    return () => {
      if (audio) {
        audio.onended = null;
      }
    };
  }, [onPlayEnd]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const testSound = () => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => console.log('Test sound played successfully'))
        .catch(error => console.error('Error playing test sound:', error));
    }
  };

  return (
    <div>
      <audio ref={audioRef} src={soundUrl} />
      <button onClick={toggleMute} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
        {isMuted ? 'تفعيل الصوت' : 'كتم الصوت'}
      </button>
      <button onClick={testSound} className="bg-green-500 text-white px-4 py-2 rounded">
        اختبار الصوت
      </button>
    </div>
  );
}