import * as yup from 'yup';
/* eslint-disable no-template-curly-in-string */

// Define mensagens globais
yup.setLocale({
    mixed: {
        required: 'Este campo é obrigatório',
        notType: 'Tipo inválido',
        oneOf: 'O valor precisa ser um dos seguintes: ${values}',
        defined: 'Este campo deve estar definido',
    },
    string: {
        min: 'Deve ter pelo menos ${min} caracteres',
        max: 'Deve ter no máximo ${max} caracteres',
        email: 'Deve ser um e-mail válido',
        url: 'Deve ser uma URL válida',
        length: 'Deve ter exatamente ${length} caracteres',
    },
    number: {
        min: 'Deve ser no mínimo ${min}',
        max: 'Deve ser no máximo ${max}',
        integer: 'Deve ser um número inteiro',
        positive: 'Deve ser um número positivo',
        negative: 'Deve ser um número negativo',
    },
    date: {
        min: 'Deve ser posterior a ${min}',
        max: 'Deve ser anterior a ${max}',
    },
    boolean: {
        isValue: 'Deve ser ${value}',
    },
    object: {
        noUnknown: 'Contém chaves desconhecidas',
    },
    array: {
        min: 'Deve ter no mínimo ${min} itens',
        max: 'Deve ter no máximo ${max} itens',
    },
});