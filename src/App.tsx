import {
  PersonalizedToast,
} from './Components';
import 'react-toastify/dist/ReactToastify.css';

import {
  AppThemeProvider,
  ConfirmDialogProvider
} from "./Contexts";

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ptBR } from "@mui/x-date-pickers/locales";
import "dayjs/locale/pt-br";

import { AuthProvider, useAuth } from './Contexts/AuthContext';
import { MenuBar } from './Components/MenuBar';
import { Home } from './Pages';
import { Login } from './Pages/Login';

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <MenuBar>
      <Home />
    </MenuBar>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale="pt-br"
        localeText={ptBR.components.MuiLocalizationProvider.defaultProps.localeText}
      >
        <AppThemeProvider>
          <ConfirmDialogProvider>
            <PersonalizedToast />
            <AppContent />
          </ConfirmDialogProvider>
        </AppThemeProvider>
      </LocalizationProvider>
    </AuthProvider>
  );
}