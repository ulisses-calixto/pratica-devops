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
      <div className="bg-gray-50 border rounded-md border-gray-300 max-w-md w-full p-6 m-4">
        
        <h2 className="text-2xl font-bold text-black mb-4">Adicionar favorito:</h2>
        <p className="text-sm text-gray-600 mb-4">
          Para qual cliente você deseja favoritar o produto 
          <span className="font-medium text-pink-600">"{produtoNome}"</span>?
        </p>

        {isLoading ? (
            <p className="p-8 text-center text-emerald-600 italic">Carregando...</p>
        ) : usuarios?.length === 0 ? (
          <div className="text-center">
            <p className="text-red-500 italic mb-4">Nenhum usuário cadastrado no sistema!</p>
            <button onClick={onClose} className="mt-2 py-2 w-full rounded-md bg-red-100 text-md font-medium text-red-500">
              Fechar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <div>
              <select 
                {...register('id_usuario', { required: true })}
                className="w-full rounded-md border text-sm border-gray-300 p-2  text-gray-800"
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
                className="w-full mt-2 py-2 rounded-md bg-red-100 text-md font-medium text-red-500"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                disabled={carregando}
                className="w-full mt-2 py-2 rounded-md bg-emerald-500 text-md font-medium text-white"
              >
                {carregando ? "" : 'Confirmar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
