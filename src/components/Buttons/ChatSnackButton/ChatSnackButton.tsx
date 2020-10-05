import React, { useState } from 'react';
import ChatIcon from '@material-ui/icons/CommentOutlined';
import ChatInput from './ChatInput';
import { Button } from '@material-ui/core';
import { Popover, notification } from 'antd';
import { isMobile } from '../../../utils';

export const displayMessage = (message: string) => {
  const bottom = isMobile ? 162 : 50;
  notification.info({
    message,
    duration: 10,
    placement: 'bottomRight',
    bottom,
  });
};

export default function ChatSnackButton() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Popover
      destroyTooltipOnHide
      content={<ChatInput setIsOpen={setIsOpen} />}
      trigger="click"
      visible={isOpen}
      onVisibleChange={setIsOpen}
    >
      <Button startIcon={<ChatIcon />}>Chat</Button>
    </Popover>
  );
}
