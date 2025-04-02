import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {IMAGES} from '../../constants/Images';
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

const SectionLocation = props => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={props.onPress}
      disabled={props.disabled ? true : false}>
      {props.storeName && (
        <View style={[styles.containerWrapper, {paddingBottom: 0}]}>
          <View style={[styles.viewLeft, styles.viewLeft1, props.imageStyle]}>
            <Image
              resizeMode="cover"
              source={IMAGES.STORE}
              style={styles.storeImage}
            />
          </View>
          <View style={styles.viewCenter}>
            <Text style={styles.sectionHeader}>{props.storeName}</Text>
            <Text style={styles.sectionSub} numberOfLines={1}>
              {props.displayAddress}
            </Text>
          </View>
        </View>
      )}
      <View style={styles.dashedLine} />

      <View style={styles.containerWrapper}>
        <View style={[styles.viewLeft, props.imageStyle]}>
          <Image
            resizeMode="cover"
            source={require('../../assets/icons/map-marker.png')}
            style={{height: '100%', width: '100%'}}
          />
        </View>
        <View style={styles.viewCenter}>
          <Text style={styles.sectionHeader}>{props.deliver_to}</Text>
          <Text style={styles.sectionSub} numberOfLines={1}>
            {props.address}
          </Text>
        </View>
        <View style={styles.viewRight}>
          <Text style={styles.distance}>{props.distance}</Text>
          {props.chevron ? (
            <Icon
              name="chevron-right"
              color={COLORS.darkGreen}
              size={SIZES.iconSize.medium}
            />
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER.roundedCornerInput,
    borderColor: COLORS.subTextColor,
    borderWidth: 1,
  },
  containerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.small,
  },
  viewLeft: {
    height: windowHeight * 0.028,
    width: windowHeight * 0.02,
    marginLeft: windowHeight * 0.004,
    marginRight: windowHeight * 0.0095,
  },
  viewLeft1: {
    height: windowHeight * 0.0265,
    width: windowHeight * 0.0265,
    marginLeft: -windowWidth * 0.005,
  },
  storeImage: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    marginLeft: windowWidth * 0.005,
  },
  viewCenter: {
    flex: 1,
    paddingLeft: SPACING.x_small,
  },
  viewRight: {
    flexDirection: 'row',
    marginLeft: SPACING.medium,
  },
  sectionHeader: {
    ...GlobalStyle.sectionLabel,
    fontSize: SIZES._14px,
    color: COLORS.darkGreen,
  },
  sectionSub: {
    ...GlobalStyle.sectionSubLabel,
    color: COLORS.tertiary,
  },
  dashedLine: {
    borderWidth: 1,
    borderColor: '#E5E5E6',
    borderStyle: 'dashed',
    width: 1,
    height: windowHeight * 0.037,
    position: 'absolute',
    top: '35%',
    left: '6%',
  },
  distance: {
    ...FONTS.regular,
    alignSelf: 'flex-start',
    color: COLORS.darkGreen,
    fontSize: SIZES._12px,
    marginTop: windowHeight * 0.0028,
  },
});

export default SectionLocation;
