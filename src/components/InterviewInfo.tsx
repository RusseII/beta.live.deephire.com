import React, { useContext } from 'react';
import { useLive } from '../hooks/useLive';
import { GlobalStateContext } from '../state/GlobalState';

import { styled, Theme } from '@material-ui/core/styles';
import { Card, Typography } from 'antd';

const Container = styled(Card)(({ theme }: { theme: Theme }) => ({
  gridArea: '3 / 1 / 4 / 2',
}));

const Notes = () => {
  const { data } = useLive();
  const { role } = useContext(GlobalStateContext);

  if (role === 'client') {
    return (
      <Container>
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
      </Container>
    );
  }

  if (role === 'recruiter') {
    return (
      <Container>
        {displayItem(data.candidateName, 'Candidate Name:')}
        {displayItem(data.jobName, 'Job Name:')}
      </Container>
    );
  }

  if (role === 'candidate') {
    return (
      <Container>
        {displayItem(data.recruiterName, 'Recruiter:')}
        {displayItem(data.jobName, 'Job Name:')}
      </Container>
    );
  }
  return (
    <Container>
      <div>Demo:</div>
      <div>Candidate Name:</div>
    </Container>
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
