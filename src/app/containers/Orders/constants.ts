export const Status = {
  DEPLOYED: { text: 'DEPLOYED', status: 'Processing' },
  PAY_IN_COMPLETED: { text: 'PAY_IN_COMPLETED', status: 'Processing' },
  PAY_COMPLETED: { text: 'PAY_COMPLETED', status: 'Success' },
  PAY_LATER: { text: 'PAY_LATER', status: 'Warning' },
  PENDING: { text: 'PENDING', status: 'Warning' },
  DELETED: { text: 'DELETED', status: 'Error' },
  REJECTED: { text: 'REJECTED', status: 'Error' },
  NEW: { text: 'NEW', status: 'Default' },
};

export enum OrderType {
  EXTEND = 'EXTEND',
  EXPIRE = 'EXPIRE',
}
