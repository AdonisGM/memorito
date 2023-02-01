import classes from './style.module.css';
import MeHeader from '../../components/me-header';

const LandingPage = () => {
  return (
    <div className={classes.main}>
      <MeHeader/>
      <div id={'home'} className={classes.home}></div>
      <div id={'feature'} className={classes.feature}></div>
      <div id={'plan'} className={classes.plan}></div>
      <div id={'contact'} className={classes.contact}></div>

    </div>
  );
};

export default LandingPage;