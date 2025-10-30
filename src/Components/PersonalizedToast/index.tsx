import { GlobalStyles, useTheme } from "@mui/material";
import { Zoom, ToastContainer, ToastContainerProps } from "react-toastify";

export const PersonalizedToast = (props?: ToastContainerProps) => {
    const theme = useTheme();

    const globalToastStyles = {
        // Barra de progresso padrão
        '.Toastify__progress-bar': {
            backgroundColor: theme.palette.primary.main,
        },

        '.Toastify__progress-bar--info': {
            backgroundColor: theme.palette.info.main,
        },
        '.Toastify__progress-bar--success': {
            backgroundColor: theme.palette.success.main,
        },
        '.Toastify__progress-bar--warning': {
            backgroundColor: theme.palette.warning.main,
        },
        '.Toastify__progress-bar--error': {
            backgroundColor: theme.palette.error.main,
        },
    };

    return (
        <>
            <GlobalStyles styles={globalToastStyles} />

            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={theme.palette.mode}
                transition={Zoom}
                limit={5}

                {...props}
            />
        </>

    );
};