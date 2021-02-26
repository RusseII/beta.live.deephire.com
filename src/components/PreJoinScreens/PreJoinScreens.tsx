import React, { useState, useEffect, FormEvent } from 'react';
import DeviceSelectionScreen from './DeviceSelectionScreen/DeviceSelectionScreen';
import IntroContainer from '../IntroContainer/IntroContainer';
import MediaErrorSnackbar from './MediaErrorSnackbar/MediaErrorSnackbar';
import PreflightTest from './PreflightTest/PreflightTest';
import RoomNameScreen from './RoomNameScreen/RoomNameScreen';
import { useAppState } from '../../state';
import { useParams } from 'react-router-dom';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import Video from 'twilio-video';
import { useLive, useCompany, useCandidate } from '../../hooks/useLive';
import { Spin, Result } from 'antd';

export enum Steps {
  roomNameStep,
  deviceSelectionStep,
}
interface ParamTypes {
  URLRoomName: string;
}

const defaultName = localStorage.getItem('name');
export default function PreJoinScreens() {
  const { data, isLoading: isLoadingLive, isError } = useLive();

  // preload company data
  const { isLoading: isLoadingCompany, companyName } = useCompany();
  const { isLoading: isLoadingCandidate } = useCandidate();

  const { user } = useAppState();
  const { getAudioAndVideoTracks } = useVideoContext();
  const { URLRoomName } = useParams<ParamTypes>();
  const [step, setStep] = useState(Steps.roomNameStep);

  const [name, setName] = useState<string>(user?.displayName || defaultName || '');
  const [roomName, setRoomName] = useState<string>('');

  const [mediaError, setMediaError] = useState<Error>();

  useEffect(() => {
    if (URLRoomName) {
      setRoomName(URLRoomName);
      if (user?.displayName) {
        setStep(Steps.deviceSelectionStep);
      }
    }
  }, [user, URLRoomName]);

  useEffect(() => {
    if (step === Steps.deviceSelectionStep) {
      getAudioAndVideoTracks().catch(error => {
        console.log('Error acquiring local media:');
        console.dir(error);
        setMediaError(error);
      });
    }
  }, [getAudioAndVideoTracks, step]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // If this app is deployed as a twilio function, don't change the URL because routing isn't supported.
    if (!window.location.origin.includes('twil.io')) {
      window.history.replaceState(null, '', window.encodeURI(`/room/${roomName}${window.location.search || ''}`));
    }
    setStep(Steps.deviceSelectionStep);
  };

  const SubContent = (
    <>
      {Video.testPreflight && <PreflightTest />}
      <MediaErrorSnackbar error={mediaError} />
    </>
  );

  if (isError) {
    return (
      <IntroContainer subContent={step === Steps.deviceSelectionStep && SubContent}>
        <Result status="error" title="Error Finding Interview Room" />
      </IntroContainer>
    );
  }
  if (!URLRoomName) {
    return (
      <IntroContainer subContent={step === Steps.deviceSelectionStep && SubContent}>
        <Result
          status="warning"
          title="Link is invalid."
          subTitle="Find the link that was sent to you for the interview. Copy paste it in your browser. If it is still not working, get in contact with your recruiter."
        />
      </IntroContainer>
    );
  }

  return (
    <IntroContainer subContent={step === Steps.deviceSelectionStep && SubContent}>
      <Spin spinning={isLoadingLive || isLoadingCompany || isLoadingCandidate}>
        {step === Steps.roomNameStep && (
          <RoomNameScreen
            companyName={companyName}
            name={name}
            roomName={roomName}
            setName={setName}
            setRoomName={setRoomName}
            handleSubmit={handleSubmit}
          />
        )}

        {step === Steps.deviceSelectionStep && (
          <DeviceSelectionScreen name={name} roomName={roomName} setStep={setStep} />
        )}
      </Spin>
    </IntroContainer>
  );
}
