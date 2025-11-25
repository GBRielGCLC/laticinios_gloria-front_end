import { AxiosError } from 'axios';

//Tratamento de erros:
export const errorInteceptor = (error: AxiosError) => {

  if (error.message === 'Network Error') {// erro de conexão
    return Promise.reject(new Error('Erro ao se comunicar com o servidor, verifique sua conexão com a internet, caso persista o sistema pode estar fora do ar.'));
  }
  if (error.response?.status === 400) {// erro 400 (algo informado errado)
    return Promise.reject(new Error(extractMessage(error.response.data)));
  }
  if (error.response?.status === 401) {// erro de autenticação
    return Promise.reject(new Error('Você não está autenticado ou não tem essa permissão, por favor faça login novamente.'));
  }
  if(error.response?.status === 404 && !error.response.data) {
    return Promise.reject(new Error('Registro não encontrado!'));
  }
  if (error.response?.status === 500) {// erro 500
    console.error(`${error.config?.method} ${error.config?.url}: ${extractMessage(error.response?.data)}`);
    return Promise.reject(new Error('Erro interno do servidor'));
  }

  function defaultMessageByRequestType(error: AxiosError) {
    if (error.config?.method) {
      switch (error.config.method) {
        case 'get':
          return 'Erro ao consultar o registro';
        case 'post':
          return 'Erro ao criar o registro';
        case 'put':
        case 'patch':
          return 'Erro ao editar o registro';
        case 'delete':
          return 'Erro ao deletar o registro';
      }
    }
    return 'Erro inesperado';
  }

  function extractMessage(data: any): string {
    if (!data) return defaultMessageByRequestType(error);

    if (typeof data === 'string') return data;

    if (typeof data === 'object') {
      if (data.errors) {
        const messages = Object.values(data.errors).flat();
        return messages.join('\n'); // ou só messages[0] se quiser a primeira apenas
      }
      if (data.error) return data.error;
    }

    return defaultMessageByRequestType(error);
  }

  console.error(`${error.config?.method} ${error.config?.url}: ${extractMessage(error.response?.data)}`);
  return Promise.reject(new Error(extractMessage(error.response?.data)));
};