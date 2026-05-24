import React from 'react';

export default function Footer() {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className=" border-t border-gray-300 mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex space-x-2 text-xs text-gray-500">
                <a href="https://github.com/spaaws" className="hover:underline">
                Prof. Welligton Feitosa
                </a>
                <span>|</span>
                <span>
                DevOps Tools
                </span>
            </div>
            <div className="text-gray-500 text-xs text-center md:text-left">
                <span>37023059 - Ulisses G. Calixto</span>
            </div>
        </div>
      </div>
    </footer>
  );
}
