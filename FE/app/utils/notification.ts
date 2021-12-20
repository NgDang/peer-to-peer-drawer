
import { notification } from 'antd';

export const openNotificationWithIcon = (type: string, title : string, description?: string) => {
  notification[type]({
    message: title,
    description: description,
  });
};
