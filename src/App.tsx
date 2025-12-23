import {
  PersonalizedToast,
} from './Components';
import 'react-toastify/dist/ReactToastify.css';
import { AppThemeProvider, ConfirmDialogProvider } from "./Contexts";
import { Home } from './Pages';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ptBR } from "@mui/x-date-pickers/locales"; 
import "dayjs/locale/pt-br";

import { MenuBar } from './Components/MenuBar';

export default function App() {

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale='pt-br'
      localeText={ptBR.components.MuiLocalizationProvider.defaultProps.localeText}
    >
      <AppThemeProvider>
        <ConfirmDialogProvider>
          <PersonalizedToast />

          <MenuBar>
            <Home />
          </MenuBar>

        </ConfirmDialogProvider>
      </AppThemeProvider>
    </LocalizationProvider>
  );
}