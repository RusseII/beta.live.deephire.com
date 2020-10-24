import { useContext, useEffect } from 'react';
import useVideoContext from './useVideoContext/useVideoContext';
import { useLive } from './useLive';

import { GlobalStateContext } from '../state/GlobalState';

const useRecording = () => {
  const { data: liveData } = useLive();
  const { room } = useVideoContext();
  const { startingRole } = useContext(GlobalStateContext);

  const { sid } = room;
  const { interviewType, recording } = liveData || {};

  const isRecruiterType = interviewType === 'recruiter';
  const isClient = interviewType === 'client' && startingRole === 'client';
  useEffect(() => {
    const toggleRecording = () => {
      if (sid) {
        if (recording) {
          // on the server side, it also checks the number of participants.
          // it will only record if there are 2 participants in the room
          if (isClient || isRecruiterType) {
            fetch(`/api/recording/${sid}/include`);
          }
        } else {
          fetch(`/api/recording/${sid}/exclude`);
        }
      }
    };
    toggleRecording();
    room.on('participantConnected', toggleRecording);
    room.on('participantDisconnected', toggleRecording);
    return () => {
      room.off('participantConnected', toggleRecording);
      room.off('participantDisconnected', toggleRecording);
    };
  }, [isClient, isRecruiterType, recording, room, sid]);
};

export default useRecording;
