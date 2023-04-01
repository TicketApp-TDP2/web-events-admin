import {
    Drawer,
    ListItem,
    ListItemIcon,
    ListItemText,
    Link,
} from '@mui/material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import EventNoteIcon from '@mui/icons-material/EventNote';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

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

const DRAWER_WIDTH = 225;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
}));

const data = [
    { name: "Eventos", icon: <EventNoteIcon />, navigate: '/events' },
    { name: "Dashboard", icon: <BarChartIcon />, navigate: '/dashboard' },
    { name: "Perfil", icon: <AccountCircleIcon />, navigate: '/profile' },
    { name: "Salir", icon: <LogoutIcon />, navigate: '' },
  ];

export default function SideBar() {
  const getList = () => (
    <div style={{ width: 250 }}>
      {data.map((item, index) => (
        <Link underline="none" component={RouterLink} to={item.navigate}>
            <ListItem key={index}>
                <ListItemIcon style={{ color: '#fff' }}>{item.icon}</ListItemIcon>
                <ListItemText style={{ color: '#fff' }} primary={item.name} />
            </ListItem>
        </Link>
      ))}
    </div>
  );

  return <>
    <ThemeProvider theme={theme}>
      <RootStyle>
        <Drawer
            PaperProps={{ sx: { backgroundColor: '#8978C7', color: '#fff', borderRightStyle: 'dashed', width: DRAWER_WIDTH } }}
            variant="permanent"
            anchor="left"
            open
        >
            LOGO
            {getList()}
        </Drawer>
      </RootStyle>
    </ThemeProvider>
  </>
}