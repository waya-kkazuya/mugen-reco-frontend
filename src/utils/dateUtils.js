import dayjs from 'dayjs';

export const formatDate = (dateString) => {
  return dayjs(dateString).format('YYYY/MM/DD HH:mm');
};
