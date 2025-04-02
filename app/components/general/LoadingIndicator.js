import Spinner from 'react-native-loading-spinner-overlay';
import {COLORS} from '../../styles/theme';

export const LoadingOverlay = (prop) => {
    return (
        <Spinner
            cancelable={true}
            animation='fade'
            visible={prop.visible}
            color={COLORS.primary}
            overlayColor={COLORS.overlay}
            textStyle={{color: COLORS.primary}}
            textContent={prop.textContent}
        />
    )
}