import React from 'react';
import Video from 'twilio-video';
import { Result, Typography } from 'antd';
import { ChromeOutlined, AppleOutlined } from '@ant-design/icons';

const showChromeBrowser = () => (
  <Result
    title="You must be using Google Chrome to access this site"
    icon={<ChromeOutlined />}
    subTitle="Please copy the below link and paste it in Google Chrome"
    extra={<Typography.Paragraph copyable>{window.location.href}</Typography.Paragraph>}
  />
);

const showSafariBrowser = () => (
  <Result
    title="You must be using Safari to access this site"
    icon={<AppleOutlined />}
    subTitle="Please copy the below link and paste it in Safari"
    extra={<Typography.Paragraph copyable>{window.location.href}</Typography.Paragraph>}
  />
);

export default function({ children }: { children: React.ReactElement }) {
  if (!Video.isSupported) {
    const { detect } = require('detect-browser');
    const browser = detect();
    if (browser && browser.name === 'chrome') return children;
    if (browser && browser.os === 'iOS') {
      return showSafariBrowser();
    }
    return showChromeBrowser();
  }

  return children;
}
