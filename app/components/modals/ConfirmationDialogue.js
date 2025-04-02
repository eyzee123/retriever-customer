import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import {BORDER, COLORS, GlobalStyle, SIZES, SPACING} from '../../styles/theme';
import RoundedButton from '../cores/RoundedButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {IMAGES} from '../../constants/Images';
import {windowHeight} from '../../utils/Dimensions';

const ConfirmationDialogue = props => {
  return (
    <Modal
      isVisible={props.showModal}
      onBackdropPress={props.onCancel}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      animationInTiming={1000}
      animationOutTiming={1000}
      useNativeDriver={true}>
      <View style={styles(props).container}>
        {/* {props.logout ? null : (
          <Image
            resizeMode="stretch"
            source={props.image}
            style={{height: windowHeight * 0.13, width: windowHeight * 0.13}}
          />
        )} */}
        <Text style={styles(props).sectionLabel}>{props.title}</Text>
        <Text style={styles(props).sectionSubLabel}>{props.body}</Text>
        <View style={styles(props).btnContainer}>
          {!props.single ? (
            <View style={styles(props).btnContainerWrapper}>
              <RoundedButton
                text={props.onCancelButtonText}
                onPress={props.onCancel}
                btnStyle={[
                  styles(props).btnStyle,
                  {
                    backgroundColor: COLORS.subTextColor,
                  },
                ]}
                btnText={{color: COLORS.subTextColor1}}
              />
            </View>
          ) : null}
          <View
            style={[
              styles(props).btnContainerWrapper,
              {marginLeft: SPACING.x_small},
            ]}>
            <RoundedButton
              text={props.confirmButtonText}
              onPress={props.onConfirm}
              btnStyle={styles(props).btnStyle}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = props =>
  StyleSheet.create({
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
      backgroundColor: COLORS.orange,
    },
  });
export default ConfirmationDialogue;
