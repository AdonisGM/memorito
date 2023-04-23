import {useOutletContext} from "react-router-dom";
import {useEffect} from "react";

const RolePage = () => {
  const [setTitle] = useOutletContext() as any;

  useEffect(() => {
    setTitle('Role');
  }, []);

  return (
    <div>
      RolePage
    </div>
  )
}

export default RolePage