// components/SoundPlayer.js
'use client';

import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

export default function SoundPlayer({ soundUrl, play, onPlayEnd }) {
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  useEffect(() => {
    if (play && !isMuted && isAudioEnabled && audioRef.current) {
      audioRef.current.play()
        .then(() => console.log('Sound played successfully'))
        .catch(error => {
          console.error('Error playing sound:', error);
          setIsAudioEnabled(false); // Reset if there's an error
          toast.error('فشل تشغيل الصوت. يرجى تفعيل الإشعارات الصوتية.');

        });
    }
  }, [play, isMuted, isAudioEnabled]);

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
    toast.success(isMuted ? 'تم تفعيل الصوت' : 'تم كتم الصوت');

  };

  const enableAudio = async () => {
    try {
      if (audioRef.current) {
        // Create a short, silent audio buffer
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const buffer = audioContext.createBuffer(1, 1, 22050);
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        await source.start(0);
        
        // If we reach here, audio is enabled
        setIsAudioEnabled(true);
        console.log('Audio enabled successfully');
        toast.success('تم تفعيل الإشعارات الصوتية');

      }
    } catch (error) {
      console.error('Error enabling audio:', error);
      toast.error('فشل تفعيل الإشعارات الصوتية. يرجى المحاولة مرة أخرى.');

    }
  };

  const testSound = () => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => {
          console.log('Test sound played successfully');
          setIsAudioEnabled(true);
          toast.success('تم تشغيل الصوت بنجاح');

        })
        .catch(error => {
          console.error('Error playing test sound:', error);
          setIsAudioEnabled(false);
          toast.error('فشل تشغيل الصوت. يرجى تفعيل الإشعارات الصوتية.');

        });
    }
  };

  return (
    <div>
      <audio ref={audioRef} src={soundUrl} />
      <button onClick={toggleMute} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
        {isMuted ? 'تفعيل الصوت' : 'كتم الصوت'}
      </button>
      <button onClick={testSound} className="bg-green-500 text-white px-4 py-2 rounded mr-2">
        اختبار الصوت
      </button>
      {!isAudioEnabled && (
        <button onClick={enableAudio} className="bg-yellow-500 text-white px-4 py-2 rounded">
          تفعيل الإشعارات الصوتية
        </button>
      )}
    </div>
  );
}