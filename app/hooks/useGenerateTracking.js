import useDateFormat from './useDateFormat';

const useGenerateTracking = () => {
  const now = new Date();
  const {formattedDate} = useDateFormat(now, 'MM-DD-YY');
  const dateArr = formattedDate.split('-');
  const combinedDate = dateArr[0] + dateArr[1] + dateArr[2];
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  const trackingNumber = `${combinedDate}${randomDigits}`;

  return {
    trackingNumber: trackingNumber,
  };
};

export default useGenerateTracking;
