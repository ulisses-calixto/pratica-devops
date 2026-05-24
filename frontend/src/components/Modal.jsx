import React from 'react';
import {useQuery} from '@tanstack/react-query';
import {useForm} from 'react-hook-form';
import {api} from '../services/api';

export default function Modal({isOpen, onClose, onConfirm, produtoNome, carregando}) {
  const {register, handleSubmit, reset} = useForm();

  const { data: usuarios, isLoading } = useQuery({
    queryKey: ['usuarios'],
    queryFn: async () => {
      const response = await api.get('/usuarios');
      return response.data;
    },
    enabled: isOpen,
  });

  if (!isOpen) return null;

  const onSubmit = (dados) => {
    onConfirm(dados.id_usuario);
    reset();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white border border-gray-300 max-w-md w-full p-6 m-4">
        
        <h2 className="text-xl font-medium text-gray-800 mb-2">Adicionar aos Favoritos</h2>
        <p className="text-sm text-gray-500 mb-4">
          Para qual cliente você deseja favoritar o produto 
          <span className="font-medium text-pink-600">"{produtoNome}"</span>?
        </p>

        {isLoading ? (
            <p className="p-8 text-center text-emerald-600 italic">Carregando...</p>
        ) : usuarios?.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-300 italic mb-4">Nenhum usuário cadastrado no sistema!</p>
            <button onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2">
              Fechar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <div>
              <select 
                {...register('id_usuario', { required: true })}
                className="w-full border text-sm border-gray-300 p-1  text-gray-800"
              >
                <option value="">Selecione um usuário</option>
                {usuarios?.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4 pt-2 justify-center">
              <button 
                type="button" 
                onClick={onClose}
                className="w-full bg-red-50 text-red-500 text-sm font-medium py-2 px-4 hover:bg-red-100"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                disabled={carregando}
                className="w-full text-black text-sm font-medium py-2 px-4 bg-emerald-300 hover:bg-emerald-400"
              >
                {carregando ? 'Salvando...' : 'Confirmar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
