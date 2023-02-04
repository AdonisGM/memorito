import { Center, Container, Image, Text } from '@mantine/core';
import classes from './style.module.css';
import React from 'react';
import MemoritoLogo from '../../asset/image/logo-no-background.svg'

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
      </Container>
    </div>
  );
};

export default LayoutAuth;