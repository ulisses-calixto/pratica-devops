import React, {useState, useEffect} from 'react';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {useForm} from 'react-hook-form';
import {api} from '../services/api';

export default function UsuariosCRUD() {
  const queryClient = useQueryClient();
  const {register, handleSubmit, reset, setValue} = useForm();

  const [editandoUsuario, setEditandoUsuario] = useState(null);

  //buscar
  const { data: usuarios, isLoading, isError } = useQuery({
    queryKey: ['usuarios'],
    queryFn: async () => {
      const response = await api.get('/usuarios');
      return response.data;
    }
  });

  //criar
  const criarUsuario = useMutation({
    mutationFn: async (novoUsuario) => {
      await api.post('/usuarios', novoUsuario);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['usuarios']);
      reset();
      alert('Usuário cadastrado com sucesso!');
    },
    onError: (erro) => {
      alert('Erro ao criar usuário: ' + erro.message);
    }
  });

  //atualizar
  const atualizarUsuario = useMutation({
    mutationFn: async ({id, dados}) => {
      await api.put(`/usuarios/${id}`, dados);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['usuarios']);
      setEditandoUsuario(null);
      reset();
      alert('Usuário atualizado!');
    },
    onError: (erro) => {
      alert('Erro ao atualizar usuário:' + erro.message);
    }
  });

  //deletar
  const deletarUsuario = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/usuarios/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['usuarios']);
    }
  });


  useEffect(() => {
    if(editandoUsuario) {
      setValue('nome', editandoUsuario.nome);
      setValue('email', editandoUsuario.email);
    } else{
      reset();
    }
  }, [editandoUsuario, setValue, reset]);

  const onSubmit = (dados) => {
    if (editandoUsuario) {
      atualizarUsuario.mutate({id: editandoUsuario.id, dados})
    } else {
      criarUsuario.mutate(dados);
    }
  };

  const cancelarEdicao = () => {
    setEditandoUsuario(null);
  };

  //tela
  if (isLoading) return <p className="p-8 text-center text-emerald-500 italic">Carregando usuários...</p>;
  if (isError) return <p className="p-8 text-center text-red-500 italic">Erro de conexão com o banco de dados.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-8 border-b border-emerald-400 pb-6">
        Gerenciamento de Usuários
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className='p-6 border rounded-md bg-white border-gray-300'>
          <h2 className={'text-md font-medium mb-4'}>
            {editandoUsuario ? `Editando: ${editandoUsuario.id}` : 'Novo Usuário'}
          </h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <input 
                {...register('nome', { required: true })}
                type="text" 
                className="w-full text-sm border rounded-md border-gray-300 p-2"
                placeholder="Nome Sobrenome"
              />
            </div>
            
            <div>
              <input 
                {...register('email', { required: true })}
                type="email" 
                className="w-full text-sm border rounded-md border-gray-300 p-2"
                placeholder="E-mail"
              />
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <button 
                type="submit" 
                disabled={criarUsuario.isPending || atualizarUsuario.isPending}
                className={`w-full py-2 rounded-md text-white font-medium ${editandoUsuario ? 'bg-purple-500 hover:bg-purple-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
              >
                {editandoUsuario ? 'Salvar' : 'Cadastrar Usuário'}
              </button>

              {editandoUsuario && (
                <button 
                  type="button" 
                  onClick={cancelarEdicao}
                  className="w-full py-2 rounded-md bg-red-100 text-md font-medium text-red-500"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="md:col-span-2 p-6 rounded-md bg-white border border-gray-300">
          <h2 className="text-md font-medium mb-4 text-black">Usuários Cadastrados ({usuarios?.length || 0})</h2>
          
          {usuarios?.length === 0 ? (
            <p className="text-red-500 text-sm italic">Nenhum usuário cadastrado.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-b ">
                <thead>
                  <tr className="text-gray-500 text-sm bg-gray-100">
                    <th className="p-2 border-b">ID</th>
                    <th className="p-2 border-b">Nome</th>
                    <th className="p-2 border-b">E-mail</th>
                    <th className="p-2 border-b text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {usuarios.map((user) => (
                    <tr key={user.id} className='text-sm'>
                      <td className="p-2">#{user.id}</td>
                      <td className="p-2">{user.nome}</td>
                      <td className="p-2">{user.email}</td>
                      <td className="p-2 text-right space-x-2">
                        <button 
                          onClick={() => setEditandoUsuario(user)}
                          className="py-1 px-2 rounded-md bg-purple-100 text-purple-500 hover:bg-purple-200 font-medium text-sm"
                        >Editar
                        </button>
                        <button
                          onClick={() => {
                            if(window.confirm(`Tem certeza que deseja excluir ${user.nome}?`)) {
                              deletarUsuario.mutate(user.id);
                              if(editandoUsuario?.id === user.id) setEditandoUsuario(null);
                            }
                          }}
                          className="py-1 px-2 rounded-md bg-red-100 text-red-500 hover:bg-red-200 font-medium text-sm"
                        > Deletar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}