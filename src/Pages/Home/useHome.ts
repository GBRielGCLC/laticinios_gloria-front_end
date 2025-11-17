import { useEffect, useState } from "react";
import { IProdutoGET, ProdutoService } from "../../Services/Api/Produto";
import { toast } from "react-toastify";
import { set } from "react-hook-form";

export function useHome() {
    const [produtos, setProdutos] = useState<IProdutoGET>({
        dados: [],
        totalPaginas: 0,
        totalRegistros: 0
    });
    const [isLoading, setIsLoading] = useState(false)

    const listAllProducts = async () => {
        setIsLoading(true);

        ProdutoService.listarProdutos().then((result) => {
            setIsLoading(false);

            if (result instanceof Error) {
                setProdutos({ dados: [], totalPaginas: 0, totalRegistros: 0 });

                toast.error(result.message);
                return;
            }

            setProdutos(result);
        });
    };

    useEffect(() => {
        listAllProducts();
    }, []);

    return {
        produtos,
        isLoading,
        listAllProducts
    };
}