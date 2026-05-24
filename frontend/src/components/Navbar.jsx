import React from 'react';
import {Link, useLocation} from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const linkAtivo = (caminho) => {
    return location.pathname === caminho
      ? 'bg-emerald-700 text-white'
      : 'text-white hover:bg-emerald-500';
  };

  return (
    <nav className="bg-emerald-400 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-emerald-700 font-extrabold text-2xl flex items-center">
              FAV.
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-3">
              <Link 
                to="/usuarios" 
                className={`px-3 py-1 text-sm font-medium ${linkAtivo('/usuarios')}`}
              >
                Usuários
              </Link>
              <Link 
                to="/produtos" 
                className={`px-3 py-1 text-sm font-medium ${linkAtivo('/produtos')}`}
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

        </div>
      </div>
    </nav>
  );
}