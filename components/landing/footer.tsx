"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-50 py-12 border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Logo and tagline section */}
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center space-x-2 w-fit">
              <div className="h-7 w-7 rounded-full bg-blue-600"></div>
              <span className="font-bold text-lg">EduBlock</span>
            </Link>
            <p className="text-sm text-gray-500 max-w-xs">
              Transform YouTube playlists into structured courses. Track
              progress and earn rewards as you learn.
            </p>
          </div>

          {/* Links section */}
          {/* <div className="flex flex-col space-y-4">
            <h3 className="font-medium text-sm text-gray-900">Resources</h3>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-colors text-sm py-1"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-colors text-sm py-1"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-colors text-sm py-1"
              >
                Support
              </Link>
              <Link
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-colors text-sm py-1"
              >
                FAQ
              </Link>
            </div>
          </div> */}

          {/* Connect section */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-medium text-sm text-gray-900">Connect</h3>
            <div className="flex space-x-3">
              <Link
                href="https://x.com/harshkansal031"
                target="_blank"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 1200 1227"
                  fill="currentColor"
                >
                  <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" />
                </svg>
                <span className="sr-only">X (Twitter)</span>
              </Link>
              <Link
                href="https://github.com/harshkansal031"
                target="_blank"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://linkedin.com/in/harsh031"
                target="_blank"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
            <p className="text-sm text-gray-500">
              Have questions?{" "}
              <Link
                href="#"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Contact us
              </Link>
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 my-8"></div>

        {/* Copyright and attribution footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} EduBlock. All rights reserved.
          </p>
          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-100">
            <span className="font-normal">Developed by</span>
            <span className="mx-1 font-medium">
              <Link href="https://x.com/harshkansal031" target="_blank">
                Harsh Kansal
              </Link>
            </span>
            <span className="font-normal mx-0.5">|</span>
            <span className="font-normal">Powered by</span>
            <span className="mx-1 font-medium">EduChain</span>
            <span className="text-gray-500 text-[10px]">
              by{" "}
              <Link href="https://opencampus.xyz" target="_blank">
                OpenCampus
              </Link>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
