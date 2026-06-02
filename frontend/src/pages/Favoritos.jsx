import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import axios from 'axios';
import Cardproduto from '../components/Cardproduto';

export default function Favoritos() {
  const queryClient = useQueryClient();
  
  const [usuarioSelecionadoId, setUsuarioSelecionadoId] = useState('');

  // 1. Buscar Lista de Usuários para o Dropdown
  const { data: usuarios, isLoading: loadingUsers } = useQuery({
    queryKey: ['usuarios'],
    queryFn: async () => {
      const response = await api.get('/usuarios');
      return response.data;
    }
  });

  // 2. Busca apenas os IDs dos favoritos no banco de dados
  const { data: favoritosRaw, isLoading: loadingFavoritos, isError: isErrorFavoritos } = useQuery({
    queryKey: ['favoritos', usuarioSelecionadoId],
    queryFn: async () => {
      const response = await api.get(`/usuarios/${usuarioSelecionadoId}/favoritos`);
      return response.data;
    },
    enabled: !!usuarioSelecionadoId,
  });

  // 3. Busca a lista completa de produtos
  const { data: produtosFakeStore, isLoading: loadingProdutos, isError: isErrorProdutos } = useQuery({
    queryKey: ['produtosFakeStore'],
    queryFn: async () => {
      const response = await axios.get('https://fakestoreapi.com/products');
      return response.data;
    },
    enabled: !!favoritosRaw && favoritosRaw.length > 0,
  });

  // 4. Crazando os dados
  // Filtra os produtos da FakeStore para mostrar apenas os que o usuário favoritou
  const produtosFavoritados = produtosFakeStore?.filter(produto => {
    return favoritosRaw?.some(fav => fav.id_produto === produto.id);
  }) || [];

  // 5. Deleta o favorito do banco de dados
  const removerFavorito = useMutation({
    mutationFn: async (idProduto) => {
      await api.delete(`/usuarios/${usuarioSelecionadoId}/favoritos/${idProduto}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['favoritos', usuarioSelecionadoId]);
      alert('Produto removido dos favoritos.');
    },
    onError: (erro) => {
      alert('Erro ao remover favorito: ' + (erro.response?.data?.error || erro.message));
    }
  });

  const isLoading = loadingUsers || (!!usuarioSelecionadoId && loadingFavoritos) || loadingProdutos;
  const isError = isErrorFavoritos || isErrorProdutos;

  if (isLoading) return <p className="p-8 text-center text-emerald-500 italic">Carregando favoritos...</p>;
  if (isError) return <p className="p-8 text-center text-red-500 italic">Erro ao carregar os dados de favoritos.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 ">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-emerald-500 pb-6">
        <h1 className="text-2xl font-bold text-black">
          Gerenciamento de Favoritos
        </h1>

        <div className="border-gray-300 flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Filtrar:</label>
          <select 
            value={usuarioSelecionadoId}
            onChange={(e) => setUsuarioSelecionadoId(e.target.value)}
            className="border rounded-md border-gray-300 p-2 bg-white text-gray-700 text-sm md:min-w-80 lg:min-w-72 w-full"
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
        <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-md">
          <p className="text-gray-500 text-md">Oops, selecione um usuário antes em "Filtrar"</p>
        </div>
      ) : produtosFavoritados.length === 0 ? (
        <div className="text-center py-16 border-2 border-dotted border-gray-300 rounded-md">
          <p className="text-gray-500 text-md">Este cliente ainda não possui produtos favoritados.</p>
        </div>
      ) : (
        <div>
          <div className="mb-4 text-sm italic text-gray-600">
            <span className="text-emerald-500 font-bold">({produtosFavoritados.length})</span> produto(s) favoritado(s) pelo usuário selecionado.
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtosFavoritados.map((item) => (
              <Cardproduto
                key={item.id}
                produto={item} 
                textoBotao="Remover"
                corBotao="bg-pink-500 hover:bg-pink-600"
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