import SignUp from './sign-up';
import SignIn from './sign-in';
import LandingPage from './landing-page';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorBoundary from './error';
import DevelopSetting from './develop-setting';
import LayoutApp from './layout-app';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage/>,
    errorElement: <ErrorBoundary/>
  },
  {
    path: '/sign-in',
    element: <SignIn/>,
  },
  {
    path: '/sign-up',
    element: <SignUp/>,
  },
  {
    path: '/develop/setting',
    element: <DevelopSetting/>,
  },
  {
    path: '/app',
    element: <LayoutApp/>,

  }
]);

const RoutesConfig = () => {
  return <RouterProvider router={router}/>;
};

export default RoutesConfig;