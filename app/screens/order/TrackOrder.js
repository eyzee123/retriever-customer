import React, {useState, useRef, useEffect, useContext} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import AddressHeader from '../../components/headers/AddressHeader';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import Footer from '../../components/footers/Footer';
import {Linking} from 'react-native';
import {ChatContext} from '../../provider/ChatProvider';
import {COLORS, FONTS, GlobalStyle, SIZES, SPACING} from '../../styles/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import RoundedButton from '../../components/cores/RoundedButton';
import {ROUTES} from '../../constants/Routes';
import {formatDate, addTime} from '../../utils/HelperFunctions';
import UserAvatar from 'react-native-user-avatar';
import {COLLECTION} from '../../constants/Collections';
import firestore from '@react-native-firebase/firestore';
import {IMAGES} from '../../constants/Images';
import {OrderContext} from '../../provider/OrderProvider';
import {LocationContext} from '../../provider/LocationProvider';

const TrackOrder = ({navigation, route}) => {
  const chatContext = useContext(ChatContext);
  const orderContext = useContext(OrderContext);
  const locationContext = useContext(LocationContext);

  const mapView = useRef(null);
  const [initialPosition, setinitialPosition] = useState(null);
  const [riderPosition, setRiderPosition] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0022,
    longitudeDelta: 0.00321,
  });
  const {orderDetails} = route.params;
  const {productDetails} = route.params;

  const riderCollection = firestore().collection(COLLECTION.RIDER_COORDINATES);

  useEffect(() => {
    //listen to document changes
    const subscriber = riderCollection
      .doc(orderDetails.rider.email)
      .onSnapshot(documentSnapshot => {
        let data = documentSnapshot.data();
        //set rider location
        setRiderPosition({
          latitude: data.latitude,
          longitude: data.longitude,
          latitudeDelta: 0.0022,
          longitudeDelta: 0.00321,
        });
      });

    // Stop listening for updates when no longer required
    return () => {
      subscriber();
    };
  }, []);

  useEffect(() => {
    //set initial location from passed param
    setinitialPosition({
      latitude: orderDetails.deliveryCoordinates.latitude,
      longitude: orderDetails.deliveryCoordinates.longitude,
      latitudeDelta: 0.0022,
      longitudeDelta: 0.00321,
    });
  }, []);

  useEffect(() => {
    if (orderContext.orderStatus == 7 || orderContext.orderStatus == 99) {
      navigation.goBack();
    }
  }, [orderContext.orderStatus]);

  const setMapReady = () => {
    //view/fit both markers on screen
    if (mapView.current) {
      mapView.current.fitToCoordinates([riderPosition, initialPosition]);
    }

    // console.log(riderPosition);
  };
  const goToChat = async () => {
    chatContext.setCollection(orderDetails.id).then(data => {
      navigation.navigate(ROUTES.MESSAGE, {
        riderDetails: orderDetails.rider,
      });
    });
  };

  return (
    <MainScreen>
      <AddressHeader
        locationPermission={locationContext.locationPermission}
        deliver_to="Home"
        address="Block 5 Lot 8, Junjun St., Buhangin, Davao City"
        leftBack
        noCart
      />
      <MainFrame fullscreen>
        <MapView
          ref={mapView.current}
          onMapReady={setMapReady}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={initialPosition}>
          <Marker
            draggable={false}
            title="Rider Position"
            coordinate={riderPosition}
            pinColor={COLORS.orange}>
            {/* <Icon name="motorcycle" size={40} color={COLORS.mapMarker} /> */}
            <Image
              source={IMAGES.MOTORCYCLE}
              style={{height: windowHeight * 0.1, width: windowHeight * 0.1}}
            />
          </Marker>
          <Marker
            draggable={false}
            title="You are here"
            coordinate={initialPosition}
            pinColor={COLORS.orange}>
            <Icon name="map-marker" size={40} color={COLORS.mapMarker} />
          </Marker>
        </MapView>
      </MainFrame>
      <Footer footerStyle={styles.footerStyle}>
        <View style={styles.sectionContainer}>
          <View style={styles.sectionWrapper}>
            <Text style={styles.sectionLabel}>Estimated Delivery Time</Text>
            <Text style={styles.sectionLabel}>
              {`${orderDetails.estimatedDeliveryTime || ''} minutes`}
            </Text>
          </View>
          <Text style={styles.sectionSub}>
            Your order is already on the way
          </Text>
        </View>
        <View style={styles.line} />
        {orderDetails.rider != null ? (
          <View style={styles.riderContainer}>
            <UserAvatar
              size={windowHeight * 0.055}
              name={orderDetails.rider.name}
              textColor={COLORS.black}
              bgColor={'#E5E5E6'}
              style={styles.image}
            />
            <View style={styles.viewCenter}>
              <View style={styles.riderNameContainer}>
                <Text style={styles.riderName}>{orderDetails.rider.name}</Text>
                <Icon
                  name="star"
                  size={SIZES.iconSize.small}
                  color="#FF9F1C"
                  style={styles.icon}
                />
                {/* <Text style={styles.rating}>4.9</Text> */}
              </View>
              <View style={styles.riderNameContainer}>
                <Text style={styles.riderUnit}>{orderDetails.rider.unit}</Text>
                {orderDetails.rider.plateNo && (
                  <>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.riderUnit}>
                      {orderDetails.rider.plateNo}
                    </Text>
                  </>
                )}
              </View>
            </View>
            <View style={[styles.btnContainer, {marginRight: SPACING.x_small}]}>
              <RoundedButton
                icon="phone-in-talk"
                iconStyle={styles.iconStyle}
                onPress={() =>
                  Linking.openURL(`tel:${orderDetails.rider.phoneNumber}`)
                }
              />
            </View>
            <View style={styles.btnContainer}>
              <RoundedButton
                icon="message-text"
                iconStyle={styles.iconStyle}
                onPress={() => goToChat()}
              />
            </View>
          </View>
        ) : null}
        <RoundedButton
          text="Order Details"
          onPress={() => navigation.goBack()}
        />
      </Footer>
    </MainScreen>
  );
};

const styles = StyleSheet.create({
  map: {
    height: windowHeight,
    width: windowWidth,
  },
  footerStyle: {
    paddingHorizontal: SPACING.medium,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  sectionContainer: {
    alignItems: 'flex-start',
  },
  sectionWrapper: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  sectionLabel: {
    ...GlobalStyle.sectionLabel,
    color: COLORS.darkGreen,
    marginTop: SPACING.x_small,
  },
  sectionSub: {
    ...GlobalStyle.sectionSubLabel,
    fontWeight: 'bold',
  },
  line: {
    width: '100%',
    borderColor: COLORS.subTextColor1,
    borderWidth: 0.2,
    marginTop: SPACING.large,
    marginBottom: SPACING.medium,
    opacity: 0.3,
  },
  riderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.medium,
  },
  image: {
    borderRadius: 100,
    marginRight: SPACING.x_small,
  },
  viewCenter: {
    flex: 1,
    justifyContent: 'space-around',
    paddingLeft: SPACING.x_small,
  },
  riderNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riderName: {
    ...FONTS.bold,
    color: COLORS.darkGreen,
  },
  icon: {
    paddingLeft: SPACING.x_small,
    paddingRight: windowHeight * 0.002,
  },
  rating: {
    ...FONTS.regular,
    color: COLORS.darkGreen,
  },
  riderUnit: {
    ...FONTS.regular,
    fontSize: SIZES._12px,
    color: COLORS.subTextColor1,
  },
  bullet: {
    color: COLORS.tertiary,
    paddingHorizontal: SPACING.x_small,
  },
  btnContainer: {
    width: windowWidth * 0.115,
  },
  iconStyle: {
    marginRight: 0,
  },
});
export default TrackOrder;
