"use client";

import { WalletSection } from "../wallet-section";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-16 md:py-24">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-64 h-64 rounded-full bg-blue-100 -top-10 -right-16 opacity-50" />
        <div className="absolute w-64 h-64 rounded-full bg-blue-100 -bottom-10 -left-16 opacity-50" />
      </div>

      {/* Content */}
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
              Powered by
              <span className="font-bold"> &nbsp;EduChain&nbsp;</span> from
              <span className="font-bold"> &nbsp;OpenCampus&nbsp;</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-4 sm:mb-6">
            Turn YouTube Playlists
            <span className="text-blue-600 block">Into Courses</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 mx-auto max-w-lg mb-8 sm:mb-10">
            Transform any YouTube playlist into a structured course, track your
            progress, and earn tokens while you learn. Connect your wallet to
            start.
          </p>

          <div className="max-w-sm mx-auto mb-8">
            <WalletSection />
          </div>

          <a
            href="#features"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            See how it works <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>

        {/* Stats */}
        <div className="mt-16 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <p className="text-3xl font-bold text-blue-600 mb-1">100+</p>
            <p className="text-gray-600 text-sm">YouTube Playlists</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <p className="text-3xl font-bold text-blue-600 mb-1">20+</p>
            <p className="text-gray-600 text-sm">Topic Categories</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <p className="text-3xl font-bold text-blue-600 mb-1">1M+</p>
            <p className="text-gray-600 text-sm">EduTokens Earned</p>
          </div>
        </div>
      </div>
    </section>
  );
}
