import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {
  BORDER,
  COLORS,
  FONTS,
  GlobalStyle,
  SIZES,
  SPACING,
} from '../../styles/theme';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';
import ImageModal from 'react-native-image-modal';
import {Swipeable} from 'react-native-gesture-handler';
import {formatThousands} from '../../utils/HelperFunctions';
import {IMAGES} from '../../constants/Images';

const OrderItems = props => {
  const [icon, setIcon] = useState('chevron-down');
  const [show, setShow] = useState(
    props.type || props.addons.length != 0 || props.special_instructions
      ? true
      : false,
  );

  const showOrderDesc = () => {
    if (icon === 'chevron-down') {
      setIcon('chevron-up');
      setShow(false);
    } else {
      setIcon('chevron-down');
      setShow(true);
    }
  };

  const renderRight = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-windowHeight * 0.15, windowHeight * 0.15],
      outputRange: [1, 0.1],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles(props).swipeContainer}>
        <TouchableOpacity
          style={styles(props).swipeWrapper}
          // onPress={() => setModalDelete(true)}
        >
          <Animated.View
            style={{transform: [{scale}], marginTop: windowHeight * 0.03}}>
            <Icon
              name="minus"
              size={SIZES.iconSize.medium}
              color={COLORS.darkGreen}
            />
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles(props).swipeWrapper, {backgroundColor: COLORS.orange}]}
          // onPress={() => setModalDelete(true)}
        >
          <Animated.View
            style={{transform: [{scale}], marginTop: windowHeight * 0.03}}>
            <Icon
              name="plus"
              size={SIZES.iconSize.medium}
              color={COLORS.white}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    // <Swipeable renderRightActions={renderRight}>
    <View style={styles(props).container}>
      <View>
        <ImageModal
          source={props.image != '' ? {uri: props.image} : IMAGES.NO_IMAGE}
          modalImageResizeMode="contain"
          style={[styles(props).orderImageStyle, props.imageStyle]}
        />
        <View style={styles(props).badgeContainer}>
          <Text style={styles(props).badgeNo}>{props.quantity}</Text>
        </View>
      </View>

      <View style={styles(props).orderDetailsContainer}>
        <Text style={styles(props).txtOrderName}>{props.name}</Text>
        {props.type || props.addons.length != 0 ? (
          <View
            style={styles(props).showMore}
            onStartShouldSetResponder={showOrderDesc}>
            <Text style={styles(props).sectionSubLabel}>Show more </Text>
            <Icon
              name={icon}
              size={SIZES.iconSize.x_small}
              color={COLORS.subTextColor1}
            />
          </View>
        ) : null}
        {show && (
          <>
            {props.type && (
              <Text style={[styles(props).variant]}>{props.type}</Text>
            )}
            {props.addons.length != 0 && (
              <View style={styles(props).addonsContainer}>
                <Text style={styles(props).txtSubText}>{props.addons}</Text>
              </View>
            )}
            {props.special_instructions && (
              <>
                <Text
                  style={[
                    styles(props).txtSubText,
                    styles(props).instructionText,
                  ]}>
                  Special Instructions
                </Text>
                <Text style={[styles(props).txtSubText, {paddingVertical: 0}]}>
                  {props.special_instructions}
                </Text>
              </>
            )}
          </>
        )}
      </View>

      <View style={styles(props).viewRight}>
        <Text style={styles(props).txtAmount}>
          ₱{formatThousands(props.price)}
        </Text>
        {props.edit && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={props.edit}
            style={styles(props).editContainer}>
            <Text style={styles(props).txtEdit}>Edit</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
    // </Swipeable>
  );
};

const styles = props =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingTop: SPACING.medium,
      marginLeft: windowWidth * 0.025,
    },
    orderImageStyle: {
      height: windowHeight * 0.085,
      width: windowHeight * 0.085,
      borderRadius: BORDER.roundedCornerInput,
      marginRight: SPACING.small,
    },
    badgeContainer: {
      position: 'absolute',
      top: -windowHeight * 0.011,
      right: windowWidth * 0.005,
      borderRadius: BORDER.circle,
      backgroundColor: COLORS.orange,
    },
    badgeNo: {
      ...FONTS.bold,
      paddingVertical: windowHeight * 0.0004,
      paddingHorizontal: windowHeight * 0.009,
      fontSize: SIZES._16px,
      color: COLORS.white,
    },
    orderDetailsContainer: {
      flex: 1,
      marginLeft: SPACING.small,
    },
    txtOrderName: {
      ...FONTS.bold,
      fontSize: SIZES._12px,
      color: COLORS.tertiary,
    },
    showMore: {
      flexDirection: 'row',
      marginTop: windowHeight * 0.002,
      alignItems: 'center',
      width: windowWidth * 0.27,
    },
    sectionSubLabel: {
      ...GlobalStyle.sectionSubLabel,
      fontSize: SIZES._12px,
      color: COLORS.subTextColor1,
    },
    txtSubText: {
      ...FONTS.regular,
      fontSize: SIZES._12px,
      color: COLORS.grayText,
      paddingVertical: windowHeight * 0.003,
    },
    instructionText: {
      marginTop: SPACING.small,
      color: COLORS.orange,
      paddingVertical: 0,
    },
    viewRight: {
      paddingLeft: SPACING.x_large,
    },
    txtAmount: {
      ...FONTS.bold,
      fontSize: SIZES._12px,
      color: COLORS.tertiary,
      textAlign: 'right',
    },
    editContainer: {
      paddingLeft: SPACING.small,
      paddingBottom: SPACING.x_small,
      borderRadius: BORDER.circle,
      alignItems: 'flex-end',
    },
    txtEdit: {
      ...FONTS.regular,
      fontSize: SIZES._12px,
      color: COLORS.orange,
      textDecorationLine: 'underline',
    },
    swipeContainer: {
      flexDirection: 'row',
      marginTop: SPACING.small,
      marginRight: windowWidth * 0.025,
    },
    swipeWrapper: {
      width: windowWidth * 0.15,
      height: windowHeight * 0.1,
      alignItems: 'center',
      backgroundColor: COLORS.subTextColor,
    },
    variant: {
      ...FONTS.bold,
      fontSize: SIZES._12px,
      color: COLORS.subTextColor1,
      marginTop: SPACING.small,
    },
    addonsContainer: {
      marginTop: -windowHeight * 0.01,
    },
  });

export default OrderItems;
