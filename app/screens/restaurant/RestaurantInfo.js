import React, {useContext, useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import BackHeader from '../../components/headers/BackHeader';
import {
  BORDER,
  COLORS,
  FONTS,
  GlobalStyle,
  SIZES,
  SPACING,
} from '../../styles/theme';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import Ratings from '../../components/general/Ratings';
import ProgressBar from '../../components/general/ProgressBar';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {IMAGES} from '../../constants/Images';
import CartIconHeader from '../../components/headers/CartIconHeader';
import userRatingFormat from '../../hooks/useRatingFormat';
import FastImage from 'react-native-fast-image';
import {
  formatTimeRange,
  getSpecificDistance,
} from '../../utils/HelperFunctions';
import ListSingleStoreStories from '../../components/listItem/ListSingleStoreStories';
import {AddressContext} from '../../provider/AddressProvider';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const RestaurantInfo = ({route, navigation}) => {
  const addressContext = useContext(AddressContext);
  const {primaryAddress} = addressContext;

  const origin = {
    latitude: primaryAddress.coordinates?.latitude,
    longitude: primaryAddress.coordinates?.longitude,
  };

  const {formatRating} = userRatingFormat();

  const [arrRating, setArrRating] = useState([]);
  const {store} = route.params;

  const storePosition = {
    latitude: store.latitude,
    longitude: store.longitude,
    latitudeDelta: 0.0022,
    longitudeDelta: 0.00321,
  };
  const storeCoordinates = {
    latitude: store.latitude,
    longitude: store.longitude,
  };

  const mapView = useRef(null);

  const goBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    let tempArr = [
      {key: 1, value: 0},
      {key: 2, value: 0},
      {key: 3, value: 0},
      {key: 4, value: 0},
      {key: 5, value: 0},
    ];
    store.storeRating.ratings.forEach(element => {
      tempArr[element.rating - 1].value += 1;
    });
    setArrRating(tempArr);
  }, []);

  return (
    <MainScreen>
      <FastImage
        source={{uri: store.storeCoverPhoto}}
        style={styles.storeCoverPhoto}>
        <LinearGradient
          colors={COLORS.gradientColorBlack}
          style={styles.gradientStyle}
        />
        <View style={styles.backHeaderContainer}>
          <BackHeader iconColor={COLORS.white} onBackButtonPressed={goBack}>
            <CartIconHeader />
          </BackHeader>
        </View>
      </FastImage>
      <MainFrame fullscreen>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <View style={styles.storeAvatar}>
              <ListSingleStoreStories store={store} small />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.storeNameText}>{store.storeName}</Text>
              <View style={styles.rowContainer}>
                <Text
                  style={[
                    styles.storeStatus,
                    {
                      color:
                        store.status === 'close' || store.status === 'closed'
                          ? COLORS.red
                          : COLORS.green,
                    },
                  ]}>
                  {store.status === 'close' || store.status === 'closed'
                    ? 'Closed'
                    : 'Open'}
                </Text>
              </View>
            </View>
            <View style={styles.ratingContainer}>
              <Icon
                name="star"
                size={windowHeight * 0.014}
                color={COLORS.white}
              />
              <Text style={styles.ratingText}>
                {store.storeRating.averageRatings}
              </Text>
            </View>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.ratingInfoContainer}>
            <View style={styles.ratingWrapper}>
              <Text style={styles.rateNumber}>
                {store.storeRating.averageRatings}
              </Text>
              <Ratings startingValue={store.storeRating.averageRatings} />
              <Text style={styles.ratingTotal}>
                {formatRating(store.storeRating.totalRatingsCount)} Ratings
              </Text>
            </View>
            <View style={styles.progressContainer}>
              {arrRating
                .map((rating, index) => (
                  <View style={styles.progressWrapper} key={index}>
                    <Text style={styles.progressRate}>{rating.key}</Text>
                    <ProgressBar
                      progress={
                        store.storeRating.totalRatingsCount > 0
                          ? rating.value / store.storeRating.totalRatingsCount
                          : 0
                      }
                    />
                  </View>
                ))
                .reverse()}
            </View>
          </View>

          <View style={styles.openingHrsContainer}>
            <Text style={styles.sectionLabel}>Opening Hours</Text>
            {store.schedule.map((item, index) => (
              <View style={styles.timeContainer} key={index}>
                <Text style={styles.days}>{item.id}</Text>
                <Text style={styles.time}>
                  {item.specificTime === '-'
                    ? 'Closed'
                    : formatTimeRange(item.specificTime)}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.addressContainer}>
            <Text style={styles.sectionLabel}>Address</Text>
            <View style={styles.mapContainer}>
              <MapView
                ref={mapView}
                provider={PROVIDER_GOOGLE}
                initialRegion={storePosition}
                style={styles.map}>
                <Marker coordinate={storeCoordinates}>
                  <Image
                    resizeMode="stretch"
                    source={IMAGES.MAP_MARKER1}
                    style={styles.pinMark}
                  />
                </Marker>
              </MapView>
            </View>
            <Text style={styles.address}>{store.displayAddress}</Text>
            <Text style={styles.address}>
              {origin.latitude == undefined && origin.longitude == undefined
                ? `${store.preparationTime} min`
                : `${store.preparationTime} min • ${getSpecificDistance(
                    origin,
                    {
                      latitude: store.latitude,
                      longitude: store.longitude,
                    },
                  )} km`}
            </Text>
          </View>
        </ScrollView>
      </MainFrame>
    </MainScreen>
  );
};

const styles = StyleSheet.create({
  storeCoverPhoto: {
    height: windowHeight * 0.23,
    marginTop: SPACING.medium,
    borderRadius: BORDER.roundedCornerBox,
    marginHorizontal: SPACING.medium,
  },
  gradientStyle: {
    height: '100%',
    width: '100%',
    borderRadius: 6,
    zIndex: Platform.OS === 'ios' ? -1 : 0,
  },
  backHeaderContainer: {
    position: 'absolute',
    width: '100%',
  },
  viewRight: {
    height: windowHeight * 0.025,
    width: windowHeight * 0.025,
    marginRight: SPACING.x_small,
  },
  container: {
    paddingTop: SPACING.medium,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayF9,
    paddingBottom: SPACING.small,
    marginHorizontal: SPACING.medium,
  },
  storeAvatar: {
    marginRight: SPACING.small,
  },
  storeNameText: {
    ...FONTS.bold,
    fontSize: SIZES._16px,
    color: COLORS.brown332,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeStatus: {
    ...FONTS.bold,
    fontSize: SIZES._14px,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gold,
    borderRadius: BORDER.roundedCornerBox,
    paddingHorizontal: windowWidth * 0.02,
    paddingVertical: windowWidth * 0.01,
    marginLeft: SPACING.small,
  },
  ratingText: {
    ...FONTS.bold,
    fontSize: SIZES._12px,
    color: COLORS.white,
    marginLeft: windowWidth * 0.02,
    marginTop: -windowWidth * 0.004,
  },
  ratingInfoContainer: {
    flexDirection: 'row',
    marginTop: SPACING.medium,
    marginBottom: windowHeight * 0.028,
  },
  ratingWrapper: {
    flex: 1,
    alignItems: 'center',
    marginTop: windowHeight * 0.002,
  },
  rateNumber: {
    ...FONTS.bold,
    fontSize: SIZES._34px,
    color: COLORS.brown332,
  },
  ratingTotal: {
    ...FONTS.regular,
    fontSize: SIZES._14px,
    color: COLORS.orange,
  },
  progressContainer: {
    alignItems: 'flex-end',
    paddingRight: SPACING.x_large,
  },
  progressWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressRate: {
    ...FONTS.bold,
    fontSize: SIZES._12px,
    color: COLORS.brown332,
    paddingRight: SPACING.small,
  },
  openingHrsContainer: {
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.small,
    borderColor: COLORS.grayF9,
    borderWidth: 1,
    marginHorizontal: SPACING.medium,
    borderRadius: BORDER.roundedCornerBox,
  },
  sectionLabel: {
    ...GlobalStyle.sectionLabel,
    fontSize: SIZES._16px,
    color: COLORS.brown332,
  },
  timeContainer: {
    flexDirection: 'row',
    paddingTop: SPACING.small,
  },
  days: {
    ...FONTS.regular,
    flex: 1,
    color: COLORS.brown332,
  },
  time: {
    ...FONTS.regular,
    color: COLORS.brown332,
  },
  addressContainer: {
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.small,
    borderColor: COLORS.grayF9,
    borderWidth: 1,
    marginHorizontal: SPACING.medium,
    borderRadius: BORDER.roundedCornerBox,
    marginTop: SPACING.small,
    marginBottom: SPACING.x_large,
  },
  mapContainer: {
    overflow: 'hidden',
    borderRadius: BORDER.roundedCornerInput,
    marginVertical: SPACING.medium,
  },
  map: {
    alignSelf: 'center',
    height: windowHeight * 0.15,
    width: windowWidth * 0.81,
  },
  address: {
    ...FONTS.regular,
    fontSize: SIZES._14px,
    color: COLORS.brown332,
  },
  pinMark: {
    height: windowHeight * 0.065,
    width: windowHeight * 0.055,
  },
});

export default RestaurantInfo;
