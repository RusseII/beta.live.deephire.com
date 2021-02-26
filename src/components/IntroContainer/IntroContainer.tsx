import React from 'react';
import { makeStyles, Theme, Typography } from '@material-ui/core';
import Swoosh from './swoosh';
import VideoLogo from './VideoLogo';
import { useAppState } from '../../state';
import UserMenu from './UserMenu/UserMenu';
import { useLocation } from 'react-router-dom';
import { useCompany } from '../../hooks/useLive';

const useStyles = makeStyles((theme: Theme) => ({
  background: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgb(40, 42, 43)',
    height: '100%',
  },
  container: {
    position: 'relative',
    flex: '1',
  },
  innerContainer: {
    display: 'flex',
    width: '888px',
    height: '379px',
    borderRadius: '8px',
    boxShadow: '0px 2px 4px 0px rgba(40, 42, 43, 0.3)',
    overflow: 'hidden',
    position: 'relative',
    margin: 'auto',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
      height: 'auto',
      width: 'calc(100% - 40px)',
      margin: 'auto',
      maxWidth: '400px',
    },
  },
  swooshContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: Swoosh,
    backgroundSize: 'cover',
    width: '296px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      height: '100px',
      backgroundPositionY: '140px',
    },
  },
  logoContainer: {
    position: 'absolute',
    width: '210px',
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      alignItems: 'center',
      width: '90%',
      textAlign: 'initial',
      '& svg': {
        height: '64px',
        width: '94px',
      },
    },
  },
  smallLogoContainer: {
    position: 'relative',
  },
  brandLogo: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    margin: 'auto',
    height: 'auto',
    width: '152px',
    [theme.breakpoints.down('sm')]: {
      width: '50px',
    },
  },
  twilioLogo: {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: '20px',
  },
  content: {
    background: 'white',
    width: '100%',
    padding: '4em',
    flex: 1,
    [theme.breakpoints.down('sm')]: {
      padding: '2em',
    },
  },
  title: {
    color: 'white',
    margin: '1em 0 0',
    [theme.breakpoints.down('sm')]: {
      margin: 0,
      fontSize: '1.1rem',
    },
  },
  subContentContainer: {
    position: 'absolute',
    marginTop: '1em',
    width: '100%',
  },
}));

interface IntroContainerProps {
  children: React.ReactNode;
  subContent?: React.ReactNode;
}

const IntroContainer = (props: IntroContainerProps) => {
  const { logo, companyName } = useCompany();
  const classes = useStyles();
  const { user } = useAppState();
  const location = useLocation();

  return (
    <div className={classes.background}>
      {user && location.pathname !== '/login' && <UserMenu />}
      <div className={classes.container}>
        <div className={classes.innerContainer}>
          <div className={classes.swooshContainer}>
            <div className={classes.logoContainer}>
              <div className={classes.smallLogoContainer}>
                <VideoLogo />
                <img src={logo} alt={companyName} className={classes.brandLogo} />
              </div>
              <Typography variant="h6" className={classes.title}>
                Live Video Interviews
              </Typography>
            </div>
          </div>
          <div className={classes.content}>{props.children}</div>
        </div>
        {props.subContent && <div className={classes.subContentContainer}>{props.subContent}</div>}
      </div>
    </div>
  );
};

export default IntroContainer;
