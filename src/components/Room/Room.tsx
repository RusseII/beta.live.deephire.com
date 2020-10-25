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
    gridTemplateRows: '1fr 40vh',
    // [theme.breakpoints.down('lg')]: {
    //   gridTemplateColumns: `100%`,
    //   gridTemplateRows: `1fr ${theme.sidebarMobileHeight + 16}px`,
    // },
  },
  files: {
    gridTemplateColumns: `1fr 40vw`,
    gridTemplateRows: `1fr  ${theme.sidebarMobileHeight + 16}px 40vh`,
    // [theme.breakpoints.down('lg')]: {
    //   gridTemplateColumns: `1fr 40vw`,
    //   gridTemplateRows: `1fr  ${theme.sidebarMobileHeight + 16}px 40vh`,
    // },
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: `100%`,
      gridTemplateRows: `1fr ${theme.sidebarMobileHeight + 16}px`,
    },
  },
  documentsNotesContainer: {
    gridArea: '3 / 1 / 4 / 2',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  notesContainer: {
    gridArea: '2 / 1 / 3 / 3',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
}));

export default function Room() {
  const { data } = useCandidate();
  const isDocuments = data?.files.length > 0;
  const classes = useStyles();

  return (
    <div
      className={clsx(classes.room, {
        [classes.noFiles]: !isDocuments,
        [classes.files]: isDocuments,
      })}
    >
      <MainParticipant isDocuments={isDocuments} />
      <BottomNotesSection isDocuments={isDocuments} />
      <ParticipantList isDocuments={isDocuments} />
      {isDocuments && <SideBar />}
    </div>
  );
}

const BottomNotesSection = ({ isDocuments }: any) => {
  const vwValue = 14 / 24;
  const classes = useStyles();
  return (
    <Row
      className={clsx({
        [classes.notesContainer]: !isDocuments,
        [classes.documentsNotesContainer]: isDocuments,
      })}
    >
      <Col span={10}>
        <InterviewInfo />
      </Col>
      {/* set style to fix bug where the notes section would overflow the container */}
      <Col style={{ height: '40vh', width: `${vwValue}vw` }} span={14}>
        <Notes />
      </Col>
    </Row>
  );
};
