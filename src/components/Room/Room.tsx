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
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: `100%`,
      gridTemplateRows: `1fr ${theme.sidebarMobileHeight + 16}px`,
    },
  },
  files: {
    gridTemplateColumns: `1fr ${theme.sidebarWidth}px`,
    gridTemplateRows: '100%',
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: `100%`,
      gridTemplateRows: `1fr ${theme.sidebarMobileHeight + 16}px`,
    },
  },
}));

export default function Room() {
  const { data } = useCandidate();
  // const files = data?.files;
  const classes = useStyles();

  return (
    <div
      className={clsx(classes.room, {
        [classes.noFiles]: true,
        [classes.files]: false,
      })}
    >
      <MainParticipant />
      <ParticipantList />
      {/* {files && <SideBar />} */}
    </div>
  );
}
