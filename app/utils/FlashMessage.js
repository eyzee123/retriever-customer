import { showMessage } from 'react-native-flash-message';
import { COLORS } from '../styles/theme';

export function showSuccessMessage(text) {
  showMessage({
    message: text,
    type: 'success',
    backgroundColor: COLORS.brandGreen,
    color: COLORS.white,
  });
}

export function showErrorMessage(text) {
  showMessage({
    message: text,
    duration: 5000,
    type: 'danger',
    backgroundColor: COLORS.red,
    color: COLORS.white,
  });
}
