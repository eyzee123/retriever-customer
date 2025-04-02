import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
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
import LinearGradient from 'react-native-linear-gradient';
import {IMAGES} from '../../constants/Images';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import {formatTimeRange} from '../../utils/HelperFunctions';

const LinearStoreItem = props => {
  const date = new Date();
  const dayNow = moment(date).format('dddd');
  const [storeStatus, setStoreStatus] = useState(null);

  useEffect(() => {
    storeSchedule();
  }, []);

  const storeSchedule = () => {
    props.schedule.map(item => {
      if (item.id == dayNow && !item.closedAllday) {
        setStoreStatus(formatTimeRange(item.specificTime).slice(0, 7));
      }
      if (item.id == dayNow && item.closedAllday) {
        setStoreStatus('Closed Today');
      }
    });
  };

  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles(props).contentContainer, props.contentContainer]}>
      <View style={styles(props).container}>
        <FastImage
          imageStyle={{borderRadius: 6}}
          source={props.storeImage}
          style={styles(props).image}>
          <View style={styles(props).coverWrapper}>
            <LinearGradient
              colors={COLORS.gradientColorBlack}
              style={styles(props).gradientStyle}
            />
            {props.promo && (
              <View style={styles(props).topRightContainer}>
                <View style={styles(props).promoContainer}>
                  <Text style={styles(props).promo}>₱200 off: FP200</Text>
                </View>
              </View>
            )}
            {props.status === 'close' || props.status === 'closed' ? (
              <View style={styles(props).centerContainer}>
                <Text style={styles(props).statusClose}>
                  {storeStatus == 'Closed Today'
                    ? 'Closed Today'
                    : `Store opens at ${storeStatus}`}
                </Text>
              </View>
            ) : null}
            <View style={styles(props).bottomLeftContainer}>
              <>
                {props.distance && (
                  <>
                    <Image
                      source={IMAGES.DISTANCE_1}
                      style={styles(props).icon}
                    />
                    <Text style={styles(props).tagTextStyle}>
                      {props.distance + ' km • '}
                    </Text>
                  </>
                )}
                <Image source={IMAGES.PREPARE} style={styles(props).icon} />
                <Text style={styles(props).tagTextStyle}>
                  {props.prepare_time} min
                </Text>
              </>
            </View>
          </View>
        </FastImage>
      </View>
      <View style={[styles(props).rowContainer, {marginTop: SPACING.x_small}]}>
        <View style={{flex: 1}}>
          <Text style={styles(props).storeName}>{props.storeName}</Text>
          <Text style={styles(props).storeAddress} numberOfLines={1}>
            {props.storeAddress}
          </Text>
        </View>
        <View style={styles(props).viewRight}>
          <View
            style={[
              styles(props).rowContainer,
              {marginTop: windowWidth * 0.009},
            ]}>
            <Icon name="star" size={windowHeight * 0.017} color={COLORS.gold} />
            <Text style={styles(props).ratingText}>{props.rate}</Text>
          </View>
          <Text style={styles(props).status}>
            {props.status == 'open' ? 'Now Open' : 'Closed'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
const styles = props =>
  StyleSheet.create({
    contentContainer: {
      marginHorizontal: SPACING.default,
      backgroundColor: COLORS.white,
      padding: SPACING.small,
      marginTop: SPACING.small,
      borderRadius: BORDER.roundedCornerBox,
    },
    container: {
      height: windowHeight * 0.2,
    },
    coverWrapper: {
      flex: 1,
      backgroundColor:
        props.status == 'close' || props.status == 'closed'
          ? 'rgba(0, 0, 0, 0.5)'
          : null,
    },
    image: {
      height: '100%',
      width: '100%',
      borderRadius: 6,
    },
    topRightContainer: {
      position: 'absolute',
      top: windowWidth * 0.02,
      right: windowWidth * 0.03,
    },
    centerContainer: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    statusClose: {
      ...FONTS.bold,
      color: COLORS.white,
      fontSize: SIZES._16px,
    },
    bottomLeftContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      position: 'absolute',
      bottom: windowWidth * 0.03,
      left: windowWidth * 0.03,
      paddingVertical: windowHeight * 0.0045,
      paddingHorizontal: SPACING.small,
      backgroundColor: COLORS.grayEC80,
      borderRadius: BORDER.roundedCornerCard,
    },
    tagTextStyle: {
      ...GlobalStyle.tagText,
      fontSize: SIZES._12px,
      marginTop:
        Platform.OS === 'ios' ? windowHeight * 0.001 : -windowHeight * 0.0025,
    },
    promoContainer: {
      flexDirection: 'row',
      alignSelf: 'flex-end',
      alignItems: 'center',
      paddingHorizontal: windowHeight * 0.013,
      paddingVertical: windowHeight * 0.0045,
      backgroundColor: COLORS.orange,
      borderRadius: BORDER.roundedCornerCard,
      marginTop: SPACING.x_small,
    },
    promo: {
      ...FONTS.bold,
      fontSize: SIZES._12px,
      color: COLORS.white,
    },
    icon: {
      height: windowHeight * 0.015,
      width: windowHeight * 0.015,
      marginRight: SPACING.x_small,
    },
    gradientStyle: {
      height: '100%',
      width: '100%',
      borderRadius: 6,
      zIndex: Platform.OS === 'ios' ? -1 : 0,
    },
    storeNameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      position: 'absolute',
      bottom: windowHeight * 0.01,
      paddingHorizontal: SIZES.x_small,
    },
    storeName: {
      ...FONTS.bold,
      flex: 1,
    },
    storeAddress: {
      ...FONTS.regular,
      fontSize: SIZES._12px,
      color: COLORS.subTextColor2,
    },
    ratingText: {
      ...FONTS.bold,
      color: COLORS.gold,
      fontSize: SIZES._12px,
      marginLeft: windowHeight * 0.005,
      marginTop: -windowWidth * 0.006,
    },
    status: {
      ...FONTS.bold,
      fontSize: SIZES._12px,
      marginTop: windowWidth * 0.006,
      color: props.status == 'open' ? COLORS.limeGreen : COLORS.red2,
    },
    viewRight: {
      alignItems: 'flex-end',
      marginLeft: SPACING.large,
    },
    rowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });
export default LinearStoreItem;
