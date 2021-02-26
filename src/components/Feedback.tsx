import React, { useContext, useEffect, useState } from 'react';
import { Result, Button, Form, Rate, Row, Col, Typography, message, Statistic } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import { GlobalStateContext } from '../state/GlobalState';
import { useParticipant, useLive, Data } from '../hooks/useLive';
import InterviewInfo, { ContactDetails } from '../components/InterviewInfo';
import { makeStyles, Theme } from '@material-ui/core/styles';
import dayjs from 'dayjs';
import 'react-quill/dist/quill.snow.css';

// const onFinish = () => {
//   console.log('finished');
// };
const useStyles = makeStyles((theme: Theme) => ({
  quill: {
    '& .ql-container': {
      '& .ql-editor': {
        maxHeight: 200,
        maxWidth: '50vw',
      },
    },
  },
}));

export default function App() {
  const { data } = useLive();
  const { notes, role, setFeedbackScreen, setNotes } = useContext(GlobalStateContext);
  const [feedback, setFeedback] = useState<number | undefined>(undefined);
  const classes = useStyles();

  useParticipant(notes, feedback);

  useEffect(() => {
    if (data) {
      const { interviewType } = data;
      if (role === 'recruiter' || interviewType === 'recruiter') setFeedbackScreen(false);
    }
  }, [setFeedbackScreen, role, data]);

  if (!data) return null;

  const candidateFeedbackInfo = 'Please rate this interview and opportunity:';
  const clientFeedbackInfo = `Please rate ${data.candidateName} as a match for your opportunity:`;
  return (
    <div style={{ paddingLeft: 64, paddingRight: 64 }}>
      <Result
        icon={<SmileOutlined style={{ display: 'none' }} />}
        // status="success"
        title="You left the interview"
        subTitle="Please leave feedback below"
        extra={[
          <Button key="rejoin" onClick={() => setFeedbackScreen(false)}>
            Rejoin
          </Button>,
          // <Button key="buy">Buy Again</Button>,
        ]}
      />
      <Row gutter={64}>
        <Col sm={24} md={12}>
          <Typography.Title level={5}>Feedback</Typography.Title>
          <div style={{ marginBottom: 24 }}>
            <span style={{ marginRight: 24 }}>{role === 'client' ? clientFeedbackInfo : candidateFeedbackInfo}</span>
            <Rate onChange={setFeedback} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <ReactQuill
              className={classes.quill}
              onChange={setNotes}
              key="feedback"
              defaultValue={notes}
              placeholder="Add any notes you would like to share here"
            />
          </div>
          {/* <Button style={{ marginRight: 8 }}>Share Interview</Button> */}
          <Button type="primary" disabled={!feedback} onClick={() => message.success('Feedback Saved')}>
            Submit Feedback
          </Button>
        </Col>
        <InfoSide data={data} role={role} />
      </Row>
    </div>
  );
}

const InfoSide = ({ data, role }: { data: Data; role: string }) => {
  const { clientDebriefTime, candidateDebriefTime } = data;

  const clientDebriefTimeFormated = dayjs(clientDebriefTime).format('h:mm A dddd');
  const candidatetDebriefTimeFormated = dayjs(candidateDebriefTime).format('h:mm A dddd');
  return (
    <Col sm={24} md={12}>
      <Typography.Title level={5}>Next Steps</Typography.Title>
      {role === 'client'
        ? renderTime(!!clientDebriefTime, clientDebriefTimeFormated, data.clientContactName)
        : renderTime(!!candidateDebriefTime, candidatetDebriefTimeFormated, data.clientContactName)}

      {role === 'client' && (
        <Row style={{ marginTop: 48 }}>
          <div style={{ marginBottom: 8 }}>
            {' '}
            {data.clientContactName} will reach out to you soon. If you would like to speak sooner, please feel free to
            reach out to me using the information below to discuss the candidate.
          </div>
          <ContactDetails data={data} />
        </Row>
      )}
    </Col>
  );
};

const renderTime = (isTime: any, formatedTime: any, name: any) => (
  <>{isTime && <Statistic title={`You are scheduled to check in with ${name} at`} value={formatedTime} />}</>
);
