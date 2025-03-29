"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-600 mr-2"></div>
            <div className="flex flex-col">
              <span className="font-bold text-lg sm:text-xl">EduBlock</span>
              <span className="text-[10px] leading-tight text-gray-500">powered by <span className="text-blue-600">EduChain</span></span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8">
            <Link 
              href="#features" 
              className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
            >
              How It Works
            </Link>
            <Link 
              href="#" 
              className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
            >
              Any Content
            </Link>
          </nav>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 text-gray-500 hover:text-gray-700 focus:outline-hidden" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t py-3 px-4 bg-white flex flex-col gap-4">
          <Link 
            href="#features" 
            className="text-sm py-2 font-medium text-gray-600 hover:text-blue-600"
            onClick={() => setIsMenuOpen(false)}
          >
            How It Works
          </Link>
          <Link 
            href="#" 
            className="text-sm py-2 font-medium text-gray-600 hover:text-blue-600"
            onClick={() => setIsMenuOpen(false)}
          >
            Any Content
          </Link>
        </div>
      )}
    </header>
  );
} 