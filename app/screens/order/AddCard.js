import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import RoundedInput from '../../components/cores/RoundedInput';
import RoundedInputIcon from '../../components/cores/RoundedInputIcon';
import Header from '../../components/headers/Header';
import {
  BORDER,
  COLORS,
  FONTS,
  GlobalStyle,
  SIZES,
  SPACING,
} from '../../styles/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RoundedButton from '../../components/cores/RoundedButton';
import CVVInfo from '../../components/modals/CVVInfo';
import ExpiryInfo from '../../components/modals/ExpiryInfo';
import {ROUTES} from '../../constants/Routes';
import {windowHeight} from '../../utils/Dimensions';

const AddCard = props => {
  const [openModalCVVInfo, setOpenModalCVVInfo] = useState(false);
  const [openModalExpiryInfo, setOpenModalExpiryInfo] = useState(false);
  const clickToShowCVVInfo = () => {
    setOpenModalCVVInfo(true);
  };
  const clickToCloseCVVInfo = () => {
    setOpenModalCVVInfo(false);
  };
  const clickToShowExpiryInfo = () => {
    setOpenModalExpiryInfo(true);
  };
  const clickToCloseExpiryInfo = () => {
    setOpenModalExpiryInfo(false);
  };
  return (
    <MainScreen>
      <Header title="Add Card" >
        <TouchableOpacity
          style={[styles.viewRight, {marginRight: SPACING.small}]}
          onPress={() => navigation.navigate(ROUTES.CART_DETAILS)}>
          <Image
            resizeMode="stretch"
            source={require('../../assets/icons/cart1.png')}
            style={{height: '100%', width: '100%'}}
          />
        </TouchableOpacity>
      </Header>
      <MainFrame fullscreen>
        <View style={styles.container}>
          <Text style={styles.sectionLabel}>Card Number</Text>
          <RoundedInputIcon
            image={require('../../assets/icons/card.png')}
            placeholder="Enter card number"
            inputStyle={styles.inputStyle}
          />
          <Text style={styles.sectionLabel}>Expiry Date</Text>
          <RoundedInputIcon placeholder="MM/YY">
            <View style={styles.rightIconContainer}>
              <View
                style={styles.viewRight}
                onStartShouldSetResponder={clickToShowExpiryInfo}>
                <Image
                  resizeMode="stretch"
                  source={require('../../assets/icons/info.png')}
                  style={{height: '100%', width: '100%'}}
                />
              </View>
            </View>
          </RoundedInputIcon>
          <Text style={styles.sectionLabel}>CVV</Text>
          <RoundedInputIcon placeholder="Enter card CVV">
            <View
              style={styles.rightIconContainer}
              onStartShouldSetResponder={clickToShowCVVInfo}>
              <View style={styles.viewRight}>
                <Image
                  resizeMode="stretch"
                  source={require('../../assets/icons/info.png')}
                  style={{height: '100%', width: '100%'}}
                />
              </View>
            </View>
          </RoundedInputIcon>
          <Text style={styles.sectionLabel}>Name of Card Holder</Text>
          <RoundedInput placeholder="Enter name of card holder" />
          <View style={styles.errorContainer}>
            <Icon
              name="minus-circle"
              color={COLORS.red}
              size={SIZES.iconSize.small}
            />
            <Text style={styles.errorText}>
              Your indicated card is not valid or supported. Please try again
              with a different card.
            </Text>
          </View>
        </View>
      </MainFrame>
      <View style={styles.btnContainer}>
        <RoundedButton text="Save" btnStyle={styles.btnStyle} />
      </View>
      <CVVInfo
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        showModal={openModalCVVInfo}
        closeModal={clickToCloseCVVInfo}
      />
      <ExpiryInfo
        animationIn={'slideInUp'}
        animationOut={'slideOutDown'}
        showModal={openModalExpiryInfo}
        closeModal={clickToCloseExpiryInfo}
      />
    </MainScreen>
  );
};

const styles = StyleSheet.create({
  viewRight: {
    height: windowHeight * 0.025,
    width: windowHeight * 0.025,
  },
  container: {
    padding: SPACING.medium,
  },
  sectionLabel: {
    ...GlobalStyle.sectionLabel,
    color: COLORS.darkGreen,
    marginTop: SPACING.x_small,
  },
  inputStyle: {
    marginLeft: SPACING.x_small,
  },
  rightIconContainer: {
    paddingRight: SPACING.small,
  },
  btnContainer: {
    paddingHorizontal: SPACING.small,
    marginBottom: SPACING.small,
  },
  errorContainer: {
    flexDirection: 'row',
    padding: SPACING.small,
    backgroundColor: COLORS.subTextColor,
    borderRadius: BORDER.roundedCornerInput,
    marginTop: SPACING.medium,
  },
  errorText: {
    flex: 1,
    ...FONTS.regular,
    textAlign: 'justify',
    fontSize: SIZES._12px,
    color: COLORS.subTextColor1,
    marginLeft: SPACING.small,
  },
  btnStyle: {
    borderRadius: BORDER.circle,
  },
});
export default AddCard;
