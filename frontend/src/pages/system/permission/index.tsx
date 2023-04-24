import {useOutletContext} from "react-router-dom";
import {useEffect} from "react";

const PermissionPage = () => {
  const [setTitle] = useOutletContext() as any;

  useEffect(() => {
    setTitle('Permission');
  }, []);

  return (
    <div>
      Permission
    </div>
  )
}

export default PermissionPage;