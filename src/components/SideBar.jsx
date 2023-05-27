import {
  Drawer,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link, Typography, Grid, Box, Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import EventNoteIcon from '@mui/icons-material/EventNote';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useContext, useState } from "react";
import { UserContext } from "../providers/UserProvider";

const DRAWER_WIDTH = 225;
const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
}));

export default function SideBar() {
  const { logout } = useContext(UserContext);
  const { pathname } = useLocation();

  const data = [
    { name: "Eventos", icon: <EventNoteIcon />, navigate: '/events' },
    { name: "Dashboard", icon: <BarChartIcon />, navigate: '/dashboard' },
    { name: "Perfil", icon: <AccountCircleIcon />, navigate: '/profile' },
  ];

  const getList = () => (
      <div>
        {data.map((item, index) => (
            <Link
                underline="none"
                component={RouterLink}
                to={item.navigate}
                key={index}
            >
              <ListItem
                  key={index}
                  selected={pathname === item.navigate}
                  sx={{ color: "#fff" }}
              >
                <ListItemIcon
                    sx={{ color: "#fff" }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name}/>
              </ListItem>
            </Link>
        ))}
      </div>
  );

  return (
      <>
        <RootStyle>
          <Drawer
              PaperProps={{
                sx: {
                  backgroundColor: '#8978C7',
                  color: '#fff',
                  borderRightStyle: 'dashed',
                  width: DRAWER_WIDTH,
                },
              }}
              sx={{
                '&& .Mui-selected, && .Mui-selected:hover': {
                  bgcolor: '#6C5483',
                  border: '1px solid #FFFFFF',
                  borderRadius: '10px'
                }
              }}
              variant="permanent"
              anchor="left"
              open
          >
            <img src="/Logo2.png" alt="logo" />
            {getList()}
            <Link
                underline="none"
                component={RouterLink}
                to="/"
            >
              <Stack direction="row" spacing={2} sx={{ margin: 2, position: 'absolute', bottom: 0 }}>
                <LogoutIcon onClick={logout} sx={{ color: "white" }} />
                <Typography color="#fff">Salir</Typography>
              </Stack>
            </Link>
          </Drawer>
        </RootStyle>
      </>
  );
}
