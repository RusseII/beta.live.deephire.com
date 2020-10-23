import { useContext, useEffect } from 'react';
import useVideoContext from './useVideoContext/useVideoContext';
import { useLive } from './useLive';

import { GlobalStateContext } from '../state/GlobalState';

const useRecording = () => {
  const { data: liveData } = useLive();
  const { room } = useVideoContext();
  const { startingRole } = useContext(GlobalStateContext);

  const { sid, participants } = room;
  const size = participants?.size;
  const { interviewType, recording } = liveData || {};

  const isRecruiterType = interviewType === 'recruiter';
  const isClient = interviewType === 'client' && startingRole === 'client';
  useEffect(() => {
    if (sid) {
      // size shows all external participants
      if (recording && size >= 1) {
        if (isClient || isRecruiterType) {
          fetch(`/api/recording/${sid}/include`);
        }
      } else {
        fetch(`/api/recording/${sid}/exclude`);
      }
    }
  }, [startingRole, sid, recording, size, isClient, isRecruiterType]);
};

export default useRecording;
