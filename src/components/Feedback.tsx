import React, { useContext } from 'react';
import { Result, Button, Form, Rate, Row, Col } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import { GlobalStateContext } from '../state/GlobalState';

import 'react-quill/dist/quill.snow.css';

const onFinish = () => {
  console.log('finished');
};

export default function App() {
  const { notes, role, setFeedbackScreen } = useContext(GlobalStateContext);

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
        <Col span={12}>
          <Form onFinish={onFinish}>
            <Form.Item name="rating" label="Please rate ___ as a match for your opportunity">
              <Rate />
            </Form.Item>
          </Form>
          <ReactQuill
            // onChange={setNotes}
            key="feedback"
            defaultValue={notes}
            placeholder="Add any notes you would like to share here"
          />
          Contact Sally: 330-362-2448 Sally@gmail.com
        </Col>
        <Col span={12}>You have a follow up meeting scheduled for Thursday.</Col>
      </Row>
    </div>
  );
}
