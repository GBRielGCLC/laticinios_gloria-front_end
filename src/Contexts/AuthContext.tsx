import { createContext, useContext, useEffect, useState } from "react";
import { Api } from "../Services/Api/Axios-Config";
import { toast } from "react-toastify";

interface IUser {
    nome: string;
    funcao: string;
}

interface ILoginData {
    email: string;
    senha: string;
}

interface IAuthContextData {
    user: IUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: ILoginData) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<IAuthContextData>({} as IAuthContextData);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const userStorage = localStorage.getItem("user");
        const tokenStorage = localStorage.getItem("token");

        if (userStorage && tokenStorage) {
            setUser(JSON.parse(userStorage));
            setToken(tokenStorage);
        }

        setIsLoading(false);
    }, []);

    const login = async ({ email, senha }: ILoginData) => {
        setIsLoading(true);

        try {
            const { data } = await Api.post("/Usuario/Login", {
                email,
                senha,
            });

            localStorage.setItem("user", JSON.stringify(data));
            localStorage.setItem("token", data.token);

            setUser(data);
            setToken(data.token);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };


    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!user && !!token,
                isLoading,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);