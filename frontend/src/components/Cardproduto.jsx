import React from 'react';

export default function Cardproduto({ produto, textoBotao, corBotao, aoClicarBotao, carregando }) {
  if (!produto) return null;

  const preco = Number(produto.price) || 0;

  return (
    <div className="bg-white border border-gray-300 overflow-hidden flex flex-col">
      
      <div className="h-48 bg-white p-4 flex justify-center items-center border-b border-gray-100">
        <img 
          src={produto.image} 
          className="max-h-full max-w-full object-contain mix-blend-multiply" 
        />
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <span className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">
          #{produto.id || 'Geral'}
        </span>
        

        <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mb-2 flex-grow" title={produto.title}>
          {produto.title}
        </h3>

        <span className="text-xs text-amber-500 tracking-wider mb-1">
          ⭐{produto.rating?.rate} ({produto.rating?.count} Avaliações)
        </span>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold">
            R$ {preco.toFixed(2).replace('.', ',')}
          </span>
          
          <button 
            onClick={() => aoClicarBotao(produto)}
            disabled={carregando}
            className={`px-4 py-2 text-sm font-medium text-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${corBotao}`}
          >
            {carregando ? 'Aguarde...' : textoBotao}
          </button>
        </div>
      </div>
    </div>
  );
}