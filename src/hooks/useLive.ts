import useSWR from 'swr';
import fetcher from '../fetcher';
import { useParams } from 'react-router-dom';

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
}
export const useLive = (): LiveTypes => {
  const { URLRoomName } = useParams<ParamTypes>();

  const { data, error } = useSWR(URLRoomName ? [`/v1/live/${URLRoomName}`] : null, fetcher);

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
