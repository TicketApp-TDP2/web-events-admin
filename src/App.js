import './App.css';
import {
  createBrowserRouter,
  createHashRouter,
  RouterProvider
} from "react-router-dom";
import { LandingScreen } from './screens/LandingScreen/LandingScreen';
import { EventsScreen } from './screens/EventsScreen/EventsScreen';
import { NewEventScreen } from './screens/NewEventScreen/NewEventScreen';
import { DashboardScreen } from './screens/DashboardScreen/DashboardScreen';
import { ProfileScreen } from './screens/ProfileScreen/ProfileScreen';
import { createTheme, ThemeProvider} from '@mui/material/styles';
import {EventDetailScreen} from "./screens/EventDetailScreen/EventDetailScreen";

const router = createHashRouter([
  {
    path: '/',
    element: <LandingScreen />
  }, {
    path: '/event/new',
    element: <NewEventScreen />
  }, {
    path: '/events',
    element: <EventsScreen />
  }, {
    path: '/dashboard',
    element: <DashboardScreen />
  }, {
    path: '/profile',
    element: <ProfileScreen />
  }, {
    path: '/events/:eventId',
    element: <EventDetailScreen />
  }
]);

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
        main: '#beb4e8',
        contrastText: '#fff',
    },
    fourth: {
      main: '#94a5dd',
      contrastText: '#fff',
    },
  },
  typography: {
    button: {
      textTransform: 'none'
    },
    fontFamily: 'Urbanist',
    fontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
