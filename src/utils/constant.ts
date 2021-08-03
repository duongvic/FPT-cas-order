import { notification } from 'antd';

export const noticeSetting = {
  placement: 'bottomRight',
  duration: 5,
};

export const noticficationBase = (status, message) => {
  notification[status]({ message, ...noticeSetting });
};
