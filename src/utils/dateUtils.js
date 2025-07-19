import dayjs from 'dayjs';

export const formatDate = (dateString) => {
  return dayjs(dateString).format('YYYY/MM/DD HH:mm');
};

export const formatToJST = (utcDateString) => {
  const date = new Date(utcDateString);

  // 日本時間に変換してフォーマット
  return date.toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};
