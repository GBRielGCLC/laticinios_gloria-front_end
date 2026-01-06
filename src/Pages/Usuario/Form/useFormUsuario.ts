import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yup } from "../../../Yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    IUsuario,
    IUsuarioPOST,
    UsuarioService,
} from "../../../Services/Api/Usuario";
import { toast } from "react-toastify";
import { FuncaoUsuarioService } from "../../../Services/Utils/FuncaoUsuario";

const validationSchema: yup.ObjectSchema<IFormUsuario> = yup.object({
    nome: yup.string().required("Nome é obrigatório"),
    email: yup
        .string()
        .email("E-mail inválido")
        .required("E-mail é obrigatório"),

    senha: yup.string().when("$isEditing", {
        is: false,
        then: (schema) => schema.required("Senha é obrigatória"),
        otherwise: (schema) => schema.notRequired(),
    }),

    funcao: yup.number().when("$isEditing", {
        is: false,
        then: schema => schema.required("Função é obrigatória"),
        otherwise: schema => schema.notRequired(),
    }),

    ativo: yup.boolean().required(),
});


interface IFormUsuario extends Omit<IUsuarioPOST, "senha" | "funcao"> {
    senha?: string;
    funcao?: number | string; // ← necessário para o Select
}

interface UseFormUsuarioProps {
    open: boolean;
    onClose: () => void;
    editingUser?: IUsuario | null;
    refreshTable?: () => void;
}

export function useFormUsuario({
    open,
    onClose,
    editingUser,
    refreshTable,
}: UseFormUsuarioProps) {
    const [isLoading, setIsLoading] = useState(false);

    const isEditing = !!editingUser;

    const {
        control,
        register,
        handleSubmit: hookFormSubmit,
        formState: { errors },
        reset,
    } = useForm<IFormUsuario>({
        resolver: yupResolver(validationSchema, {
            context: { isEditing },
        }),
        defaultValues: {
            nome: "",
            email: "",
            senha: "",
            ativo: true,
            funcao: "",
        },
    });

    useEffect(() => {
        if (open) {
            if (editingUser) {
                reset({
                    nome: editingUser.nome,
                    email: editingUser.email,
                    senha: "",
                    ativo: editingUser.ativo,
                    funcao:
                        FuncaoUsuarioService.findIdByNome(editingUser.funcao.toString()) ?? "",
                });

            } else {
                reset();
            }
        }
    }, [editingUser, open, reset]);

    const onSubmitHandler: SubmitHandler<IFormUsuario> = (data) => {
        setIsLoading(true);

        if (editingUser) {
            UsuarioService.editarUsuario(editingUser.id, data).then((result) => {
                setIsLoading(false);

                if (result instanceof Error) {
                    toast.error(result.message);
                    return;
                }

                toast.success("Usuário atualizado com sucesso!");
                refreshTable?.();
                onClose();
            });

        } else {
            UsuarioService.cadastrarUsuario({
                ...data,
                senha: data.senha as string,
                funcao: data.funcao as number
            }).then((result) => {
                setIsLoading(false);

                if (result instanceof Error) {
                    toast.error(result.message);
                    return;
                }

                toast.success("Usuário cadastrado com sucesso!");
                reset();
                refreshTable?.();
            });
        }
    };


    return {
        control,
        register,
        errors,
        isEditing,
        handleSubmit: hookFormSubmit(onSubmitHandler),
        isLoading,
    };
}
