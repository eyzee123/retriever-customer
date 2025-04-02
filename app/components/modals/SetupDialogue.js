import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import Modal from 'react-native-modal';
import {BORDER, COLORS, GlobalStyle, SPACING} from '../../styles/theme';
import RoundedButton from '../cores/RoundedButton';
import {windowHeight} from '../../utils/Dimensions';

const SetupDialogue = props => {
  return (
    <Modal
      isVisible={props.showModal}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      animationInTiming={1000}
      animationOutTiming={1000}
      useNativeDriver={true}
      onModalHide={props.onModalHide}
      onBackdropPress={props.closeModal}>
      <View style={styles.contentContainer}>
        {props.image ? (
          <Image
            resizeMode="stretch"
            source={props.image}
            style={[
              {
                height: windowHeight * 0.13,
                width: windowHeight * 0.13,
                marginTop: SPACING.x_small,
              },
              props.imageStyle,
            ]}
          />
        ) : null}
        <Text style={styles.sectionLabel}>{props.title}</Text>
        <Text style={styles.sectionSub}>{props.body}</Text>
        <View style={styles.buttonContainer}>
          <RoundedButton
            text={props.onConfirmText}
            onPress={props.onConfirmButton}
            btnStyle={styles.btnStyle}
          />
          <RoundedButton
            text={props.onConfirmText1}
            onPress={props.onConfirmButton1}
            btnStyle={[styles.btnStyle, {backgroundColor: COLORS.transparent}]}
            btnText={{color: COLORS.orange}}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: 'center',
    borderRadius: BORDER.roundedCornerPopupCard,
    backgroundColor: COLORS.white,
    padding: SPACING.medium,
  },
  svgContainer: {
    height: windowHeight * 0.18,
  },
  sectionLabel: {
    ...GlobalStyle.sectionLabel,
    color: COLORS.darkGreen,
    marginTop: SPACING.small,
  },
  sectionSub: {
    ...GlobalStyle.sectionSubLabel,
    textAlign: 'center',
    marginVertical: SPACING.small,
  },
  buttonContainer: {
    width: '100%',
  },
  btnStyle: {
    borderRadius: 12,
  },
});
export default SetupDialogue;
