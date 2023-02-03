import classes from './style.module.css';
import MeHeader from '../../components/me-header';
import MeFooter from '../../components/me-footer';
import { Title, Text, Image, Space, Button, Container, Center } from '@mantine/core';
import HomeImage from '../../asset/image/happy-student-amico.svg';
import { useNavigate } from 'react-router-dom';
import MeHeroHeader from '../../components/me-hero-header';

const LandingPage = () => {
  const navigate = useNavigate()

  const handlerSignUpClick = () => {
    navigate('/sign-up')
  }

  return (
    <div className={classes.main}>
      <MeHeader/>
      <div id={'home'} className={classes.home}>
        <MeHeroHeader/>
      </div>
      {/*<div id={'feature'} className={classes.feature}></div>*/}
      {/*<div id={'plan'} className={classes.plan}></div>*/}
      {/*<div id={'contact'} className={classes.contact}></div>*/}
      {/*<div id={'faqs'} className={classes.faqs}></div>*/}
      <MeFooter/>
    </div>
  );
};

export default LandingPage;