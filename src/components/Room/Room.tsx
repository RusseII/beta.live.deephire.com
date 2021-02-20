import React, { useContext } from 'react';
import ParticipantList from '../ParticipantList/ParticipantList';
import { makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import MainParticipant from '../MainParticipant/MainParticipant';
import SideBar from '../SideBar';
import { useCandidate } from '../../hooks/useLive';
import Notes from '../Notes';
import InterviewInfo from '../InterviewInfo';
import { Row, Col } from 'antd';
import { GlobalStateContext } from '../../state/GlobalState';

const useStyles = makeStyles((theme: Theme) => ({
  room: {
    position: 'relative',
    height: '100%',
    display: 'grid',
  },
  noFiles: {
    gridTemplateColumns: `${theme.sidebarWidth}px 1fr 40vw`,
    gridTemplateRows: '60vh 40vh',
    [theme.breakpoints.down('xs')]: {
      gridTemplateRows: `100%`,
    },
    // [theme.breakpoints.down('lg')]: {
    //   gridTemplateColumns: `100%`,
    //   gridTemplateRows: `1fr ${theme.sidebarMobileHeight + 16}px`,
    // },
  },

  noFilesAlternate: {
    gridTemplateColumns: `${theme.sidebarWidth}px 1fr 40vw`,
    gridTemplateRows: '100vh',
    [theme.breakpoints.down('xs')]: {
      gridTemplateRows: `100%`,
    },
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
  fullscreen: {
    gridTemplateColumns: `${theme.sidebarWidth}px 1fr`,
    gridTemplateRows: '100%',
  },
  documentsNotesContainer: {
    gridArea: '3 / 1 / 4 / 2',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  notesContainer: {
    gridArea: '2 / 1 / 3 / 4',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },

  rightContainer: {
    gridArea: '1 / 2 / 4 / 3',
  },

  rightContainerNoFiles: {
    gridArea: '1 / 3 / 4 / 4',
  },
}));

export default function Room() {
  const { data } = useCandidate();
  const { view } = useContext(GlobalStateContext);

  const isDocuments = data?.files.length > 0 && view !== 'fullscreen';

  const classes = useStyles();

  return (
    <div
      className={clsx(classes.room, {
        [classes.noFiles]: !isDocuments,
        [classes.files]: isDocuments,
        [classes.noFilesAlternate]: view === 'alternate' && !isDocuments,
        [classes.fullscreen]: view === 'fullscreen',
      })}
    >
      <MainParticipant isDocuments={isDocuments} />
      <BottomNotesSection view={view} isDocuments={isDocuments} />
      <ParticipantList isDocuments={isDocuments} />
      {isDocuments && <SideBar view={view} />}
    </div>
  );
}

const BottomNotesSection = ({ isDocuments, view }: any) => {
  const classes = useStyles();
  return (
    <Row
      className={clsx({
        [classes.notesContainer]: !isDocuments,
        [classes.documentsNotesContainer]: isDocuments,
        [classes.rightContainer]: view === 'alternate' && isDocuments,
        [classes.rightContainerNoFiles]: view === 'alternate' && !isDocuments,
      })}
    >
      {view === 'default' && (
        <Col>
          <InterviewInfo />
        </Col>
      )}
      {/* set style to fix bug where the notes section would overflow the container */}
      <Col style={{ height: '100%', width: `0vw` }} flex="auto">
        <Notes />
      </Col>
    </Row>
  );
};
