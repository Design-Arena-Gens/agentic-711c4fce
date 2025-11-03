'use client';

import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [theme, setTheme] = useState<'motivation' | 'facts' | 'comedy'>('motivation');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const themes = {
    motivation: {
      title: 'МОТИВАЦИЯ 🔥',
      scenes: [
        { text: 'НЕ СДАВАЙСЯ!', bg: '#FF0000', emoji: '💪' },
        { text: 'ТЫ МОЖЕШЬ!', bg: '#FF6B00', emoji: '🚀' },
        { text: 'ДЕЙСТВУЙ!', bg: '#FFD700', emoji: '⚡' },
        { text: 'ПОБЕЖДАЙ!', bg: '#00FF00', emoji: '👑' },
      ]
    },
    facts: {
      title: 'ФАКТЫ 🤯',
      scenes: [
        { text: 'ЗНАЕТЕ ЛИ ВЫ?', bg: '#8B00FF', emoji: '🧠' },
        { text: 'АКУЛЫ СУЩЕСТВУЮТ', bg: '#0080FF', emoji: '🦈' },
        { text: '400 МЛН ЛЕТ', bg: '#00BFFF', emoji: '⏰' },
        { text: 'ЭТО НЕВЕРОЯТНО!', bg: '#FF1493', emoji: '🤯' },
      ]
    },
    comedy: {
      title: 'СМЕШНОЕ 😂',
      scenes: [
        { text: 'КОГДА В ПОНЕДЕЛЬНИК...', bg: '#FF4500', emoji: '😴' },
        { text: 'ПРОСЫПАЕШЬСЯ...', bg: '#FF6347', emoji: '⏰' },
        { text: 'И ПОНИМАЕШЬ...', bg: '#FFA500', emoji: '🤔' },
        { text: 'ЧТО ЕСТЬ КОФЕ! ☕', bg: '#32CD32', emoji: '😂' },
      ]
    }
  };

  const scenes = themes[theme].scenes;

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentScene((prev) => {
          if (prev >= scenes.length - 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, scenes.length]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scene = scenes[currentScene];
    let scale = 1;
    let rotation = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      ctx.fillStyle = scene.bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Animated particles
      for (let i = 0; i < 20; i++) {
        const x = (Math.sin(Date.now() / 1000 + i) * 200) + canvas.width / 2;
        const y = (Math.cos(Date.now() / 1000 + i * 1.5) * 300) + canvas.height / 2;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + Math.sin(Date.now() / 500 + i) * 0.1})`;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
      }

      // Pulsating effect
      scale = 1 + Math.sin(Date.now() / 200) * 0.1;
      rotation = Math.sin(Date.now() / 1000) * 0.05;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2 - 100);
      ctx.scale(scale, scale);
      ctx.rotate(rotation);

      // Emoji
      ctx.font = 'bold 150px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(scene.emoji, 0, 0);

      ctx.restore();

      // Text with shadow
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2 + 150);
      ctx.scale(1 + Math.sin(Date.now() / 150) * 0.05, 1 + Math.sin(Date.now() / 150) * 0.05);

      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillText(scene.text, 3, 3);

      // Main text
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(scene.text, 0, 0);

      ctx.restore();

      // Progress bar
      const progress = (currentScene / (scenes.length - 1)) * canvas.width;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillRect(0, canvas.height - 10, progress, 10);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentScene, scenes]);

  const handlePlay = () => {
    setCurrentScene(0);
    setIsPlaying(true);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'youtube-short.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      gap: '30px'
    }}>
      <h1 style={{
        fontSize: '48px',
        color: 'white',
        textAlign: 'center',
        margin: 0,
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        fontWeight: 'bold'
      }}>
        🎬 Вирусное Видео для YouTube Shorts
      </h1>

      <div style={{
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {(Object.keys(themes) as Array<keyof typeof themes>).map((t) => (
          <button
            key={t}
            onClick={() => {
              setTheme(t);
              setCurrentScene(0);
              setIsPlaying(false);
            }}
            style={{
              padding: '15px 30px',
              fontSize: '20px',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '15px',
              cursor: 'pointer',
              background: theme === t ? 'white' : 'rgba(255,255,255,0.3)',
              color: theme === t ? '#667eea' : 'white',
              transition: 'all 0.3s',
              boxShadow: theme === t ? '0 5px 15px rgba(0,0,0,0.3)' : 'none',
              transform: theme === t ? 'scale(1.1)' : 'scale(1)'
            }}
          >
            {themes[t].title}
          </button>
        ))}
      </div>

      <div style={{
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        background: 'black'
      }}>
        <canvas
          ref={canvasRef}
          width={608}
          height={1080}
          style={{
            display: 'block',
            maxWidth: '100%',
            height: 'auto',
            maxHeight: '70vh'
          }}
        />
      </div>

      <div style={{
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <button
          onClick={handlePlay}
          disabled={isPlaying}
          style={{
            padding: '20px 40px',
            fontSize: '24px',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '15px',
            cursor: isPlaying ? 'not-allowed' : 'pointer',
            background: isPlaying ? '#ccc' : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            transition: 'all 0.3s',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            opacity: isPlaying ? 0.6 : 1
          }}
        >
          {isPlaying ? '▶️ Играет...' : '▶️ Запустить'}
        </button>

        <button
          onClick={() => setCurrentScene((prev) => (prev - 1 + scenes.length) % scenes.length)}
          disabled={isPlaying}
          style={{
            padding: '20px 40px',
            fontSize: '24px',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '15px',
            cursor: isPlaying ? 'not-allowed' : 'pointer',
            background: isPlaying ? '#ccc' : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            transition: 'all 0.3s',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            opacity: isPlaying ? 0.6 : 1
          }}
        >
          ⏮️ Назад
        </button>

        <button
          onClick={() => setCurrentScene((prev) => (prev + 1) % scenes.length)}
          disabled={isPlaying}
          style={{
            padding: '20px 40px',
            fontSize: '24px',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '15px',
            cursor: isPlaying ? 'not-allowed' : 'pointer',
            background: isPlaying ? '#ccc' : 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: 'white',
            transition: 'all 0.3s',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            opacity: isPlaying ? 0.6 : 1
          }}
        >
          ⏭️ Вперёд
        </button>

        <button
          onClick={handleDownload}
          style={{
            padding: '20px 40px',
            fontSize: '24px',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '15px',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white',
            transition: 'all 0.3s',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
          }}
        >
          💾 Скачать Кадр
        </button>
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.2)',
        padding: '20px',
        borderRadius: '15px',
        color: 'white',
        textAlign: 'center',
        maxWidth: '600px',
        backdropFilter: 'blur(10px)'
      }}>
        <p style={{ margin: '0 0 10px 0', fontSize: '18px' }}>
          <strong>Кадр:</strong> {currentScene + 1} / {scenes.length}
        </p>
        <p style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>
          Выберите тему, нажмите "Запустить" чтобы увидеть анимацию, или листайте кадры вручную!
        </p>
      </div>
    </div>
  );
}
