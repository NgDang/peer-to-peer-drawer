import React, { useState } from 'react'
import { Modal, Input, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { UserType } from 'containers/App/types'

interface UserModalProps {
  currentUser: UserType;
  onCreate(username: string): void;
}

const UserModal = (props: UserModalProps) => {

  const { currentUser, onCreate } = props;

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [username, setUsername] = useState('');


  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      onCreate(username)
      setConfirmLoading(false);
    }, 2000);
  };

  const handleChangeUsername = (e) => {
    e.preventDefault();
    setUsername(e.target.value)
  }

  return (
    <Modal
      centered
      closable={false}
      title="Please enter username"
      visible={!currentUser?.id}
      footer={[
        <Button key="submit" type="primary" loading={confirmLoading} onClick={handleOk} disabled={!!!username}>
          Submit
        </Button>
      ]}
    >
      <Input
        placeholder="Enter your username"
        prefix={<UserOutlined />}
        value={username}
        onChange={handleChangeUsername}
      />
    </Modal>
  );
};

export default UserModal;
