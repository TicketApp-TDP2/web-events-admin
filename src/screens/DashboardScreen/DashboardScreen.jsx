import { createTheme, ThemeProvider } from '@mui/material/styles';
import SideBar from '../../components/SideBar';

const theme = createTheme({
  palette: {
    primary: {
      main: '#61309b',
      contrastText: '#fff',
    },
    secondary: {
      main: '#8978C7',
      contrastText: '#fff',
    },
    third: {
        main: '#94a5dd',
        contrastText: '#fff',
    },
  },
});

export const DashboardScreen = () => {
    return <>
    <ThemeProvider theme={theme}>
        <SideBar>
            <>
            DASHBOARDDD
            </>
        </SideBar>
      </ThemeProvider>
    </>
}