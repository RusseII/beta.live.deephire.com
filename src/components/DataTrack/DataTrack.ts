import { useEffect } from 'react';
import { DataTrack as IDataTrack } from 'twilio-video';
import { notification } from 'antd';

const openNotification = (message: string) => {
  notification.info({
    message,
    duration: 10,
    placement: 'bottomRight',
    bottom: 50,
  });
};

export default function DataTrack({ track }: { track: IDataTrack }) {
  useEffect(() => {
    const handleMessage = (message: string) => openNotification(message);
    track.on('message', handleMessage);
    return () => {
      track.off('message', handleMessage);
    };
  }, [track]);

  return null; // This component does not return any HTML, so we will return 'null' instead.
}
