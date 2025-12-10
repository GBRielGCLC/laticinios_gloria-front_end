import { useCallback, useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import axios from "axios";
import { ItemService } from "../../Services/Api/Item";

export interface IVendaPOST {
    itemId: number;
    quantidade: number;
    dataVenda: string;
    valorTotal: number;
    formaPagamento: number;
    observacoes?: string;
}

export function useFormVenda() {
    const [itens, setItens] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // ⬇️ SCHEMA
    const schema = yup.object({
        itemId: yup.number().required("Selecione um item"),
        quantidade: yup.number().required("Informe a quantidade").min(1),
        formaPagamento: yup.number().required("Forma de pagamento é obrigatória"),
        observacoes: yup.string().nullable(),
    });

    // ⬇️ FORM
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
        reset
    } = useForm<IVendaPOST>({
        // resolver: yupResolver(schema),
        defaultValues: {
            itemId: undefined,
            quantidade: undefined,
            formaPagamento: 1,
            observacoes: "",
        },
    });

    // ⬇️ CAMPOS OBSERVADOS
    const itemId = watch("itemId");
    const quantidade = watch("quantidade");

    const selectedItem = itens.find((i) => i.id === itemId);

    const valorTotal =
        selectedItem && quantidade
            ? quantidade * selectedItem.preco
            : 0;

    // ⬇️ BUSCAR ITENS
    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await axios.get("/item");
                setItens(data);
            } catch {
                toast.error("Erro ao carregar itens");
            }
        }
        // fetchData();
    }, []);

    const getDadosSelects = useCallback(() => {
        ItemService.listarItens().then((result) => {

            if (result instanceof Error) {
                setItens([]);

                toast.error(result.message);
                return;
            }

            setItens(result.dados);
        });
    }, []);

    useEffect(() => {
        getDadosSelects();
    }, [getDadosSelects]);

    // ⬇️ SUBMIT
    const onSubmit: SubmitHandler<IVendaPOST> = async (formData) => {
        const payload: IVendaPOST = {
            ...formData,
            dataVenda: dayjs().toISOString(),
            valorTotal,
        };

        try {
            setLoading(true);

            await axios.post("/venda", payload);

            toast.success("Venda registrada com sucesso!");

            reset();
        } catch (err) {
            toast.error("Erro ao registrar venda");
        } finally {
            setLoading(false);
        }
    };

    return {
        itens,
        loading,
        control,
        errors,
        selectedItem,
        valorTotal,
        handleSubmit: handleSubmit(onSubmit),
    };
}
