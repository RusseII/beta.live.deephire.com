import React from 'react';
import clsx from 'clsx';
import Participant from '../Participant/Participant';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import useMainParticipant from '../../hooks/useMainParticipant/useMainParticipant';
import useParticipants from '../../hooks/useParticipants/useParticipants';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useSelectedParticipant from '../VideoProvider/useSelectedParticipant/useSelectedParticipant';
import useScreenShareParticipant from '../../hooks/useScreenShareParticipant/useScreenShareParticipant';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: '2em',
      overflowY: 'auto',
      background: 'rgb(79, 83, 85)',
      zIndex: 5,
      [theme.breakpoints.down('lg')]: {
        overflowY: 'initial',
        overflowX: 'auto',
        display: 'flex',
        padding: '8px',
      },
    },
    noFiles: {
      gridArea: '1 / 2 / 1 / 3',
      [theme.breakpoints.down('lg')]: {
        gridArea: '2 / 1 / 3 / 3',
      },
    },
    files: {
      gridArea: '1 / 2 / 1 / 3',
      [theme.breakpoints.down('lg')]: {
        gridArea: '2 / 1 / 3 / 3',
      },
    },
    transparentBackground: {
      background: 'transparent',
    },
    scrollContainer: {
      [theme.breakpoints.down('lg')]: {
        display: 'flex',
      },
    },
  })
);

interface ParticipantListProps {
  isDocuments: boolean;
}
export default function ParticipantList({ isDocuments }: ParticipantListProps) {
  const classes = useStyles();
  const {
    room: { localParticipant },
  } = useVideoContext();
  const participants = useParticipants();
  const [selectedParticipant, setSelectedParticipant] = useSelectedParticipant();
  const screenShareParticipant = useScreenShareParticipant();
  const mainParticipant = useMainParticipant();
  const isRemoteParticipantScreenSharing = screenShareParticipant && screenShareParticipant !== localParticipant;

  if (participants.length === 0) return null; // Don't render this component if there are no remote participants.

  return (
    <aside
      className={clsx(classes.container, {
        [classes.transparentBackground]: !isRemoteParticipantScreenSharing,
        [classes.files]: !isDocuments,
        [classes.noFiles]: isDocuments,
      })}
    >
      <div className={classes.scrollContainer}>
        <Participant participant={localParticipant} isLocalParticipant={true} />
        {participants.map(participant => {
          const isSelected = participant === selectedParticipant;
          const hideParticipant =
            participant === mainParticipant && participant !== screenShareParticipant && !isSelected;
          return (
            <Participant
              key={participant.sid}
              participant={participant}
              isSelected={participant === selectedParticipant}
              onClick={() => setSelectedParticipant(participant)}
              hideParticipant={hideParticipant}
            />
          );
        })}
      </div>
    </aside>
  );
}
