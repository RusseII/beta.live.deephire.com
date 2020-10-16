import useSWR from 'swr';
import fetcher, { putter } from '../fetcher';
import { useParams } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import useVideoContext from './useVideoContext/useVideoContext';
import { GlobalStateContext } from '../state/GlobalState';
import { dark } from '@material-ui/core/styles/createPalette';

interface ParamTypes {
  URLRoomName: string;
}

interface LiveTypes {
  data: Data;
  isLoading: boolean;
  isError: boolean;
}

interface Data {
  _id: string;
  interviewType: 'recruiter' | 'client';
  candidateName: string;
  candidateEmail: string;
  interviewTime?: string[] | null;
  jobName?: string;
  phone?: string;
  recruiterTemplate?: string;
  createdBy: string;
  companyId: string;
  roomName: string;
  interviewLink: string;
  companyName: string;
  recruiterName: string;
  timestamp: string;
  clientTemplate?: string;
  recording: boolean;
  participants: any;
}
export const useLive = (): LiveTypes => {
  const { URLRoomName } = useParams<ParamTypes>();

  const { data, error } = useSWR(URLRoomName ? [`/v1/live/${URLRoomName}`] : null, fetcher, { refreshInterval: 1000 });

  return {
    data,
    isLoading: !error && !data && URLRoomName != null,
    isError: error,
  };
};

export const useCompany = () => {
  const { data: liveData } = useLive();
  const { data, error } = useSWR(liveData?.companyId ? [`/v1/companies/${liveData.companyId}`] : null, fetcher);
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};

export const useCandidate = () => {
  const { data: liveData } = useLive();
  const { data, error } = useSWR(
    liveData?.candidateEmail ? [`/v1/candidates/${liveData.candidateEmail}`] : null,
    fetcher
  );
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
};

interface Participant {
  participantName: string;
  role: 'candidate' | 'recruiter' | 'client';
  notes: string;
}
export const useParticipant = (notes: string) => {
  const { data: liveData } = useLive();
  const { URLRoomName } = useParams<ParamTypes>();
  const { role } = useContext(GlobalStateContext);
  const prepRoomRecruiter = role === 'recruiter' && liveData.interviewType === 'client';
  const [shouldRun, setShouldRun] = useState(true);
  const {
    room: { localParticipant },
  } = useVideoContext();

  useEffect(() => {
    if (shouldRun && !prepRoomRecruiter) {
      const { identity: participantName } = localParticipant;
      const participant: Participant = {
        participantName,
        role,
        notes,
      };
      putter(`/v1/live/${URLRoomName}/participants`, participant);
      setShouldRun(false);
    }
  }, [URLRoomName, localParticipant, notes, prepRoomRecruiter, role, shouldRun]);

  useEffect(() => {
    setInterval(() => setShouldRun(true), 5000);
  }, []);
};
