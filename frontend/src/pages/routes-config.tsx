import SignUp from './sign-up';
import SignIn from './sign-in';
import LandingPage from './landing-page';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/sign-in',
    element: <SignIn />,
  },
  {
    path: '/sign-up',
    element: <SignUp />,
  }
])

const RoutesConfig = () => {
  return <RouterProvider router={router}/>
}

export default RoutesConfig