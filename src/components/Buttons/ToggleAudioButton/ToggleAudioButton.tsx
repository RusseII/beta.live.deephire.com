import React from 'react';

import Button from '@material-ui/core/Button';
import MicIcon from '../../../icons/MicIcon';
import MicOffIcon from '../../../icons/MicOffIcon';
import { Modal } from 'antd';

import useLocalAudioToggle from '../../../hooks/useLocalAudioToggle/useLocalAudioToggle';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

function showNoMicrophoneWarning() {
  Modal.warning({
    title: "Can't find your microphone",
    // icon: <ExclamationCircleOutlined />,
    content:
      'Check your system settings to make sure that a microphone is available. If not, plug one in. You might then need to restart your browser. ',
    okText: 'Dismiss',
    // okType: 'ghost',
    // cancelText: 'No',
    onOk() {
      console.log('OK');
    },
    // onCancel() {
    //   console.log('Cancel');
    // },
  });
}

export default function ToggleAudioButton(props: { disabled?: boolean; className?: string }) {
  const [isAudioEnabled, toggleAudioEnabled] = useLocalAudioToggle();
  const { localTracks } = useVideoContext();
  const hasAudioTrack = localTracks.some(track => track.kind === 'audio');

  const toggleAudio = () => {
    if (hasAudioTrack) {
      toggleAudioEnabled();
    } else {
      showNoMicrophoneWarning();
    }
  };

  return (
    <Button
      className={props.className}
      onClick={toggleAudio}
      disabled={props.disabled}
      startIcon={isAudioEnabled ? <MicIcon /> : <MicOffIcon />}
      data-cy-audio-toggle
    >
      {!hasAudioTrack ? 'No Audio' : isAudioEnabled ? 'Mute' : 'Unmute'}
    </Button>
  );
}
