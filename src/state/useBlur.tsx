import { useCallback, useState } from 'react';
import { wait } from '../utils/wait';
import { LocalVideoTrack } from 'twilio-video';

declare global {
  export interface HTMLCanvasElement {
    captureStream(frameRate: number): MediaStream;
  }
  var bodyPix: typeof import('@tensorflow-models/body-pix');
}

interface UseBlurLocalTrackArgs {
  onCreateVideoTrack?: (track: LocalVideoTrack) => void;
}

// TODO: Someday we'll create an OSS for this
export const useBlurLocalTrack = ({ onCreateVideoTrack }: UseBlurLocalTrackArgs) => {
  const [isVideoBlur, setIsVideoBlur] = useState(false);

  const toggleVideoBlur = useCallback(async () => {
    setIsVideoBlur(!isVideoBlur);

    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const video = document.getElementById('video') as HTMLVideoElement;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    if (isVideoBlur) {
      video.pause();
      video.srcObject = null;
      const videoTrack = new LocalVideoTrack(stream.getVideoTracks()[0]);
      onCreateVideoTrack && onCreateVideoTrack(videoTrack);
      return videoTrack;
    }

    const net = await bodyPix.load({
      multiplier: 0.5,
      quantBytes: 2,
      architecture: 'MobileNetV1',
      outputStride: 16,
    });

    video.addEventListener('play', () => {
      async function step() {
        const segmentation = await net.segmentPerson(video);
        bodyPix.drawBokehEffect(
          canvas,
          video,
          segmentation,
          6, // backgroundBlurAmount
          2, // edgeBlurAmount
          false // flipHorizontal
        );

        // Add delay to decrease frame rate for performance reason
        setTimeout(() => {
          requestAnimationFrame(step);
        }, 33.33); // TODO: make this value configurable based on user device
      }
      requestAnimationFrame(step);
    });

    video.srcObject = stream;

    // Add delay to wait for video stream is ready
    await wait(1000);
    await video.play();

    // This delay is important for Firefox!
    await wait(1000);

    const localVideoTrack = new LocalVideoTrack(canvas.captureStream(10).getVideoTracks()[0]);

    onCreateVideoTrack && onCreateVideoTrack(localVideoTrack);

    return localVideoTrack;
  }, [isVideoBlur, onCreateVideoTrack]);

  return { toggleVideoBlur, isVideoBlur };
};
