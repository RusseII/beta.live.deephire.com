import Twilio from 'twilio';

import { NowRequest, NowResponse } from '@vercel/node';

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioApiKeySID = process.env.TWILIO_API_KEY_SID;
const twilioApiKeySecret = process.env.TWILIO_API_KEY_SECRET;
const client = Twilio(twilioApiKeySID, twilioApiKeySecret, { accountSid: twilioAccountSid });

interface QueryInterface {
    sid: string;
  }
export default async (request: NowRequest, response: NowResponse) => {
    console.log('go')
    const { sid } = (request.query as unknown) as QueryInterface;
    // const result = await client.video.rooms(sid)
    // .fetch()
    // .then(room => console.log(room));
    // response.json(result)

    client.video.rooms(sid)
            .update({status: 'completed'})
            .then(room => {
              console.log(room)
              response.json(room)
            }
              );

};
