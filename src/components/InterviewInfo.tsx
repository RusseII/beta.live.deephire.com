import React, { useContext } from 'react';
import { useLive } from '../hooks/useLive';
import { GlobalStateContext } from '../state/GlobalState';

import { styled, Theme } from '@material-ui/core/styles';
import { Card, Typography, Col, Row } from 'antd';
import { Statistic } from 'antd';

const { Countdown } = Statistic;

const Container = styled(Card)(({ theme }: { theme: Theme }) => ({
  height: '100%',
  overflow: 'auto',
}));

const CountDownContainer = ({ children }: any) => {
  const { data } = useLive();
  const startTime = data?.interviewTime?.[0];
  return (
    <Container>
      {startTime && <Countdown style={{ marginBottom: 8 }} title="Interview Starts In" value={startTime} />}
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

  if (role === 'candidate') {
    return (
      <CountDownContainer>
        {displayItem(data.recruiterName, 'Recruiter:')}
        {displayItem(data.jobName, 'Job Name:')}
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
        href={`mailto:${data.clientContactEmail}?subject=Interview%20with%20${data.candidateName}&body=Hi%20-%20${data.recruiterName}%0D%0A%0D%0AI%20just%20had%20an%20interview%20with%20${data.candidateName}.%0D%0A%0D%0AHere's%20a%20summary%20of%20how%20it%20went%3A%0D%0A%0D%0A%0D%0AThanks%2C`}
        target="_blank"
        rel="noopener noreferrer"
      >
        client@example.com
      </a>,
      'Email:'
    )}
    {displayItem('330-362-2448', 'Phone:')}
  </>
);

export default Notes;
