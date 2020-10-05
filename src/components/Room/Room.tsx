import React from 'react';
import ParticipantList from '../ParticipantList/ParticipantList';
import { makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import MainParticipant from '../MainParticipant/MainParticipant';
import SideBar from '../SideBar';
import { useCandidate } from '../../hooks/useLive';

const useStyles = makeStyles((theme: Theme) => ({
  room: {
    position: 'relative',
    height: '100%',
    display: 'grid',
  },
  noFiles: {
    gridTemplateColumns: `1fr ${theme.sidebarWidth}px`,
    gridTemplateRows: '100%',
    [theme.breakpoints.down('lg')]: {
      gridTemplateColumns: `100%`,
      gridTemplateRows: `1fr ${theme.sidebarMobileHeight + 16}px`,
    },
  },
  files: {
    gridTemplateColumns: `1fr ${theme.sidebarWidth}px 40vw`,
    gridTemplateRows: '100%',
    [theme.breakpoints.down('lg')]: {
      gridTemplateColumns: `1fr 0px 40vw`,
      gridTemplateRows: `1fr ${theme.sidebarMobileHeight + 16}px`,
    },
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: `100%`,
      gridTemplateRows: `1fr ${theme.sidebarMobileHeight + 16}px`,
    },
  },
}));

export default function Room() {
  const { data } = useCandidate();
  const isDocuments = data?.files.length > 0;
  const classes = useStyles();

  console.log({ isDocuments });
  return (
    <div
      className={clsx(classes.room, {
        [classes.noFiles]: !isDocuments,
        [classes.files]: isDocuments,
      })}
    >
      <MainParticipant />
      <ParticipantList isDocuments={isDocuments} />
      {isDocuments && <SideBar />}
    </div>
  );
}
