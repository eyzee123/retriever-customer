import React, {useState, useEffect, useContext, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import BackHeader from '../../components/headers/BackHeader';
import {BORDER, COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import ListFood from '../../components/listItem/ListFood';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ROUTES} from '../../constants/Routes';
import {StoreContext} from '../../provider/StoreProvider';
import CartIconHeader from '../../components/headers/CartIconHeader';
import FastImage from 'react-native-fast-image';
import ListSingleStoreStories from '../../components/listItem/ListSingleStoreStories';
import Footer from '../../components/footers/Footer';
import RoundedButton from '../../components/cores/RoundedButton';
import {CartContext} from '../../provider/CartProvider';
import {
  formatThousands,
  getSpecificDistance,
} from '../../utils/HelperFunctions';
import {AddressContext} from '../../provider/AddressProvider';
import CustomDropdown from '../../components/general/CustomDropdown';
import {IMAGES} from '../../constants/Images';
import PromoItem from '../../components/listItem/PromoItem';
import LinearGradient from 'react-native-linear-gradient';
import CategoryProfile from '../../components/listItem/CategoryProfile';

const RestaurantProfile = ({route, navigation}) => {
  const storeContext = useContext(StoreContext);
  const cartContext = useContext(CartContext);
  const addressContext = useContext(AddressContext);
  const {primaryAddress} = addressContext;

  //to change category deliveryType
  const [value, setValue] = useState('1');

  const origin = {
    latitude: primaryAddress.coordinates?.latitude,
    longitude: primaryAddress.coordinates?.longitude,
  };

  const deliveryType = [
    {
      label: 'Deliver now',
      value: '1',
    },
    // {
    //   label: 'Filipino',
    //   value: '2',
    // },
  ];

  const selectDeliveryType = item => {
    setValue(item.value);
  };

  const {items} = cartContext;

  //passed parameter
  const {store} = route.params;

  let numberofCartitems = 0;
  let totalAmount = 0;
  let storeIDRef = useRef(null);

  items.forEach(item => {
    //get store total amount and cart quantity
    if (item.storeID === store.storeID) {
      storeIDRef.current = item.storeID;
      item.product.forEach(product => {
        numberofCartitems += +product.amount;
      });
    }
  });

  const storeIndex = items.findIndex(data => data.storeID === store.storeID);
  if (storeIndex >= 0) {
    totalAmount = items[storeIndex].totalAmount;
  }

  const goBack = () => {
    navigation.goBack();
  };

  const goToStoreInfo = () => {
    navigation.navigate(ROUTES.RESTAURANT_INFO, {
      store: store,
    });
  };

  const promo = [
    {
      name: '₱200 off: FP200',
    },
    {
      name: '₱100 off for 500 amount code: FP200 on total order',
    },
  ];

  const [refItem, setRefItem] = useState(null);
  const [scrollIndex, setScrollIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState({
    id: '0',
    name: '0',
  });

  let storesFoodCategoryFinal = [];
  let storesCategory = [];

  storeContext.storeList
    ?.filter(item => item.storeID == store.storeID)
    .map(item =>
      item.products.map(products => storesCategory.push(products.productType)),
    );

  let storesFoodCategory = [...storesCategory];
  let storeFoodCategories = [...new Set(storesFoodCategory)];
  storeFoodCategories.map(item =>
    storesFoodCategoryFinal.push({id: item, name: item}),
  );

  const selectCategory = (item, index) => {
    if (item.name == selectedCategory.name) {
      setSelectedCategory({id: '0', name: '0'});
      setScrollIndex(null);
    }
    if (item.name != selectedCategory.name) {
      setSelectedCategory(item);
      setScrollIndex(index);
    }
  };

  return (
    <MainScreen>
      <MainFrame fullscreen>
        <ScrollView
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[2]}
          horizontal={false}
          ref={ref => {
            setRefItem(ref);
          }}>
          <FastImage
            source={{uri: store.storeCoverPhoto}}
            style={styles.storeCoverPhoto}>
            <LinearGradient
              colors={COLORS.gradientColorBlack}
              style={styles.gradientStyle}
            />
            <View style={styles.backHeaderContainer}>
              <BackHeader iconColor={COLORS.white} onBackButtonPressed={goBack}>
                <TouchableOpacity style={styles.heartIcon}>
                  <Icon
                    name="heart-outline"
                    size={windowHeight * 0.03}
                    color={COLORS.white}
                  />
                </TouchableOpacity>
                <CartIconHeader />
              </BackHeader>
            </View>
            <TouchableOpacity onPress={goToStoreInfo} style={styles.storeInfo}>
              <Icon
                style={styles.iconInfo}
                name="information"
                size={windowHeight * 0.027}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </FastImage>
          <View style={styles.container}>
            <View>
              <View style={styles.headerContainer}>
                <View style={styles.storeAvatar}>
                  <ListSingleStoreStories store={store} profile small />
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.storeNameText}>{store.storeName}</Text>
                  <View style={styles.rowContainer}>
                    <Text
                      style={[
                        styles.storeStatus,
                        {
                          color:
                            store.status === 'close' ||
                            store.status === 'closed'
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
                <CustomDropdown
                  icon="menu-down"
                  color={COLORS.orange}
                  data={deliveryType}
                  value={value}
                  onChange={selectDeliveryType}
                  width={'38%'}
                  dropdownStyle={styles.dropdownStyle}
                  selectStyle={styles.selectStyle}
                />
              </View>
              <ScrollView showsHorizontalScrollIndicator={false} horizontal>
                <View style={styles.viewMiddle}>
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
                  <Text style={styles.dot}>•</Text>
                  <Icon
                    name="chef-hat"
                    size={windowHeight * 0.016}
                    color={COLORS.iconSearchColor}
                  />
                  <Text style={styles.preparationTime}>
                    {store.preparationTime} min
                  </Text>
                  <Text style={styles.dot}>•</Text>
                  <Image
                    source={IMAGES.DISTANCE_2}
                    style={styles.iconDistance}
                  />
                  <Text style={styles.preparationTime}>
                    {(origin.latitude != undefined &&
                      origin.longitude != undefined &&
                      getSpecificDistance(origin, {
                        latitude: store.latitude,
                        longitude: store.longitude,
                      })) ||
                      ''}
                    km
                  </Text>
                  <Text style={styles.dot}>•</Text>
                  <Image source={IMAGES.STORE_1} style={styles.iconStore} />
                  <Text style={styles.preparationTime}>{store.type}</Text>
                </View>
              </ScrollView>
              {/* <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal
                style={styles.promoContainer}>
                {promo.map((item, index) => (
                  <View key={index}>
                    <PromoItem
                      promo={item.name}
                      promoLength={promo.length}
                      promoIndex={index}
                    />
                  </View>
                ))}
              </ScrollView> */}
            </View>
          </View>
          <CategoryProfile
            data={storesFoodCategoryFinal.sort((a, b) => b.name < a.name)}
            selectCategory={selectCategory}
            selectedCategory={selectedCategory.name}
            colored
          />
          <ListFood
            refItem={refItem}
            scrollIndex={scrollIndex}
            categoryData={storesFoodCategoryFinal}
            store={store}
            navigation={navigation}
            storeStatus={store.status}
          />
        </ScrollView>
      </MainFrame>
      {numberofCartitems > 0 && storeIDRef.current == store.storeID && (
        <Footer>
          <RoundedButton
            text={`₱${formatThousands(totalAmount)}`}
            onPress={() => navigation.navigate(ROUTES.CART)}
            btnTextContainer={styles.btnTextContainer}>
            <Text
              style={
                styles.btnText
              }>{`Open Cart ( ${numberofCartitems} )`}</Text>
          </RoundedButton>
        </Footer>
      )}
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
  heartIcon: {
    padding: SPACING.x_small,
    borderRadius: BORDER.circle,
    zIndex: 1,
  },
  storeInfo: {
    position: 'absolute',
    bottom: SPACING.small,
    right: 0,
    paddingTop: windowHeight * 0.01,
    paddingBottom: windowHeight * 0.01,
    paddingLeft: windowWidth * 0.04,
    paddingRight: windowWidth * 0.037,
    borderRadius: BORDER.circle,
  },
  iconInfo: {
    transform: [{rotate: '180deg'}],
  },
  container: {
    paddingTop: SPACING.medium,
    paddingBottom: SPACING.large,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayF9,
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
  dropdownStyle: {
    borderColor: COLORS.transparent,
    backgroundColor: COLORS.lightOrange,
    paddingVertical: 0,
    paddingHorizontal: windowWidth * 0.01,
    marginLeft: SPACING.small,
  },
  selectStyle: {
    marginLeft: windowWidth * 0.021,
    fontSize: SIZES._14px,
    color: COLORS.orange,
  },
  viewMiddle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.medium,
    marginTop: SPACING.medium,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gold,
    borderRadius: BORDER.roundedCornerBox,
    paddingHorizontal: windowWidth * 0.02,
    paddingVertical: windowWidth * 0.01,
  },
  ratingText: {
    ...FONTS.bold,
    fontSize: SIZES._12px,
    color: COLORS.white,
    marginLeft: windowWidth * 0.02,
    marginTop: -windowWidth * 0.004,
  },
  dot: {
    fontSize: SIZES._16px,
    color: COLORS.subTextColor1,
    marginHorizontal: SPACING.small,
  },
  preparationTime: {
    ...FONTS.regular,
    fontSize: SIZES._12px,
    color: COLORS.subTextColor1,
    marginLeft: windowWidth * 0.02,
  },
  iconDistance: {
    height: windowHeight * 0.016,
    width: windowHeight * 0.016,
    marginTop: windowWidth * 0.002,
  },
  iconStore: {
    height: windowHeight * 0.015,
    width: windowHeight * 0.015,
    marginTop: windowWidth * 0.007,
  },
  promoContainer: {
    marginTop: SPACING.medium,
  },
  btnTextContainer: {
    justifyContent: 'flex-start',
    marginHorizontal: SPACING.small,
  },
  btnText: {
    ...FONTS.bold,
    flex: 1,
    color: COLORS.white,
  },
  quantityContainer: {},
  quantity: {
    ...FONTS.bold,
    color: COLORS.white,
    marginTop: Platform.OS === 'ios' ? windowHeight * 0.002 : 0,
  },
});
export default RestaurantProfile;
