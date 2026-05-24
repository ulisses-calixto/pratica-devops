import React, {useState} from 'react';
import {useQuery, useMutation} from '@tanstack/react-query';
import {api} from '../services/api';
import Cardproduto from '../components/Cardproduto';
import Modal from '../components/Modal';

export default function Produtos() {
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  //busca produtos
  const { data: produtos, isLoading, isError } = useQuery({
    queryKey: ['produtos'],
    queryFn: async () => {
      const response = await api.get('/produtos');
      return response.data;
    }
  });

  //criar favorito
  const favoritarProduto = useMutation({
    mutationFn: async ({ id_usuario, id_produto }) => {
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

  if (isLoading) return <p className="p-8 text-center text-emerald-600 italic">Carregando produtos...</p>;
  if (isError) return <p className="p-8 text-center text-red-600 italic">Erro ao carregar produtos.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-emerald-300 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Catálogo de Produtos
          </h1>
          <p className="text-gray-500 text-sm mt-1">Selecione produtos e associe-os aos favoritos dos usuários.</p>
        </div>
      </div>

      {produtos?.length === 0 ? (
        <p className="text-gray-500 italic text-center py-10">Nenhum produto encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {produtos?.map((prod) => (
            <Cardproduto
              key={prod.id}
              produto={prod}
              textoBotao="Favoritar"
              corBotao="bg-teal-600 hover:bg-teal-700"
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