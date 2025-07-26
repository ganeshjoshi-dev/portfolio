"use client";
import { useEffect, useState } from "react";

export default function ComingSoon() {
  const [time, setTime] = useState({days:0, hours:0, minutes:0, seconds:0});

  useEffect(() => {
    const target = new Date("2025-12-31T00:00:00").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;
      setTime({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-6 text-center">
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 animate-pulse">
        🚀 Coming Soon
      </h1>
      <p className="text-base sm:text-lg md:text-xl max-w-md mb-8 opacity-80">
        Something amazing by <span className="text-cyan-400">Ganesh Joshi</span> is launching soon!
      </p>

      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-center">
        <div className="w-20 sm:w-24">
          <span className="block text-3xl sm:text-4xl font-bold">{time.days}</span>
          <span className="text-sm sm:text-base">Days</span>
        </div>
        <div className="w-20 sm:w-24">
          <span className="block text-3xl sm:text-4xl font-bold">{time.hours}</span>
          <span className="text-sm sm:text-base">Hours</span>
        </div>
        <div className="w-20 sm:w-24">
          <span className="block text-3xl sm:text-4xl font-bold">{time.minutes}</span>
          <span className="text-sm sm:text-base">Minutes</span>
        </div>
        <div className="w-20 sm:w-24">
          <span className="block text-3xl sm:text-4xl font-bold">{time.seconds}</span>
          <span className="text-sm sm:text-base">Seconds</span>
        </div>
      </div>

      <footer className="absolute bottom-4 text-xs sm:text-sm opacity-50">
        © {new Date().getFullYear()} Ganesh Joshi. All rights reserved.
      </footer>
    </div>
  );
}