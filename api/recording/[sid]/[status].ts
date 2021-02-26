import { NowRequest, NowResponse } from '@vercel/node';
import fetch from 'node-fetch';

import Twilio from 'twilio';

const btoa = require('btoa');
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioApiKeySID = process.env.TWILIO_API_KEY_SID;
const twilioApiKeySecret = process.env.TWILIO_API_KEY_SECRET;

interface QueryInterface {
  sid: string;
  status: 'include' | 'exclude';
}

const isTwoOrMorePariciants = (sid: any) => {
  const client = Twilio(twilioApiKeySID, twilioApiKeySecret, { accountSid: twilioAccountSid });

  const connectedParticipants = [];

  return new Promise((resolve, reject) => {
    const onFinish = (err: any) => {
      if (err) {
        reject(err)
      }
      console.log(connectedParticipants.length)
      resolve(connectedParticipants.length >= 2);
    };

    const participants = (participant: any) => {
      connectedParticipants.push(participant);
    };
    client.video.rooms(sid).participants.each({ status: 'connected', callback: participants, done: onFinish });
  });
};

export default async (request: NowRequest, response: NowResponse) => {
  const { sid, status } = (request.query as unknown) as QueryInterface;
  const shouldRecord = await isTwoOrMorePariciants(sid);
  const token = btoa(twilioApiKeySID + ':' + twilioApiKeySecret);
  const myHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${token}`,
  };

  const startOrStopRecording = new URLSearchParams();
  startOrStopRecording.append('Rules', `[{"type": "${status}", "all": "true"}]`);

  const stopRecording = new URLSearchParams();
  stopRecording.append('Rules', `[{"type": "exclude", "all": "true"}]`);
  console.log({shouldRecord})
  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: shouldRecord ? startOrStopRecording : stopRecording,
  };

  fetch(`https://video.twilio.com/v1/Rooms/${sid}/RecordingRules`, requestOptions)
    .then((res: any) => res.json())
    .then((result: any) => {
      console.log(result);
      response.status(200).json(result);
    })
    .catch((error: any) => {
      console.log(error);
      response.status(200).json(error);
    });

 
};
