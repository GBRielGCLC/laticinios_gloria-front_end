import React, { createContext, useContext, useState, useCallback } from "react";
import { ConfirmDialog, ConfirmDialogProps } from "../Components/ConfirmDialog";

type InternalConfirmProps = Omit<ConfirmDialogProps, "open" | "onConfirm" | "onCancel"> & {
    onConfirm?: (helpers: { close: () => void; setLoading: (v: boolean) => void }) => void | Promise<void>;
};

type ConfirmFn = (props: InternalConfirmProps) => void;

const ConfirmContext = createContext<ConfirmFn | null>(null);

export const useConfirm = () => {
    const ctx = useContext(ConfirmContext);
    if (!ctx) throw new Error("useConfirm deve ser usado dentro do ConfirmDialogProvider");
    return ctx;
};

export const ConfirmDialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState<InternalConfirmProps>({});

    const confirm: ConfirmFn = useCallback((props) => {
        setOptions(props);
        setOpen(true);
        setLoading(false);
    }, []);

    const close = () => {
        setOpen(false);
        setLoading(false);
    };

    const handleConfirm = async () => {
        if (!options.onConfirm) return close();

        try {
            await options.onConfirm({
                close,
                setLoading
            });
        } catch {
            // ignora erros no onConfirm
        }
    };

    return (
        <ConfirmContext.Provider value={confirm}>
            {children}

            <ConfirmDialog
                aberto={open}
                titulo={options.titulo}
                conteudo={options.conteudo}
                textBtnConfirmar={options.textBtnConfirmar}
                textBtnCancelar={options.textBtnCancelar}
                carregando={loading}
                onConfirmar={handleConfirm}
                onCancelar={close}
            />
        </ConfirmContext.Provider>
    );
};
