"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, MessageCircle, ExternalLink, PhoneCall } from 'lucide-react';
import Link from 'next/link';

const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;
    const particleCount = 80;

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };

    class Particle {
      constructor() {
        this.init();
      }
      init() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.update();
        p.draw();
        for (let j = i + 1; j < particles.length; j++) {
          const dx = p.x - particles[j].x;
          const dy = p.y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.4 - dist / 120})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    init();
    animate();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none" 
      style={{ zIndex: 20, opacity: 0.6 }}
    />
  );
};

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);
  const cursorRef = useRef(null);
  const [cursorType, setCursorType] = useState("default");

  const slides = [
    {
      title: "KGF LOTTERy AGENCY",
      desc: "KGF லாட்டரி ஏஜென்சி - வெற்றி வேண்டுமா? எங்களைத் தேர்வுசெய்யவும்!",
      img: "/assets/heroimg2.jpg", 
      btnText: "Contact us now",
      link: "/results",
      welcome: "Welcome to",
      location:"Gopalapuram"
    },
    {
      title: "KGF LOTTERY AGENCY",
      desc: "KGF லாட்டரி ஏஜென்சி - வெற்றி வேண்டுமா? எங்களைத் தேர்வுசெய்யவும்!",
      img: "/assets/heroimg.jpg", 
      btnText: "Contact us now",
      link: "/results",
      welcome: "Welcome to",
       location:"Gopalapuram"
    },
    {
      title: "KGF LOTTERY AGENCY",
      desc: "KGF லாட்டரி ஏஜென்சி - வெற்றி வேண்டுமா? எங்களைத் தேர்வுசெய்யவும்!",
      img: "/assets/HomeAboutImg.jpg", 
      btnText: "Contact us now",
      link: "/results",
      welcome: "Welcome to",
       location:"Gopalapuram"
    }
  ];

  const next = useCallback(() => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const prev = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const moveCursor = (e) => {
      if (!cursorRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      cursorRef.current.animate({ left: `${x}px`, top: `${y}px` }, { duration: 400, fill: "forwards" });
    };
    const container = containerRef.current;
    container.addEventListener('mousemove', moveCursor);
    return () => container.removeEventListener('mousemove', moveCursor);
  }, []);

  useEffect(() => {
    // if (isPaused) return;
    const timer = setInterval(() => next(), 3000);
    return () => clearInterval(timer);
  }, [next, isPaused]);

  return (
    <div 
      ref={containerRef}
      className="relative h-[600px] md:h-[590px] w-full overflow-hidden bg-[#0a0a0a]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{ cursor: 'none' }} 
    >
      <ParticleBackground />

      <div
        ref={cursorRef}
        className={`pointer-events-none absolute z-[100] rounded-full transition-all duration-300 mix-blend-difference hidden md:flex items-center justify-center ${
          cursorType === "button" ? "w-16 h-16 bg-white" : "w-6 h-6 border border-white"
        }`}
        style={{ transform: "translate(-50%, -50%)" }}
      >
        {cursorType === "button" && <ExternalLink size={16} className="text-black" />}
      </div>

      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[5000ms]"
            style={{ 
                backgroundImage: `url(${slide.img})`,
                filter: 'brightness(0.3) contrast(1.1)',
                transform: index === current ? 'scale(1.1)' : 'scale(1)'
            }}
          />

          <div className="relative h-full flex flex-col items-center justify-center text-center px-6 z-30 mt-10">
            <div className="max-w-4xl space-y-4 overflow-visible">
              <span className="inline-block px-3 py-1 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
                {slide.welcome}
              </span>
              <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter">
                {slide.title.split(' ')[0]} <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-blue-500">
                  {slide.title.split(' ').slice(1).join(' ')}
                </span>
              </h2>
              <span className="inline-block px-3 py-1 rounded-full bg-white text-black text-[11px] font-extrabold uppercase tracking-widest">
  {slide.location}
</span>

              <p className="text-base md:text-lg text-gray-400 font-medium max-w-xl mx-auto">
                {slide.desc}
              </p>
              
              {/* UPDATED BUTTON SECTION */}
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
  href={`tel:${slide.phoneNumber || "+919074606020"}`} 
  onMouseEnter={() => setCursorType("button")}
  onMouseLeave={() => setCursorType("default")}
  className="group relative inline-flex items-center justify-center overflow-hidden bg-blue-600 text-white font-black px-10 py-3.5 rounded-full text-sm tracking-widest uppercase transition-all hover:shadow-orange-200"
>
  {/* The Text Label */}
  <span className="relative z-10 flex items-center gap-2">
    <PhoneCall size={16} className="group-hover:animate-shake" />
    {slide.btnText || "Contact Now"}
  </span>

  {/* The Animated Orange Background Layer */}
  <div className="absolute inset-0 bg-orange-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
</a>
                <a 
                  href="https://wa.me/919074606020" 
                  onMouseEnter={() => setCursorType("button")}
                  onMouseLeave={() => setCursorType("default")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden bg-green-500 text-white font-black px-10 py-3.5 rounded-full text-sm flex items-center gap-2"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <MessageCircle size={18} />
                    WHATSAPP
                  </span>
                  <div className="absolute inset-0 bg-green-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}

      
    </div>
  );
};

export default HeroCarousel;