import {
    Drawer,
    ListItem,
    ListItemIcon,
    ListItemText,
    Link,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import EventNoteIcon from '@mui/icons-material/EventNote';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';


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
    <div style={{ width: DRAWER_WIDTH }}>
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
    <RootStyle>
      <Drawer
          PaperProps={{ sx: { backgroundColor: '#8978C7', color: '#fff', borderRightStyle: 'dashed', width: DRAWER_WIDTH } }}
          variant="permanent"
          anchor="left"
          open
      >
          <img src="/Logo2.png" alt="logo" />
          {getList()}
      </Drawer>
    </RootStyle>
  </>
}