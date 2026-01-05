import { useForm } from "react-hook-form";
import { useAuth } from "../../Contexts/AuthContext";
import { yupResolver } from "@hookform/resolvers/yup";
import { yup } from "../../Yup";
import { useState } from "react";

interface ILoginForm {
    email: string;
    senha: string;
}

const loginSchema = yup.object({
  email: yup
    .string()
    .email('E-mail inválido')
    .required('Informe o e-mail'),
  senha: yup
    .string()
    .required('Informe a senha'),
});

export const useLogin = () => {
    const { login, isLoading } = useAuth();

    const [showPassword, setShowPassword] = useState(false)

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<ILoginForm>({
        resolver: yupResolver(loginSchema),
        defaultValues: {
            email: "",
            senha: ""
        },
    });

    const onSubmit = async (data: ILoginForm) => {
        await login(data);
    };

    return {
        control,
        handleSubmit,
        onSubmit,
        errors,
        isLoading,

        showPassword,
        setShowPassword
    };
};