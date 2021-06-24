import React from 'react';
import Button from '@material-ui/core/Button';
import { useBlurLocalTrack } from '../../state/useBlur';
import { wait } from '../../utils/wait';

const BlurButton = ({ participant }) => {
  const { toggleVideoBlur, isVideoBlur } = useBlurLocalTrack({});

  const _toggleVideoBlur = async () => {
    window.twilioRoom.localParticipant.videoTracks.forEach(track => track.unpublish());
    const videoTrack = await toggleVideoBlur();
    await wait(1000);
    participant.publishTrack(videoTrack);
  };

  return <Button onClick={_toggleVideoBlur}>{isVideoBlur ? 'Disable Blur' : 'Enable blur'}</Button>;
};

export default BlurButton;
