import { useEffect } from 'react';
import { DataTrack as IDataTrack } from 'twilio-video';
import { displayMessage } from '../Buttons/ChatSnackButton/ChatSnackButton';

export default function DataTrack({ track }: { track: IDataTrack }) {
  useEffect(() => {
    const handleMessage = (message: string) => displayMessage(message);
    track.on('message', handleMessage);
    return () => {
      track.off('message', handleMessage);
    };
  }, [track]);

  return null; // This component does not return any HTML, so we will return 'null' instead.
}
