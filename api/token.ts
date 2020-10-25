import { NowRequest, NowResponse } from '@vercel/node';
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

const fourHours = 14400;
const MAX_ALLOWED_SESSION_DURATION = fourHours;
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioApiKeySID = process.env.TWILIO_API_KEY_SID;
const twilioApiKeySecret = process.env.TWILIO_API_KEY_SECRET;

const client = require('twilio')(twilioApiKeySID, twilioApiKeySecret, { accountSid: twilioAccountSid });

const createRoom = async (roomName: string | string[]) => {
  try {
    const room = await client.video.rooms.create({
      recordParticipantsOnConnect: true,
      statusCallback: 'https://a.deephire.com/v1/live/events',
      type: 'group',
      uniqueName: roomName,
    });
    console.log('created room', room)
  } catch (err) {
    console.log('error creating room', err);
  }
};

interface QueryInterface {
  roomName: string;
  identity: string;
}
export default async (request: NowRequest, response: NowResponse) => {
  const { identity, roomName } = request.query;
  await createRoom(roomName);
  const token = new AccessToken(twilioAccountSid, twilioApiKeySID, twilioApiKeySecret, {
    ttl: MAX_ALLOWED_SESSION_DURATION,
  });
  token.identity = identity;
  const videoGrant = new VideoGrant({ room: roomName });
  token.addGrant(videoGrant);

  response.status(200).send(token.toJwt());
};
