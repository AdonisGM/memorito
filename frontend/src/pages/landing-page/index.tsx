import classes from './style.module.css';
import MeHeader from '../../components/me-header';
import MeFooter from '../../components/me-footer';
import MeHeroHeader from '../../components/me-hero-header';

const LandingPage = () => {
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