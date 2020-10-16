import React, { useContext } from 'react';
import { useLive } from '../hooks/useLive';
import { GlobalStateContext } from '../state/GlobalState';

import { styled, Theme } from '@material-ui/core/styles';
import { Card, Typography } from 'antd';
import { Statistic } from 'antd';

const { Countdown } = Statistic;

const Container = styled(Card)(({ theme }: { theme: Theme }) => ({
  gridArea: '3 / 1 / 4 / 2',
  overflow: 'auto',
}));

const CountDownContainer = ({ children }: any) => {
  const { data } = useLive();
  const startTime = data?.interviewTime?.[0];
  return (
    <Container>
      {startTime && <Countdown style={{ marginBottom: 8 }} title="Interview Starts In" value={startTime} />}
      {children}
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
          <Typography.Text strong>Candidate Name:</Typography.Text>
          <Typography.Paragraph>{data.candidateName}</Typography.Paragraph>
        </>

        {data.jobName && (
          <>
            <Typography.Text strong>Job Position:</Typography.Text>
            <Typography.Paragraph>{data.jobName}</Typography.Paragraph>
          </>
        )}
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

const displayItem = (field: string | undefined, title: string) =>
  field && (
    <>
      <Typography.Text strong>{title}</Typography.Text>
      <Typography.Paragraph>{field}</Typography.Paragraph>
    </>
  );

export default Notes;
