import { NowRequest, NowResponse } from '@vercel/node';
import fetch from 'node-fetch';

var btoa = require('btoa');

const twilioApiKeySID = process.env.TWILIO_API_KEY_SID;
const twilioApiKeySecret = process.env.TWILIO_API_KEY_SECRET;

interface QueryInterface {
  sid: string;
  status: 'include' | 'exclude';
}

export default async (request: NowRequest, response: NowResponse) => {
  console.log(request.query);
  const { sid, status }  = request.query as unknown as QueryInterface;

  const token = btoa(twilioApiKeySID + ':' + twilioApiKeySecret);
  const myHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${token}`,
  };

  console.log(status)
  var startOrStopRecording = new URLSearchParams();
  startOrStopRecording.append('Rules', `[{"type": "${status}", "all": "true"}]`);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: startOrStopRecording,
  };

  fetch(`https://video.twilio.com/v1/Rooms/${sid}/RecordingRules`, requestOptions)
    .then((res: any) => res.json())
    .then((result: any) => {
      console.log(result)
      response.status(200).json(result);
    })
    .catch((error: any) => {
      console.log(error)
      response.status(200).json(error);
    });

  }
  
