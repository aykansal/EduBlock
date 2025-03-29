"use client";

import { Youtube, Trophy, BookOpen, BarChart3 } from "lucide-react";

const features = [
  {
    icon: <Youtube className="h-8 w-8" />,
    title: "Import Any Playlist",
    description: "Paste any YouTube playlist URL to instantly create a structured course"
  },
  {
    icon: <BookOpen className="h-8 w-8" />,
    title: "Structured Learning",
    description: "Turn casual watching into organized learning with progress tracking"
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: "Track Your Progress",
    description: "Keep track of watched videos, completed courses, and learning milestones"
  },
  {
    icon: <Trophy className="h-8 w-8" />,
    title: "Earn While You Learn",
    description: "Get EduTokens for completing videos and courses that you can redeem for rewards"
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            How EduBlock Works
          </h2>
          <p className="mt-3 text-gray-500 max-w-md mx-auto">
            Transform your favorite YouTube content into structured learning experiences
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="mb-4 text-blue-600 bg-blue-50 p-3 rounded-full">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 max-w-2xl mx-auto text-center">
          <h3 className="text-xl font-semibold mb-4">Ready to transform how you learn from YouTube?</h3>
          <p className="text-gray-500 mb-8">
            Connect your wallet to start creating your own personalized curriculum from any YouTube content.
          </p>
        </div>
      </div>
    </section>
  );
}
