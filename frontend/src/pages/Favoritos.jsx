import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

import Cardproduto from '../components/Cardproduto';

export default function Favoritos() {
  const queryClient = useQueryClient();
  
  // Estado para controlar qual cliente estamos visualizando
  const [usuarioSelecionadoId, setUsuarioSelecionadoId] = useState('');

  // ==========================================
  // 1. READ: Buscar Lista de Usuários para o Dropdown
  // ==========================================
  const { data: usuarios, isLoading: loadingUsers } = useQuery({
    queryKey: ['usuarios'],
    queryFn: async () => {
      const response = await api.get('/usuarios');
      return response.data;
    }
  });

  // ==========================================
  // 2. READ: Buscar Favoritos do Usuário Selecionado
  // ==========================================
  // Esta busca só é ativada (enabled) quando um ID de usuário é selecionado no select
  const { data: favoritosRaw, isLoading: loadingFavoritos, isError } = useQuery({
    queryKey: ['favoritos', usuarioSelecionadoId],
    queryFn: async () => {
      const response = await api.get(`/usuarios/${usuarioSelecionadoId}/favoritos`);
      return response.data;
    },
    enabled: !!usuarioSelecionadoId, // Evita requisições com id vazio
  });

  // ==========================================
  // 3. DELETE: Remover dos Favoritos 
  // ==========================================
  // Utiliza a sua rota exata: /usuarios/:id_usuario/favoritos/:id_produto
  const removerFavorito = useMutation({
    mutationFn: async (idProduto) => {
      await api.delete(`/usuarios/${usuarioSelecionadoId}/favoritos/${idProduto}`);
    },
    onSuccess: () => {
      // Invalida apenas o cache de favoritos daquele usuário específico
      queryClient.invalidateQueries(['favoritos', usuarioSelecionadoId]);
      alert('Produto removido dos favoritos.');
    },
    onError: (erro) => {
      alert('Erro ao remover favorito: ' + (erro.response?.data?.error || erro.message));
    }
  });

  // mapeando
  const produtosFavoritados = favoritosRaw?.map((item) => ({
    id: item.id,
    image: item.imagem,
    title: item.titulo,
    price: item.preco,
    rating: item.avaliacao
  })) || [];

  const isLoading = loadingUsers || (!!usuarioSelecionadoId && loadingFavoritos);

  if (isLoading) return <p className="p-8 text-center text-emerald-500 italic">Carregando favoritos...</p>;
  if (isError) return <p className="p-8 text-center text-red-500 italic">Erro ao carregar os dados de favoritos do banco de dados.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 ">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-emerald-400 pb-6">
        <h1 className="text-2xl font-bold text-gray-800  ">
          Gerenciamento de Favoritos
        </h1>

        <div className="bg-gray-100 border-gray-300 flex items-center gap-2 ">
          <label className="text-xs font-medium text-gray-700">Filtrar:</label>
          <select 
            value={usuarioSelecionadoId}
            onChange={(e) => setUsuarioSelecionadoId(e.target.value)}
            className="border border-gray-300 p-1 bg-white text-gray-700 text-sm min-w-[180px]"
          >
            <option value="">Selecione um usuário</option>
            {usuarios?.map((user) => (
              <option key={user.id} value={user.id}>
                {user.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!usuarioSelecionadoId ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-300">
          <p className="text-gray-500 text-md">Oops, selecione um usuário antes em "Filtrar"</p>
        </div>
      ) : produtosFavoritados.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-100">
          <p className="text-gray-400 italic text-lg">Este cliente ainda não possui produtos favoritados.</p>
        </div>
      ) : (
        <div>
          <div className="mb-4 text-sm italic text-gray-600">
            <span className="text-emerald-600 ">({produtosFavoritados.length})</span> produto(s) favoritado(s) pelo usuário selecionado.
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {produtosFavoritados.map((item) => (
              <Cardproduto
                key={item.id}
                produto={item} 
                textoBotao="Remover"
                corBotao="bg-pink-50 hover:bg-pink-100"
                carregando={removerFavorito.isPending}
                aoClicarBotao={() => {
                  if (window.confirm(`Remover "${item.title}" dos favoritos deste cliente?`)) {
                    removerFavorito.mutate(item.id);
                  }
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}