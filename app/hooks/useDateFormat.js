import moment from 'moment';
import {STRING_FORMAT} from '../constants/ProjectConstants';

const useDateFormat = (date, format = STRING_FORMAT.DATE_FORMAT) => {
  const currentDateFormat = 'YYYY-MM-DD';
  const FormattedDateFormat = format;

  return {
    formattedDate: moment(date, currentDateFormat).format(FormattedDateFormat),
  };
};

export default useDateFormat;
