import useSWR from 'swr';
import fetcher, { putter } from '../fetcher';
import { useParams } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import useVideoContext from './useVideoContext/useVideoContext';
import { GlobalStateContext } from '../state/GlobalState';

interface ParamTypes {
  URLRoomName: string;
}

interface LiveTypes {
  data: Data;
  isLoading: boolean;
  isError: boolean;
}

export interface Data {
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
  clientContactName?: string;
  clientContactEmail?: string;
  followUpTime?: any;
  candidateTemplate?: string;
  candidateDebriefTime?: any;
  clientDebriefTime?: any;
  recruiterCompany?: string;
  recruiterCompanyCountry?: string;
  OffSysID?: string;
  XpressID?: string;
}
export const useLive = (): LiveTypes => {
  const { URLRoomName } = useParams<ParamTypes>();

  const { data, error } = useSWR(URLRoomName ? [`/v1/live/${URLRoomName}`] : null, fetcher, {
    refreshInterval: 2000,
  });

  return {
    data,
    isLoading: !error && !data && URLRoomName != null,
    isError: error,
  };
};

export const useCompany = () => {
  const { data: liveData } = useLive();
  const { data, error } = useSWR(liveData?.companyId ? [`/v1/companies/${liveData.companyId}`] : null, fetcher);

  const { recruiterCompany = '', recruiterCompanyCountry = '' } = liveData || {};
  const generalLogo = data?.brands?.[recruiterCompany]?.logo;
  const countryLogo = data?.brands?.[recruiterCompany]?.[recruiterCompanyCountry]?.logo;

  const logo = countryLogo || generalLogo || data?.logo;

  const generalName = data?.brands?.[recruiterCompany]?.name;
  const countryName = data?.brands?.[recruiterCompany]?.[recruiterCompanyCountry]?.name;

  const companyName = countryName || generalName || data?.companyName;
  return {
    data,
    logo,
    companyName,
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
  notes?: string;
  feedback?: number;
}
export const useParticipant = (notes: string, feedback?: number) => {
  const { data: liveData } = useLive();
  const { URLRoomName } = useParams<ParamTypes>();
  const { startingRole, connectedName } = useContext(GlobalStateContext);
  const prepRoomRecruiter = startingRole === 'recruiter' && liveData?.interviewType === 'client';
  const [shouldRun, setShouldRun] = useState(true);
  const {
    room: { localParticipant },
  } = useVideoContext();

  useEffect(() => {
    if (shouldRun && !prepRoomRecruiter) {
      const { identity: participantName } = localParticipant || { identity: connectedName };
      const showNotes = notes || undefined;
      const participant: Participant = {
        participantName,
        role: startingRole,
        notes: showNotes,
        feedback,
      };
      if (participantName) {
        putter(`/v1/live/${URLRoomName}/participants`, participant);
      }
      setShouldRun(false);
    }
  }, [URLRoomName, connectedName, feedback, localParticipant, notes, prepRoomRecruiter, shouldRun, startingRole]);

  useEffect(() => {
    setShouldRun(true);
  }, [feedback]);

  useEffect(() => {
    setInterval(() => setShouldRun(true), 2000);
  }, []);
};
