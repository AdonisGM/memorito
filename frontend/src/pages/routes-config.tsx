import SignUp from './sign-up';
import SignIn from './sign-in';
import LandingPage from './landing-page';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorBoundary from './error';
import DevelopSetting from './develop-setting';
import LayoutApp from './layout-app';
import ProtectRouter from "../custom-routers/protect-router";
import PermissionPage from "./system/permission";
import RolePage from "./system/role";

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
    element: <ProtectRouter><LayoutApp/></ProtectRouter>,
    children: [
      {
        path: '/app/system/permission',
        element: <PermissionPage/>
      },
      {
        path: '/app/system/role',
        element: <RolePage/>
      }
    ]
  }
]);

const RoutesConfig = () => {
  return <RouterProvider router={router}/>;
};

export default RoutesConfig;