"use client";

import { LINKEDIN_URL } from "@/config/constants";
import React, { useEffect, useState } from "react";

type LinkedInProfile = {
  name: string;
  url: string;
  description: string;
};

export default function AboutPage() {
  const [profile, setProfile] = useState<LinkedInProfile | null>(null);
  useEffect(() => {
    async function fetchLinkedIn() {
      // LinkedIn does not allow public API access for profile data, so we'll just show the link and a message
      setProfile({
        name: "Ganesh Joshi",
        url: LINKEDIN_URL,
        description: "Connect with me on LinkedIn for professional updates and networking."
      });
    }
    fetchLinkedIn();
  }, []);

  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 text-center">
      <h1 className="text-4xl font-bold mb-4 text-cyan-400">About Me</h1>
      <p className="text-lg text-gray-700 mb-6 max-w-xl">
        Hi, I&apos;m Ganesh Joshi. I&apos;m passionate about building innovative web experiences and sharing my journey with the world.
      </p>
      {profile && (
        <a
          href={profile.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 bg-gray-800/80 hover:bg-cyan-400/20 border border-gray-700 hover:border-cyan-400/50 rounded-lg text-white hover:text-cyan-400 transition-all duration-300 hover:scale-105"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          Connect on LinkedIn
        </a>
      )}
      <p className="mt-8 text-gray-500 text-sm max-w-md mx-auto">
        {profile?.description}
      </p>
    </section>
  );
}
