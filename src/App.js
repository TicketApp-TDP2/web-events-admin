import './App.css';
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import { LandingScreen } from './screens/LandingScreen/LandingScreen';
import { EventsScreen } from './screens/EventsScreen/EventsScreen';
import { NewEventScreen } from './screens/NewEventScreen/NewEventScreen';
import { DashboardScreen } from './screens/DashboardScreen/DashboardScreen';
import { ProfileScreen } from './screens/ProfileScreen/ProfileScreen';

const router = createBrowserRouter([
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
  }
])

function App() {
  return (
      <RouterProvider router={router} />
  );
}

export default App;
