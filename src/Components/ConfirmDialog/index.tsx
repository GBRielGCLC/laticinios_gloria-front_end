import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    CircularProgress
} from '@mui/material';

export interface ConfirmDialogProps {
    aberto?: boolean;
    titulo?: string;
    conteudo?: string | React.ReactNode;
    textBtnConfirmar?: string;
    textBtnCancelar?: string;
    onConfirmar?: () => void;
    onCancelar?: () => void;
    carregando?: boolean;
    botaoCancelarDesabilitadoEnquantoCarrega?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    aberto = false,
    titulo = 'Confirmar ação',
    conteudo = 'Você tem certeza que deseja continuar?',
    textBtnConfirmar = 'Confirmar',
    textBtnCancelar = 'Cancelar',
    onConfirmar,
    onCancelar,
    carregando = false,
    botaoCancelarDesabilitadoEnquantoCarrega = true,
}) => {

    const handleConfirm = onConfirmar || (() => { });
    const handleCancel = onCancelar || (() => { });

    const disableCancel = carregando && botaoCancelarDesabilitadoEnquantoCarrega;

    return (
        <Dialog open={aberto} onClose={handleCancel}>
            <DialogTitle>{titulo}</DialogTitle>

            <DialogContent>
                {typeof conteudo === 'string' ? (
                    <Typography>{conteudo}</Typography>
                ) : (
                    conteudo
                )}
            </DialogContent>

            <DialogActions>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleCancel}
                    disabled={disableCancel}
                >
                    {textBtnCancelar}
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleConfirm}
                    disabled={carregando}
                    endIcon={carregando ? <CircularProgress size={20} color="inherit" /> : null}
                >
                    {textBtnConfirmar}
                </Button>
            </DialogActions>
        </Dialog>
    );
};