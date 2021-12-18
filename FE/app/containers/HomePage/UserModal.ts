import React, {useState} from 'react'
import { Modal, Button } from 'antd';

export const UserModal = ({visible, onConfirm}) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = React.useState('Content of the modal');

  const handleOk = () => {
    setModalText('The modal will be closed after two seconds');
    setConfirmLoading(true);
    setTimeout(() => {
      setVisible(false);
      setConfirmLoading(false);
    }, 2000);
  };

  return (
    <Modal
        title="Title"
        visible={visible}
        onOk={onConfirm}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{modalText}</p>
      </Modal>
  );
};
