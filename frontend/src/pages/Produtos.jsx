import React, {useState} from 'react';
import {useQuery, useMutation} from '@tanstack/react-query';
import {api} from '../services/api';
import axios from 'axios';
import Cardproduto from '../components/Cardproduto';
import Modal from '../components/Modal';

export default function Produtos() {
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  //busca produtos
  const { data: produtos, isLoading, isError } = useQuery({
    queryKey: ['produtos'],
    queryFn: async () => {
      const response = await axios.get('https://fakestoreapi.com/products');
      return response.data;
    }
  });

  //criar favorito
  const favoritarProduto = useMutation({
    mutationFn: async ({id_usuario, id_produto}) => {
      await api.post('/favoritos', {
        id_usuario: String(id_usuario),
        id_produto: String(id_produto)
      });
    },
    onSuccess: () => {
      setModalAberto(false);
      setProdutoSelecionado(null);
      alert('Produto adicionado aos favoritos!');
    },
    onError: (erro) => {
      alert('Erro ao favoritar produto: ' + (erro.response?.data?.error || erro.message));
    }
  });

  const clicarFavoritar = (produto) => {
    setProdutoSelecionado(produto);
    setModalAberto(true);
  };

  // Função disparada quando o operador escolhe o usuário dentro do modal e confirma
  const clicarConfirmacaoModal = (idUsuario) => {
    if (!produtoSelecionado) return;
    
    favoritarProduto.mutate({
      id_usuario: idUsuario,
      id_produto: produtoSelecionado.id
    });
  };

  if (isLoading) return <p className="p-8 text-center text-emerald-500 italic">Carregando produtos...</p>;
  if (isError) return <p className="p-8 text-center text-red-500 italic">Erro ao carregar produtos da API externa.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-black mb-8 border-b border-emerald-400 pb-6">
          Catálogo de Produtos
        </h1>

      {produtos?.length === 0 ? (
        <p className="text-gray-500 italic text-center py-10">Nenhum produto encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {produtos?.map((prod) => (
            <Cardproduto
              key={prod.id}
              produto={prod}
              textoBotao="Favoritar"
              corBotao="bg-pink-500 hover:bg-pink-600"
              aoClicarBotao={clicarFavoritar}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={modalAberto}
        onClose={() => {
          setModalAberto(false);
          setProdutoSelecionado(null);
        }}
        onConfirm={clicarConfirmacaoModal}
        produtoNome={produtoSelecionado?.title}
        carregando={favoritarProduto.isPending}
      />
    </div>
  );
}