import { Code, Image, Space, Text, Title } from '@mantine/core';
import NotFoundGif from '../../../asset/gif/pot-of-gold.gif';
import classes from './style.module.css';

const NotFound = () => {
  return (
    <div className={classes.main}>
      <Image src={NotFoundGif} fit={'contain'} height={'30vh'} width={'30vw'}/>
      <div className={classes.session}>
        <Title color={'gray.7'}>Oh hey 😳!</Title>
        <Space h={'xl'}/>
        <Text color={'gray.8'}>You was found a new resource from my website. it's a secret. Now you need to go back to your
          browser
          to continue learning. I need to research the resource you found 🤑🤑🤑.</Text>
        <Space h={'xl'}/>
        <Code>statusCode: 404 not found</Code>
      </div>
    </div>
  );
};

export default NotFound;