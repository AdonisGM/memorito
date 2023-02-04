import SignUp from './sign-up';
import SignIn from './sign-in';
import LandingPage from './landing-page';
import { createBrowserRouter, RouterProvider, useRouteError } from 'react-router-dom';
import ErrorBoundary from './error';
import DevelopSetting from './develop-setting';
import TestAuth from './test-auth';

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
    path: '/auth',
    element: <TestAuth/>,
  }
]);

const RoutesConfig = () => {
  return <RouterProvider router={router}/>;
};

export default RoutesConfig;