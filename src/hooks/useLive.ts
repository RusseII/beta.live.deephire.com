import useSWR from 'swr';
import fetcher from '../fetcher';
import { useParams } from 'react-router-dom';

interface ParamTypes {
  URLRoomName: string;
}
const useRoomData = () => {
  const { URLRoomName } = useParams<ParamTypes>();

  const { data, error } = useSWR(URLRoomName ? [`/v1/live/${URLRoomName}`] : null, fetcher);

  return {
    data,
    isLoading: !error && !data && URLRoomName != null,
    isError: error,
  };
};

export default useRoomData;
