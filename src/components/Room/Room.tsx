import React from 'react';
import ParticipantList from '../ParticipantList/ParticipantList';
import { makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import MainParticipant from '../MainParticipant/MainParticipant';
import SideBar from '../SideBar';
import { useCandidate } from '../../hooks/useLive';
import Notes from '../Notes';
import InterviewInfo from '../InterviewInfo';
import { Row, Col } from 'antd';
const useStyles = makeStyles((theme: Theme) => ({
  room: {
    position: 'relative',
    height: '100%',
    display: 'grid',
  },
  noFiles: {
    gridTemplateColumns: `1fr ${theme.sidebarWidth}px`,
    gridTemplateRows: '100% 30vh',
    [theme.breakpoints.down('lg')]: {
      gridTemplateColumns: `100%`,
      gridTemplateRows: `1fr ${theme.sidebarMobileHeight + 16}px`,
    },
  },
  files: {
    gridTemplateColumns: `1fr 40vw`,
    gridTemplateRows: `1fr  ${theme.sidebarMobileHeight + 16}px 30vh`,
    // [theme.breakpoints.down('lg')]: {
    //   gridTemplateColumns: `1fr 40vw`,
    //   gridTemplateRows: `1fr  ${theme.sidebarMobileHeight + 16}px 40vh`,
    // },
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: `100%`,
      gridTemplateRows: `1fr ${theme.sidebarMobileHeight + 16}px`,
    },
  },
  notesContainer: {
    gridArea: '3  / 1 / 4 / 2',
    // [theme.breakpoints.down('lg')]: {
    // gridArea: '3  / 1 / 4 / 2',
    // }
  },
}));

export default function Room() {
  const { data } = useCandidate();
  const isDocuments = data?.files.length > 0;
  // const isDocuments = false
  const classes = useStyles();

  return (
    <div
      className={clsx(classes.room, {
        [classes.noFiles]: !isDocuments,
        [classes.files]: isDocuments,
      })}
    >
      <MainParticipant />
      <BottomNotesSection />
      <ParticipantList isDocuments={isDocuments} />
      {isDocuments && <SideBar />}
    </div>
  );
}

const BottomNotesSection = () => {
  const classes = useStyles();
  return (
    <Row className={clsx(classes.notesContainer)}>
      <Col span={8}>
        <InterviewInfo />
      </Col>
      <Col span={16}>
        <Notes />
      </Col>
    </Row>
  );
};
