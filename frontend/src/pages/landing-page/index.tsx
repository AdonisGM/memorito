import classes from './style.module.css';
import MeHeader from '../../components/me-header';
import MeFooter from '../../components/me-footer';
import { Title, Text, Image, Space, Button, Container, Center } from '@mantine/core';
import HomeImage from '../../asset/image/happy-student-amico.svg';

const LandingPage = () => {
  return (
    <div className={classes.main}>
      <div className={classes.header}><MeHeader/></div>
      <div id={'home'} className={classes.home}>
        <Container>
          <div className={classes.titleHome}>
            <Title color={'dark.6'} order={2} fw={'bolder'}>Free for memorization</Title>
            <Space h={'sm'}/>
            <Text size={'sm'}>We provide you with a new service for memorization. Special, it's always free for all
              plans and all
              people. The solution for paid version of Quizlet.</Text>
          </div>
          <Space h={'xl'}/>
          <Center>
            <Button color="green" radius="md">
              Try now!
            </Button>
          </Center>
          <Space h={'xl'}/>
          <Space h={'xl'}/>
          <Image src={HomeImage} height={500} fit={'contain'}/>
        </Container>
      </div>
      <div id={'feature'} className={classes.feature}></div>
      <div id={'plan'} className={classes.plan}></div>
      <div id={'contact'} className={classes.contact}></div>
      <div id={'faqs'} className={classes.faqs}></div>
      <MeFooter/>
    </div>
  );
};

export default LandingPage;