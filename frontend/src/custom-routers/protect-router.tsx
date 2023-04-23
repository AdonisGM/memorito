import {useEffect, ReactNode, Fragment} from "react";
import {Navigate, useNavigate} from "react-router-dom";
import {useLocalStorage} from "../custom-hooks/local-manage";

const ProtectRouter = ({children}: { children: ReactNode }) => {
  const token = useLocalStorage().accessToken.read();
  const navigate = useNavigate();

  if (!token) {
    return <Navigate to={'/sign-in'}/>;
  }

  console.log('ProtectRouter: ', token)

  return <Fragment>{children}</Fragment>;
};

export default ProtectRouter;