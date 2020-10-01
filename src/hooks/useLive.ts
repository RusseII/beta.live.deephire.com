import useSWR from 'swr';
import fetcher from '../fetcher';
import { useParams } from 'react-router-dom';

interface ParamTypes {
  URLRoomName: string;
}
export const useLive = () => {
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
