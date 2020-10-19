import { ShareAltOutlined } from '@ant-design/icons';
import { Tooltip, Popover, Radio, Typography, Space, Button } from 'antd';
import React, { useContext, useState } from 'react';
import { useLive } from '../hooks/useLive';
import { GlobalStateContext } from '../state/GlobalState';

const ShareInterview = ({ url = window.location.href }: any) => {
  const { role } = useContext(GlobalStateContext);
  const [visibility, setVisibility] = useState({ hovered: false, clicked: false });
  return (
    <>
      {role === 'recruiter' && (
        <Tooltip
          title="Share interview link"
          trigger="hover"
          visible={visibility.hovered}
          onVisibleChange={visible => setVisibility({ hovered: visible, clicked: false })}
        >
          <Popover
            title="Share link to the Interview"
            // content={<Text copyable>{url}</Text>}
            placement="topRight"
            content={<Content url={url} />}
            trigger="click"
            visible={visibility.clicked}
            onVisibleChange={visible => setVisibility({ hovered: false, clicked: visible })}
          >
            <Button type="text" style={{ height: 50 }}>
              <ShareAltOutlined />
              Share
            </Button>
          </Popover>
        </Tooltip>
      )}
    </>
  );
};

const Content = ({ url }: any) => {
  const { data } = useLive();
  const [role, setRole] = useState<'candidate' | 'recruiter' | 'client' | null>(null);
  console.log({ data });

  return (
    <Space size="middle" direction="vertical">
      <div>This link is unique for the role of the person you would like to share with.</div>
      <Space>
        Share with a
        <Radio.Group onChange={e => setRole(e.target.value)}>
          <Radio.Button value="candidate">Candidate</Radio.Button>
          <Radio.Button value="recruiter">Recruiter</Radio.Button>
          {data.interviewType === 'client' && <Radio.Button value="client">Client</Radio.Button>}
        </Radio.Group>
      </Space>
      <div>{role && <Typography.Text keyboard copyable>{`${url}?role=${role}`}</Typography.Text>}</div>
    </Space>
  );
};

export default ShareInterview;
