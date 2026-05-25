import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  // Estado para controlar a abertura/fechamento do menu no celular
  const [menuAberto, setMenuAberto] = useState(false);

  const linkAtivo = (caminho) => {
    return location.pathname === caminho
      ? 'bg-emerald-700 text-white'
      : 'text-white hover:bg-emerald-500';
  };

  return (
    <nav className="bg-emerald-400 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-emerald-700 font-extrabold text-2xl flex items-center">
              FAV.
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-3">
              <Link 
                to="/usuarios" 
                className={`px-3 py-1 text-sm font-medium  ${linkAtivo('/usuarios')}`}
              >
                Usuários
              </Link>
              <Link 
                to="/produtos" 
                className={`px-3 py-1 text-sm font-medium  ${linkAtivo('/produtos')}`}
              >
                Produtos
              </Link>
              <Link 
                to="/favoritos" 
                className={`px-3 py-1 text-sm font-medium ${linkAtivo('/favoritos')}`}
              >
                Meus Favoritos
              </Link>
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button 
              onClick={() => setMenuAberto(!menuAberto)}
              type="button" 
              className="inline-flex items-center justify-center p-3 text-white hover:bg-emerald-500"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menu principal</span>
              
              {menuAberto ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {menuAberto && (
        <div className="md:hidden bg-emerald-400 shadow-md pb-3 pt-2">
          <div className="px-2 space-y-1 sm:px-3">
            <Link 
              to="/usuarios" 
              onClick={() => setMenuAberto(false)}
              className={`block px-3 py-3 text-md font-medium ${linkAtivo('/usuarios')}`}
            >
              Usuários
            </Link>
            <Link 
              to="/produtos" 
              onClick={() => setMenuAberto(false)}
              className={`block px-3 py-3 text-md font-medium ${linkAtivo('/produtos')}`}
            >
              Produtos
            </Link>
            <Link 
              to="/favoritos" 
              onClick={() => setMenuAberto(false)}
              className={`block px-3 py-3 text-md font-medium ${linkAtivo('/favoritos')}`}
            >
              Meus Favoritos
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}