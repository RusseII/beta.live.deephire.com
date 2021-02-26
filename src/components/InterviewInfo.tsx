import React, { useContext } from 'react';
import { useLive } from '../hooks/useLive';
import { GlobalStateContext } from '../state/GlobalState';

import { styled, Theme } from '@material-ui/core/styles';
import { Card, Typography, Col, Row, Select } from 'antd';
import { Statistic } from 'antd';

const { Countdown } = Statistic;

const Container = styled(Card)(({ theme }: { theme: Theme }) => ({
  height: '100%',
  overflow: 'auto',
}));

const AppleoneOA = (offsysid: string, xpress_id: string) => (
  <Typography.Text
    copyable={{ text: `http://oadevweb01/oanetsales_20-09/default.aspx?offsysid=${offsysid}&xpress_id=${xpress_id}` }}
  >
    Copy OA Link
  </Typography.Text>
);

const CountDownContainer = ({ children }: any) => {
  const { data } = useLive();
  const { OffSysID, XpressID } = data || {};
  const { startingRole } = useContext(GlobalStateContext);

  const startTime = data?.interviewTime?.[0];
  return (
    <Container>
      <Row style={{ marginBottom: 24 }}>
        <Col span={12}>
          {startTime && <Countdown style={{ marginBottom: 8 }} title="Interview Starts In" value={startTime} />}
        </Col>
        <Col span={12}>
          {startingRole === 'recruiter' && data.interviewType === 'client' && displayItem(<SelectRole />, 'View As')}

          {OffSysID &&
            XpressID &&
            startingRole === 'recruiter' &&
            data.interviewType === 'recruiter' &&
            AppleoneOA(OffSysID, XpressID)}
        </Col>
      </Row>
      <Row>{children}</Row>
    </Container>
  );
};
const Notes = () => {
  const { data } = useLive();
  const { role } = useContext(GlobalStateContext);

  if (role === 'client') {
    return (
      <CountDownContainer>
        <>
          {displayItem(data.candidateName, 'Candidate Name:')}
          {displayItem(data.jobName, 'Job Position')}
          <ContactDetails data={data}></ContactDetails>
        </>
      </CountDownContainer>
    );
  }

  if (role === 'recruiter') {
    return (
      <CountDownContainer>
        {displayItem(data.candidateName, 'Candidate Name:')}
        {displayItem(data.jobName, 'Job Name:')}
      </CountDownContainer>
    );
  }

  if (role === 'candidate' && data.interviewType === 'recruiter') {
    return (
      <CountDownContainer>
        {displayItem(data.recruiterName, 'Recruiter:')}
        {displayItem(data.jobName, 'Job Name:')}
        {displayItem(data.phone, 'Phone')}
      </CountDownContainer>
    );
  }

  if (role === 'candidate' && data.interviewType === 'client') {
    return (
      <CountDownContainer>
        {displayItem(data.clientName, 'Interviewer:')}
        {displayItem(data.clientTitle, 'Title: ')}
        {displayItem(data.clientCompany, 'Company:')}
        {displayItem(data.jobName, 'Position:')}
      </CountDownContainer>
    );
  }
  return (
    <CountDownContainer>
      <div>Demo:</div>
      <div>Candidate Name:</div>
    </CountDownContainer>
  );
};

const displayItem = (field: any, title: string) =>
  field && (
    <Col span={12}>
      <Typography.Text strong>{title}</Typography.Text>
      <Typography.Paragraph>{field}</Typography.Paragraph>
    </Col>
  );

export const ContactDetails = ({ data }: any) => (
  // <>
  //   {displayItem(data.clientContactEmail, 'Email:')}
  //   {displayItem(data.phone, 'Phone:')}
  // </>
  <>
    {displayItem(
      <a
        href={`mailto:${data.clientContactEmail}?subject=Interview%20with%20${data.candidateName}&body=Hi%20-%20${data.recruiterName},`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {data.clientContactEmail}
      </a>,
      'Recruiter Email:'
    )}
    {displayItem(data.phone, 'Phone:')}
  </>
);

const SelectRole = () => {
  const { setRole } = useContext(GlobalStateContext);
  return (
    <Select
      defaultValue="recruiter"
      style={{ width: 150 }}
      onChange={(value: 'recruiter' | 'client' | 'candidate') => setRole(value)}
    >
      <Select.Option value="candidate">Candidate</Select.Option>
      <Select.Option value="recruiter">Recruiter</Select.Option>
      <Select.Option value="client">Client</Select.Option>
    </Select>
  );
};
export default Notes;
