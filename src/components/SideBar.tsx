import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Tabs, Row, Col } from 'antd';
import { useCandidate } from '../hooks/useLive';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { backOff } from 'exponential-backoff';
import clsx from 'clsx';
import InterviewInfo from './InterviewInfo';

const { TabPane } = Tabs;

// const Container = styled('aside')(({ theme }: { theme: Theme }) => ({
//   background: 'rgb(79, 83, 85)',
//   gridArea: '1 / 2 / 4 / 3',
//   // gridArea: '3 / 1 / 4 / 2',

//   // [theme.breakpoints.down('lg')]: {
//     // gridArea: '1 / 2 / 3 / 3',
//   // },
// }));

const useStyles = makeStyles((theme: Theme) => ({
  background: {
    background: 'rgb(79, 83, 85)',
    height: '100%',
  },
  rightSide: {
    gridArea: '1 / 2 / 4 / 3',
  },
  bottom: {
    gridArea: '3 / 1 / 4 / 2',
  },
}));

const SideBar = ({ view }: any) => {
  const { data } = useCandidate();
  const classes = useStyles();

  return (
    <aside
      className={clsx(classes.background, {
        [classes.rightSide]: view === 'default',
        [classes.bottom]: view === 'alternate',
      })}
    >
      <Row className={clsx(classes.background)}>
        <Col flex="auto">
          <Documents candidateData={data}></Documents>
        </Col>
        {view === 'alternate' && (
          <Col>
            <InterviewInfo />
          </Col>
        )}
      </Row>
    </aside>
  );
};
interface DocumentsProps {
  candidateData: CandidateData;
}

interface CandidateData {
  files: File[];
  email: string;
}

interface File {
  name: string;
  uid: string;
}
const Documents = ({ candidateData }: DocumentsProps) => {
  if (candidateData?.files.length < 2) {
    const [file] = candidateData?.files;
    return (
      <ShowFile
        header={false}
        url={`https://a.deephire.com/v1/candidates/${candidateData.email}/documents/${file.uid}`}
      />
    );
  }
  return (
    <Tabs style={{ padding: 24, color: 'white' }} defaultActiveKey="0">
      {candidateData.files.map((file: File, i: number) => (
        <TabPane tab={file.name} key={i.toLocaleString() + 1}>
          <ShowFile
            header={true}
            url={`https://a.deephire.com/v1/candidates/${candidateData.email}/documents/${file.uid}`}
          />
        </TabPane>
      ))}
    </Tabs>
  );
};
const ShowFile = ({ url, header }: any) => <IframeGoogleDoc header={header} url={url} />;

interface IframeGoogleDocsProps {
  url: string;
  header: boolean;
}

export function IframeGoogleDoc({ url, header }: IframeGoogleDocsProps) {
  const iframeRef: any = useRef(null);
  const getIframeLink = useCallback(() => {
    return `https://docs.google.com/gview?url=${url}&embedded=true`;
  }, [url]);

  const updateIframeSrc = useCallback(() => {
    if (iframeRef.current) {
      iframeRef!.current!.src = getIframeLink();
    }
  }, [getIframeLink]);

  useEffect(() => {
    const load = async () => {
      await backOff(
        () => {
          updateIframeSrc();
          return iframeRef.current.deephireLoaded ? Promise.resolve() : Promise.reject();
        },
        {
          startingDelay: 2000,
        }
      );
    };
    load();
  }, [updateIframeSrc]);

  return (
    <iframe
      title="Candidate Document"
      onLoad={() => {
        iframeRef.current.deephireLoaded = true;
      }}
      onError={updateIframeSrc}
      ref={iframeRef}
      style={{ width: '100%', height: '100%' }}
      src={getIframeLink()}
    />
  );
}

export default SideBar;
