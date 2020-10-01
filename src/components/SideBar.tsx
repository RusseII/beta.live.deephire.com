import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Tabs } from 'antd';
import { useCandidate } from '../hooks/useLive';

const { TabPane } = Tabs;

const SideBar = () => {
  const { data } = useCandidate();
  return (
    <aside style={{ background: 'rgb(79, 83, 85)', gridArea: '1 / 1 / 1 / 2' }}>
      <Documents candidateData={data}></Documents>
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
    return <ShowFile url={`https://a.deephire.com/v1/candidates/${candidateData.email}/documents/${file.uid}`} />;
  }
  return (
    <Tabs defaultActiveKey="0">
      {candidateData.files.map((file: File, i: number) => (
        <TabPane tab={file.name} key={i.toLocaleString() + 1}>
          <ShowFile url={`https://a.deephire.com/v1/candidates/${candidateData.email}/documents/${file.uid}`} />
        </TabPane>
      ))}
    </Tabs>
  );
};
const ShowFile = ({ url }: any) => <IframeGoogleDoc url={url} />;

interface IframeGoogleDocsProps {
  url: string;
}

export function IframeGoogleDoc({ url }: IframeGoogleDocsProps) {
  const [iframeTimeoutId, setIframeTimeoutId] = useState<any>();
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
    const intervalId = setInterval(updateIframeSrc, 1000 * 20);
    setIframeTimeoutId(intervalId);
  }, [updateIframeSrc]);

  function iframeLoaded() {
    clearInterval(iframeTimeoutId);
  }

  return (
    <iframe
      title="Candidate Document"
      onLoad={iframeLoaded}
      onError={updateIframeSrc}
      ref={iframeRef}
      style={{ width: '100%', height: 'calc(100vh - (72px))' }}
      src={getIframeLink()}
    />
  );
}

export default SideBar;
