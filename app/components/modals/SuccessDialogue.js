import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import Modal from 'react-native-modal';
import {BORDER, COLORS, GlobalStyle, SIZES, SPACING} from '../../styles/theme';
import RoundedButton from '../cores/RoundedButton';
import {windowHeight} from '../../utils/Dimensions';

const SuccessDialogue = props => {
  return (
    <Modal
      isVisible={props.showModal}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      animationInTiming={1000}
      animationOutTiming={1000}
      useNativeDriver={true}
      onBackdropPress={props.noBackdropPress ? undefined : props.onConfirm}>
      <View style={styles.container}>
        {props.image && (
          <Image
            resizeMode="stretch"
            source={props.image}
            style={{
              height: windowHeight * 0.13,
              width: windowHeight * 0.13,
              marginTop: SPACING.x_small,
            }}
          />
        )}
        <Text style={styles.sectionLabel}>{props.title}</Text>
        <Text style={styles.sectionSubLabel}>{props.body}</Text>
        <View style={styles.btnContainer}>
          <View style={styles.btnContainerWrapper}>
            <RoundedButton
              text={props.confirmButtonText}
              onPress={props.onConfirm}
              btnStyle={styles.btnStyle}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: SPACING.medium,
    backgroundColor: COLORS.white,
    borderRadius: BORDER.roundedCornerInput,
  },
  sectionLabel: {
    ...GlobalStyle.sectionLabel,
    fontSize: SIZES._14px,
    color: COLORS.darkGreen,
    paddingVertical: SPACING.x_small,
  },
  sectionSubLabel: {
    ...GlobalStyle.sectionSubLabel,
    textAlign: 'center',
    marginBottom: SPACING.large,
  },
  btnContainer: {
    flexDirection: 'row',
  },
  btnContainerWrapper: {
    flex: 1,
  },
  btnStyle: {
    borderRadius: BORDER.roundedCornerInput,
  },
});
export default SuccessDialogue;
