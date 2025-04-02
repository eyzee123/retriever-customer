import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import {BORDER, COLORS, SIZES, SPACING} from '../../styles/theme';
import RoundedButton from '../cores/RoundedButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {IMAGES} from '../../constants/Images';
import {windowHeight} from '../../utils/Dimensions';
import FastImage from 'react-native-fast-image';

const WelcomeToast = ({showModal, closeModal, onPress}) => {
  return (
    <Modal
      isVisible={showModal}
      onBackdropPress={closeModal}
      animationIn={'slideInDown'}
      animationOut={'slideOutDown'}
      animationInTiming={1000}
      animationOutTiming={1000}>
      <FastImage source={IMAGES.WELCOME_TOAST2} style={styles.container}>
        <TouchableOpacity style={styles.close} onPress={closeModal}>
          <Icon
            name="close"
            size={SIZES.iconSize.medium}
            color={COLORS.white}
          />
        </TouchableOpacity>
        <View style={styles.btnContainer}>
          <RoundedButton
            text="Take me there"
            onPress={onPress}
            btnStyle={styles.btnStyle}
          />
        </View>
      </FastImage>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    height: windowHeight * 0.7,
    borderRadius: 16,
  },
  close: {
    position: 'absolute',
    top: SPACING.medium,
    right: SPACING.small,
    padding: SPACING.x_small,
    borderRadius: BORDER.circle,
  },
  btnContainer: {
    position: 'absolute',
    width: '100%',
    bottom: SPACING.large,
    paddingHorizontal: SPACING.medium,
  },
  btnStyle: {
    borderRadius: BORDER.roundedCornerInput,
  },
});
export default WelcomeToast;
