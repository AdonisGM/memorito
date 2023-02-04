import { Switch } from '@mantine/core';
import { IconCloudFilled, IconDeviceLaptop } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useLocalStorage } from '../../custom-hooks/local-manage';

const DevelopSetting = () => {
  const localManage = useLocalStorage();
  const [isLocalEndpoint, setIsLocalEndpoint] = useState(true);

  useEffect(() => {
    const endpoint = localManage.endpoint.read();

    if (!endpoint) {
      setIsLocalEndpoint(Boolean(endpoint));
      localManage.endpoint.write('http://localhost:3333');
    } else {
      setIsLocalEndpoint(endpoint == 'http://localhost:3333');
    }
  }, []);

  const handleChangeEndpoint = () => {
    if (isLocalEndpoint) {
      localManage.endpoint.write('https://api.memorito.nmtung.dev');
    } else {
      localManage.endpoint.write('http://localhost:3333');
    }
    setIsLocalEndpoint(!isLocalEndpoint);
  };

  return <Switch
    size="md"
    color={'dark'}
    checked={!isLocalEndpoint}
    onChange={handleChangeEndpoint}
    onLabel={<IconCloudFilled/>}
    offLabel={<IconDeviceLaptop/>}
  />;
};

export default DevelopSetting;