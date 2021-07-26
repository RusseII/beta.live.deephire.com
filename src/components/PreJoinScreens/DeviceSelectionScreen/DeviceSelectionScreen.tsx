import React, { useContext } from 'react';
import { makeStyles, Typography, Grid, Button, Theme, Hidden } from '@material-ui/core';
import LocalVideoPreview from './LocalVideoPreview/LocalVideoPreview';
import SettingsMenu from './SettingsMenu/SettingsMenu';
import { Steps } from '../PreJoinScreens';
import ToggleAudioButton from '../../Buttons/ToggleAudioButton/ToggleAudioButton';
import ToggleVideoButton from '../../Buttons/ToggleVideoButton/ToggleVideoButton';
import { useAppState } from '../../../state';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import { useCompany, useLive } from '../../../hooks/useLive';
import { Modal } from 'antd';
import { GlobalStateContext } from '../../../state/GlobalState';
import { putter } from '../../../fetcher';

const { confirm } = Modal;

const useStyles = makeStyles((theme: Theme) => ({
  gutterBottom: {
    marginBottom: '1em',
  },
  marginTop: {
    marginTop: '1em',
  },
  deviceButton: {
    width: '100%',
    border: '2px solid #aaa',
    margin: '1em 0',
  },
  localPreviewContainer: {
    paddingRight: '2em',
    [theme.breakpoints.down('sm')]: {
      padding: '0 2.5em',
    },
  },
  joinButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column-reverse',
      width: '100%',
      '& button': {
        margin: '0.5em 0',
      },
    },
  },
  mobileButtonBar: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'space-between',
      margin: '1.5em 0 1em',
    },
  },
  mobileButton: {
    padding: '0.8em 0',
    margin: 0,
  },
}));

interface DeviceSelectionScreenProps {
  name: string;
  roomName: string;
  setStep: (step: Steps) => void;
}

export default function DeviceSelectionScreen({ name, roomName, setStep }: DeviceSelectionScreenProps) {
  const { companyName, data } = useCompany();
  const classes = useStyles();
  const { getToken, isFetching } = useAppState();
  const { connect, isAcquiringLocalTracks, isConnecting } = useVideoContext();
  const disableButtons = isFetching || isAcquiringLocalTracks || isConnecting;
  const { startingRole } = useContext(GlobalStateContext);
  const { data: liveData } = useLive();

  const showModal = () => {
    const { _id } = data;
    const appleoneId = '5e95d7d3aed1120001480d69';
    const appledevId = '5f7f25460d77330001bc9b91';
    const benjId = '5dc5d305a4ea435efa57f644';
    const showRecordingId = benjId === _id || appleoneId === _id || appledevId === _id;
    if (liveData.recording && showRecordingId) {
      if (startingRole === 'candidate') {
        return jobSeekerRecordingMessage();
      }
      if (startingRole === 'client' || startingRole === 'recruiter') {
        return clientRecordingMessage();
      }
    }
    handleJoin();
  };

  function jobSeekerRecordingMessage() {
    confirm({
      width: 700,
      title: 'Meeting will be recorded',
      content: (
        <div>
          <p>{`By continuing in this meeting, I certify that I am 18 years of age and consent to being recorded.  If I do not consent to being recorded, I will not join the meeting.  By continuing in this meeting, and in consideration of (a) the employment placement services of Howroyd-Wright Employment Agency, Inc. dba AppleOne (“AppleOne”), and (b) any assignment to an AppleOne client (“the Client”), I hereby grant to AppleOne the right to use, collect, retain, and/or disclose, in whole or in part, my name, personal information, quotes from the interview, image, voice, and likeness in the video and audio-visual recordings as reflected in the meeting video recording (“Recording”). Furthermore, by continuing in this meeting, I hereby release and hold harmless AppleOne from any reasonable expectation of privacy or confidentiality associated with AppleOne’s use, collection, retention, and/or disclosure of such Recording in connection with my employment or potential employment by AppleOne or one of its Client.`}</p>

          <span>
            By clicking the “Join Room” button, I agree to{' '}
            <a href="https://www.appleone.com/privacy.aspx" rel="noopener noreferrer" target="_blank">
              AppleOne’s Privacy Policy
            </a>
            .{' '}
          </span>
        </div>
      ),
      okText: 'Join Interview',
      onOk() {
        handleJoin();
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  function clientRecordingMessage() {
    let recordingMessage = `By clicking “Record Interview”, I understand that this meeting is being recorded and I hereby consent to any such recording.  By recording this meeting, I acknowledge and understand that Howroyd-Wright Employment Agency, Inc. dba AppleOne Employment Services will have the right to use, collect, retain, and/or disclose the meeting recording for AppleOne’s business and hiring purposes.  If I do not consent to being recorded, I will click “Live Interview (No Recording)” and the meeting will continue without being recorded.  I understand that I can also discuss any concerns related to being recorded with the host.`;
    if (startingRole === 'recruiter') {
      recordingMessage = `By clicking “Record Interview”, I understand that this meeting is being recorded and I hereby consent to any such recording.  By recording this meeting, I acknowledge and understand that Howroyd-Wright Employment Agency, Inc. dba AppleOne Employment Services will have the right to use, collect, retain, and/or disclose the meeting recording for AppleOne’s business and hiring purposes.  If I do not consent to being recorded, I will click “Live Interview (No Recording)” and the meeting will continue without being record.  I understand that I can also discuss any concerns related to being recorded with the host.`;
    }
    confirm({
      width: 700,

      title: 'Meeting will be recorded',
      content: recordingMessage,
      okText: 'Record Interview',
      onOk() {
        handleJoin();
      },
      cancelText: 'Live interview (No Recording)',
      onCancel: async () => {
        await putter(`/v1/live/${liveData._id}`, { recording: false });
        handleJoin();
      },
    });
  }

  const handleJoin = () => {
    getToken(name, roomName).then(token => connect(token));
  };
  return (
    <>
      <Typography variant="h5" className={classes.gutterBottom}>
        Join {companyName} Video Room
      </Typography>

      <Grid container justify="center">
        <Grid item md={7} sm={12} xs={12}>
          <div className={classes.localPreviewContainer}>
            <LocalVideoPreview identity={name} />
          </div>
          <div className={classes.mobileButtonBar}>
            <Hidden mdUp>
              <ToggleAudioButton className={classes.mobileButton} disabled={disableButtons} />
              <ToggleVideoButton className={classes.mobileButton} disabled={disableButtons} />
            </Hidden>
            <SettingsMenu mobileButtonClass={classes.mobileButton} />
          </div>
        </Grid>
        <Grid item md={5} sm={12} xs={12}>
          <Grid container direction="column" justify="space-between" style={{ height: '100%' }}>
            <div>
              <Hidden smDown>
                <ToggleAudioButton className={classes.deviceButton} disabled={disableButtons} />
                <ToggleVideoButton className={classes.deviceButton} disabled={disableButtons} />
              </Hidden>
            </div>
            <div className={classes.joinButtons}>
              <Button variant="outlined" color="primary" onClick={() => setStep(Steps.roomNameStep)}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                data-cy-join-now
                onClick={showModal}
                disabled={disableButtons}
              >
                Join Now
              </Button>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
