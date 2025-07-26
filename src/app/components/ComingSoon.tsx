"use client";
import { useEffect, useState } from "react";
import { GITHUB_URL, LINKEDIN_URL } from "@/config/constants";

export default function ComingSoon() {
  const [time, setTime] = useState({days:0, hours:0, minutes:0, seconds:0});

  useEffect(() => {
    const target = new Date("2025-12-31T00:00:00").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = target - now;
      
      if (diff > 0) {
        setTime({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      } else {
        setTime({days: 0, hours: 0, minutes: 0, seconds: 0});
        clearInterval(interval);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">      
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-6 text-center pt-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 animate-pulse">
            🚀 Coming Soon
          </h1>
          <p className="text-base sm:text-lg md:text-xl max-w-md mx-auto mb-8 opacity-80">
            Something amazing by <span className="text-cyan-400 font-semibold">Ganesh Joshi</span> is launching soon!
          </p>

          {/* Countdown Timer */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-center mb-8">
            {[
              { label: 'Days', value: time.days },
              { label: 'Hours', value: time.hours },
              { label: 'Minutes', value: time.minutes },
              { label: 'Seconds', value: time.seconds }
            ].map((item) => (
              <div key={item.label} className="w-20 sm:w-24 group">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105">
                  <span className="block text-3xl sm:text-4xl font-bold text-cyan-400 group-hover:animate-pulse">
                    {item.value.toString().padStart(2, '0')}
                  </span>
                  <span className="text-sm sm:text-base text-gray-300 font-medium">
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Call to Action */}
          <div className="space-y-4">
            <p className="text-sm sm:text-base text-gray-400 max-w-lg mx-auto">
              Stay tuned for an incredible portfolio experience featuring cutting-edge projects and innovative solutions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href={GITHUB_URL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gray-800/80 hover:bg-cyan-400/20 border border-gray-700 hover:border-cyan-400/50 rounded-lg text-white hover:text-cyan-400 transition-all duration-300 hover:scale-105 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>Follow on GitHub</span>
              </a>
              <a 
                href={LINKEDIN_URL}
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gray-800/80 hover:bg-cyan-400/20 border border-gray-700 hover:border-cyan-400/50 rounded-lg text-white hover:text-cyan-400 transition-all duration-300 hover:scale-105 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span>Connect on LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}