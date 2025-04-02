import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import Modal from 'react-native-modal';
import {
  BORDER,
  COLORS,
  FONTS,
  GlobalStyle,
  SIZES,
  SPACING,
} from '../../styles/theme';
import {windowWidth} from '../../utils/Dimensions';
import RoundedButton from '../cores/RoundedButton';
import {IMAGES} from '../../constants/Images';

const CVVInfo = props => {
  return (
    <Modal
      isVisible={props.showModal} animationIn={'slideInUp'} animationOut={'slideOutDown'} animationInTiming={1000} animationOutTiming={1000} useNativeDriver={true}
      coverScreen={false}
      onBackdropPress={props.closeModal}
      style={styles.contentContainer}
      {...props}>
      <Image
        resizeMode="stretch"
        source={IMAGES.CVV_INFO}
        style={styles.image}
      />
      <View style={styles.container}>
        <Text style={styles.sectionLabel}>Card CVV</Text>
        <Text style={styles.sectionSub}>
          Card CVV is a 3-digit number found at the back of your card.
        </Text>
        <RoundedButton
          text="Got it"
          onPress={props.closeModal}
          btnStyle={{borderRadius: BORDER.circle}}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    bottom: -SPACING.large,
  },
  image: {
    width: windowWidth,
    borderTopLeftRadius: BORDER.roundedCornerCard,
    borderTopRightRadius: BORDER.roundedCornerCard,
  },
  container: {
    padding: SPACING.medium,
    backgroundColor: COLORS.white,
    width: windowWidth,
  },
  sectionLabel: {
    ...GlobalStyle.sectionLabel,
    color: COLORS.darkGreen,
    marginTop: SPACING.small,
  },
  sectionSub: {
    ...FONTS.regular,
    fontSize: SIZES._12px,
    marginBottom: SPACING.x_small,
  },
});

export default CVVInfo;
