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
        
        <h2 className="text-xl font-bold text-gray-800 mb-2">Adicionar aos Favoritos</h2>
        <p className="text-sm text-gray-500 mb-6">
          Para qual cliente você deseja favoritar o produto <span className="font-semibold text-teal-600">"{produtoNome}"</span>?
        </p>

        {isLoading ? (
            <p className="p-8 text-center text-emerald-600 italic">Carregando...</p>
        ) : usuarios?.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-red-500 font-medium mb-4">Nenhum usuário cadastrado no sistema!</p>
            <button onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold">
              Fechar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Selecione o Usuário/Cliente</label>
              <select 
                {...register('id_usuario', { required: true })}
                className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-teal-500 focus:outline-none font-medium text-gray-700"
              >
                <option value="">-- Escolha um cliente --</option>
                {usuarios?.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.nome} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-2 justify-end">
              <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                disabled={carregando}
                className="px-5 py-2 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition disabled:opacity-50"
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
