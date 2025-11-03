import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ThemeProvider, Box } from '@mui/material';

import { DarkTheme, LightTheme } from '../Themes';

interface IThemeContextData {// Define as propiedades compartilhadas no contexto
    themeName: 'light' | 'dark';//Nome dos temas
    toggleTheme: () => void;// Alterna os temas
}

// O contexto recebe as propiedades compartilhadas
const ThemeContext = createContext({} as IThemeContextData);

//Hook para usar o toggle theme em qualquer parte da aplicação
export const useAppThemeContext = () => {
    return useContext(ThemeContext);
}

interface IAppThemeProviderProps {
    children: React.ReactNode
}
export const AppThemeProvider: React.FC<IAppThemeProviderProps> = ({ children }) => {
    const browserTheme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';

    var localStorageThemeName: 'light' | 'dark' = browserTheme;
    if (localStorage.getItem('themeName') !== null) {

        if (localStorage.getItem('themeName') === 'dark') {
            localStorageThemeName = 'dark';
        } else {
            localStorageThemeName = 'light';
        }

    }
    //Use state com tema light como padrão, light ou dark como parâmetro de tipagem
    const [themeName, setThemeName] = useState<'light' | 'dark'>(localStorageThemeName);

    //Use callback para saber qual o tema anterior e fazer a troca
    const toggleTheme = useCallback(() => {
        setThemeName(oldThemeName => oldThemeName === 'light' ? 'dark' : 'light');
    }, []);

    //Retorna o tema light ou dark
    const theme = useMemo(() => {
        localStorage.setItem('themeName', themeName);

        return {
            ...themeName === 'light' ? LightTheme : DarkTheme,
        }
    }, [themeName]);


    return (
        // Da a propriedade para todos que estão abaixo e passa como filho 
        <ThemeContext.Provider value={{ themeName, toggleTheme }}>
            {/* Da o tema */}
            <ThemeProvider theme={theme}>
                {/* Box que ocupa todo o espaço com as cores do tema */}
                <Box height="100vh" bgcolor={theme.palette.background.default}>
                    {children}
                </Box>
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}