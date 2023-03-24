import './App.css';
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import Root from "./routes/root";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />
  }, {
    path: '/events',
    element: <Root /> // replace with Events page
  }
])

function App() {
  return (
      <RouterProvider router={router} />
  );
}

export default App;
