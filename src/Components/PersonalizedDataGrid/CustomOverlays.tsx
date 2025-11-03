import { Box, Typography } from '@mui/material';
import { FolderOffOutlined, SearchOff } from '@mui/icons-material';

export function NoRowsCustom() {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
            color="text.secondary"
            p={2}
        >
            <FolderOffOutlined fontSize="large" />
            <Typography variant="subtitle1" mt={1}>
                Sem dados
            </Typography>
        </Box>
    );
}

export function NoResultsCustom() {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
            color="text.secondary"
            p={2}
        >
            <SearchOff fontSize="large" />
            <Typography variant="subtitle1" mt={1}>
                Nenhum registro com o filtro encontrado
            </Typography>
        </Box>
    )
}