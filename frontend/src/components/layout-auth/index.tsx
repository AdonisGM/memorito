import { Alert, Anchor, Center, Container, Image, Text } from '@mantine/core';
import classes from './style.module.css';
import React from 'react';
import MemoritoLogo from '../../asset/image/logo-no-background.svg'
import { IconAlertCircle } from '@tabler/icons-react';

interface LayoutAuthProps {
  children: React.ReactNode;
}

const LayoutAuth = ({children}: LayoutAuthProps) => {
  return (
    <div className={classes.main}>
      <Container size={420}>
        {children}
        <Center mt={50}>
          <Image src={MemoritoLogo} fit={'contain'} height={14}/>
        </Center>
        <Center>
          <Text color={'gray.5'} size={'xs'} mt={'sm'}>Copyright © {new Date().getFullYear()} AdonisGM. All rights
            reserved.</Text>
        </Center>
        <Alert icon={<IconAlertCircle size={16} />} title="Warning!" color="red" variant="outline" className={classes.alert}>
          The website is under development, when using it if there is any case you think is our fault then please feedback <Anchor target={'_blank'} href={'https://github.com/AdonisGM/memorito/issues'}>here</Anchor>.
        </Alert>
      </Container>
    </div>
  );
};

export default LayoutAuth;