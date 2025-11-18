import {
  PersonalizedToast,
} from './Components';
import 'react-toastify/dist/ReactToastify.css';
import { AppThemeProvider, ConfirmDialogProvider } from "./Contexts";
import { Home } from './Pages';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import "dayjs/locale/pt-br";
import { MenuBar } from './Components/MenuBar';

export default function App() {

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale='pt-br'
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