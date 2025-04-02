import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useContext,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {BORDER, COLORS, GlobalStyle, SIZES, SPACING} from '../../styles/theme';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {
  ScrollView,
  FlatList,
  NativeViewGestureHandler,
} from 'react-native-gesture-handler';
import ServiceItem from '../../components/listItem/ServiceItem';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import AddressHeader from '../../components/headers/AddressHeader';
import {LocationContext} from '../../provider/LocationProvider';
import SavedLocations from '../../components/modals/SavedLocations';
import Labels from '../../constants/Labels';
import {ROUTES} from '../../constants/Routes';
import {
  LOCAL_STORAGE,
  LOCATION,
  instructionsHomeList,
} from '../../constants/ProjectConstants';
import {UserContext} from '../../provider/UserProvider';
import {IMAGES} from '../../constants/Images';
import {
  clearLocalData,
  getLocalDataObject,
  updateShowInstructions,
} from '../../services/Storage/LocalStorageService';
import ConfirmationDialogue from '../../components/modals/ConfirmationDialogue';
import {StoreContext} from '../../provider/StoreProvider';
import {DynamicContentContext} from '../../provider/DynamicContentProvider';
import {BackHandler} from 'react-native';
import InstructionsFoodHome from '../../components/modals/InstructionsFoodHome';
import StoreRecommendMenu from '../../components/listItem/StoreRecommendMenu';
import CategoryProfile from '../../components/listItem/CategoryProfile';
import {AddressContext} from '../../provider/AddressProvider';
import {getSpecificDistance} from '../../utils/HelperFunctions';
import WelcomeToast from '../../components/modals/WelcomeToast';
import {LoadingOverlay} from '../../components/general/LoadingIndicator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Home = ({navigation, route}) => {
  const storeContext = useContext(StoreContext);
  const dynamicContext = useContext(DynamicContentContext);
  const userCtx = useContext(UserContext);
  const locationContext = useContext(LocationContext);
  const addressContext = useContext(AddressContext);
  const {primaryAddress} = addressContext;

  const [openModalLogout, setModalLogout] = useState(false);
  const [openModalAddress, setOpenModalAddress] = useState(false);
  const [iconName, setIconName] = useState('menu-down');
  const [iconTypeName, setIconTypeName] = useState(['menu-down', 'menu-up']);

  const bottomSheetRef = useRef(null);
  const [index, setIndex] = useState(1);
  const snapPoints = useMemo(() => ['29%', '50%', '90%'], []);
  const [showInstructionsHome, setShowInstructionsHome] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);

  const toast = route.params;
  const [showToast, setShowToast] = useState(
    toast != undefined ? toast.toast : true,
  );

  const origin = {
    latitude: primaryAddress.coordinates?.latitude,
    longitude: primaryAddress.coordinates?.longitude,
  };

  useEffect(() => {
    const appOpened = async () => {
      const appOpen = await getLocalDataObject(LOCAL_STORAGE.APP_OPENED);

      if (appOpen != null) {
        userCtx.setModalInstructionsHome(appOpen.instructionsHome);
      }
    };

    appOpened();
  }, []);

  function handleBackButtonClick() {
    return;
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, []);

  useEffect(() => {
    dynamicContext.getBannerHome();
    dynamicContext.getBannerFood();
    storeContext.getStoreList();
  }, []);

  useEffect(() => {
    //authenticate user
    authUser();
  }, [userCtx.isLoggedIn]);

  const authUser = async () => {
    const signedInUser = await getLocalDataObject(LOCAL_STORAGE.USER);

    if (signedInUser) {
      userCtx.setCurrentUser(signedInUser);
      userCtx.setIsLoggedIn(true);
      userCtx.dispatchUser({
        type: 'AUTH',
        payload: {user: signedInUser, isLoggedIn: true},
      });
    } else {
      userCtx.dispatchUser({
        type: 'AUTH',
        payload: {user: null, isLoggedIn: false},
      });
    }
  };

  const handleSheetChange = useCallback(index => {
    setIndex(index);
  }, []);

  const signOut = () => {
    userCtx.signout().then(res => {
      if (!res.success) {
        console.log(res.error);
        return;
      }
      userCtx.setCurrentUser(null);
      userCtx.dispatchUser({
        type: 'AUTH',
        payload: {user: null, isLoggedIn: false},
      });
      clearLocalData(LOCAL_STORAGE.USER);
      console.log('logout success');
    });
    setModalLogout(false);
    setIndex(1);
  };

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={0}
        appearsOnIndex={1}
        pressBehavior={0}
      />
    ),
    [],
  );

  const clickToShowSavedAddress = () => {
    if (iconName == iconTypeName[0]) {
      setIconName(iconTypeName[1]);
    } else {
      setIconName(iconTypeName[0]);
    }
    setOpenModalAddress(!openModalAddress);
  };

  const clickToClose = () => {
    if (iconName == iconTypeName[1]) {
      setIconName(iconTypeName[0]);
    }
    setOpenModalAddress(false);
  };

  const onConfirmInstructions = () => {
    updateShowInstructions(
      LOCAL_STORAGE.APP_OPENED,
      null,
      showInstructions,
      null,
    );
    setShowInstructionsHome(false);
  };

  const services = [
    {
      title: Labels.food,
      image: IMAGES.PLATE,
      navigate: () => navigation.navigate(ROUTES.FOOD),
      disabled: false,
      color: COLORS.orange,
    },
    {
      title: Labels.errands,
      image: IMAGES.CARDBOARD,
      navigate: '',
      disabled: true,
      color: COLORS.gold,
    },
    {
      title: Labels.comingSoon,
      image: IMAGES.GROCERY,
      navigate: '',
      disabled: true,
      color: COLORS.green175,
    },
  ];

  const community = [
    {
      title: 'COMMUNITY 1',
      image: IMAGES.COMMUNITY_1,
      link: '',
    },
    {
      title: 'COMMUNITY 2',
      image: IMAGES.COMMUNITY_2,
      link: '',
    },
    {
      title: 'COMMUNITY 3',
      image: IMAGES.COMMUNITY_3,
      link: 'https://www.youtube.com/playlist?list=PLuR7wbYz2bJ0g_UMtYrMQXcU_QaFepVzE',
    },
    {
      title: 'COMMUNITY 4',
      image: IMAGES.COMMUNITY_4,
      link: 'https://www.facebook.com/retriever.ph',
    },
  ];

  const navigationLinks = [
    {
      name: userCtx.isLoggedIn ? Labels.myProfile : Labels.login,
      navigate: userCtx.isLoggedIn ? ROUTES.PROFILE : ROUTES.LOGIN,
    },
    {
      name: Labels.history,
      navigate: ROUTES.HISTORY,
    },
    {
      name: Labels.settings,
      navigate: ROUTES.SETTINGS,
    },
    {
      name: Labels.support,
      navigate: ROUTES.ABOUT,
    },
  ];

  let topStoreProduct = [];

  storeContext.storeList
    ?.filter(item =>
      item.status == 'open' &&
      origin.latitude !== undefined &&
      origin.longitude !== undefined
        ? getSpecificDistance(origin, {
            latitude: item.latitude,
            longitude: item.longitude,
          }) <= 4
        : null,
    )
    ?.map(item =>
      item.products
        .filter(product => product.soldQTY > 0 && product.status == true)
        .sort((a, b) => b.soldQTY > a.soldQTY)
        .map((product, index) => {
          if (index < 1) {
            topStoreProduct.push({...item, topSellable: product});
          }
        }),
    );

  return (
    <MainScreen>
      <LoadingOverlay
        visible={storeContext.isLoading}
        textContent="LOADING..."
      />
      <AddressHeader
        locationPermission={locationContext.locationPermission}
        deliver_to="Home"
        address="Block 5 Lot 8, Junjun St., Buhangin, Davao City"
        icon={iconName}
        onPress={clickToShowSavedAddress}
      />
      <ConfirmationDialogue
        title="Logging out? 🙁"
        body="Feel free to come back again soon. We are always ready to serve you."
        onCancelButtonText="Cancel"
        confirmButtonText="Logout"
        showModal={openModalLogout}
        onConfirm={signOut}
        onCancel={() => setModalLogout(false)}
        logout
      />

      <MainFrame fullscreen>
        <WelcomeToast
          showModal={showToast}
          onPress={() => {
            setShowToast(false);
            navigation.navigate(ROUTES.FOOD);
          }}
          closeModal={() => setShowToast(false)}
        />
        {/* userCtx.showModalInstructionsHome && (
          <InstructionsFoodHome
            showModal={showInstructionsHome}
            instructions={instructionsHomeList}
            dataLength={2}
            additionalDataLength={3}
            onSelect={e => setShowInstructions(e ? false : true)}
            onConfirm={onConfirmInstructions}
            closeModal={() => setShowInstructionsHome(false)}
          />
        ) */}

        {locationContext.isLoading ? null : (
          <MapView
            ref={locationContext.mapView}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={locationContext.initialPosition}>
            <Marker coordinate={locationContext.selectedPosition}>
              <Image
                resizeMode="stretch"
                source={IMAGES.MAP_MARKER1}
                style={styles.mapMarker}
              />
            </Marker>
          </MapView>
        )}
        <SavedLocations
          navigateTo={ROUTES.HOME}
          animationIn={'slideInDown'}
          animationOut={'slideOutUp'}
          showModal={openModalAddress}
          mapRef={locationContext.mapView}
          closeModal={clickToClose}
          marginTop={'0%'}
        />
      </MainFrame>

      <BottomSheet
        ref={bottomSheetRef}
        index={index}
        backdropComponent={renderBackdrop}
        enableHandlePanningGesture={true}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
        handleStyle={styles.handleStyle}>
        <NativeViewGestureHandler>
          <View style={styles.bottomSheetContainer}>
            <FlatList
              showsVerticalScrollIndicator={false}
              scrollEnabled={index == 2 ? true : false}
              ListHeaderComponent={
                <View style={styles.bottomSheetScrollContainer}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.servicesSection}>
                      {services.map((item, index) => (
                        <View key={index}>
                          <ServiceItem
                            serviceTitle={item.title}
                            serviceImage={item.image}
                            color={item.color}
                            onPress={
                              item.navigate == '' ? () => null : item.navigate
                            }
                            disabled={item.disabled}
                            servicesLength={services.length}
                            index={index}
                          />
                        </View>
                      ))}
                    </View>
                  </ScrollView>

                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.navigationSection}>
                      <CategoryProfile
                        data={navigationLinks}
                        isLoggedIn={userCtx.isLoggedIn}
                        btnStyle={styles.btnStyle}
                      />
                    </View>
                  </ScrollView>

                  <View style={styles.recoContainer}>
                    {topStoreProduct.length > 0 && (
                      <View style={{marginTop: SPACING.large}}>
                        <Text style={styles.sectionTitle}>
                          Best Selling Foods
                        </Text>
                        <View style={styles.recoWrapper}>
                          <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={topStoreProduct}
                            renderItem={({item, index}) => (
                              <StoreRecommendMenu
                                image={item.topSellable.productPicture}
                                store={item.storeName}
                                menu={item.topSellable.productName}
                                rate={item.storeRating.averageRatings || 'TBD'}
                                index={index}
                                recommendMenuLength={topStoreProduct.length}
                                onPress={() =>
                                  navigation.navigate(ROUTES.ADD_TO_CART, {
                                    store: item,
                                    product: item.topSellable,
                                  })
                                }
                              />
                            )}
                          />
                        </View>
                      </View>
                    )}

                    {dynamicContext.bannerHomeList && (
                      <View style={styles.addsSection}>
                        <Image
                          source={{
                            uri: dynamicContext.bannerHomeList?.adsImage,
                          }}
                          style={styles.adsStyle}
                        />
                      </View>
                    )}

                    <View style={styles.recipesSection}>
                      <Text
                        style={[
                          styles.sectionTitle,
                          {marginBottom: SPACING.small},
                        ]}>
                        Apil na sa Retriever!
                      </Text>
                      <FlatList
                        data={community}
                        horizontal={false}
                        numColumns={2}
                        style={styles.communityContainer}
                        renderItem={({item}) => (
                          <TouchableOpacity
                            style={styles.communityWrapper}
                            disabled={item.link ? false : true}
                            onPress={() => Linking.openURL(item.link)}>
                            <Image
                              source={item.image}
                              style={styles.imageCommunity}
                            />
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                  </View>
                </View>
              }
            />
          </View>
        </NativeViewGestureHandler>
      </BottomSheet>
    </MainScreen>
  );
};
const styles = StyleSheet.create({
  map: {
    height: windowHeight,
    width: windowWidth,
  },
  mapMarker: {
    height: windowHeight * 0.055,
    width: windowHeight * 0.045,
  },
  handleStyle: {
    height: windowHeight * 0.04,
    backgroundColor: COLORS.whiteFA,
    borderRadius: 16,
  },
  bottomSheetContainer: {
    flex: 1,
    backgroundColor: COLORS.whiteFA,
  },
  bottomSheetScrollContainer: {
    paddingTop: SPACING.small,
    paddingBottom: SPACING.medium,
  },
  servicesSection: {
    flexDirection: 'row',
  },
  navigationSection: {
    flexDirection: 'row',
    marginTop: SPACING.small,
  },
  btnStyle: {
    paddingTop: windowHeight * 0.007,
    paddingBottom: windowHeight * 0.009,
  },
  recoContainer: {
    marginTop: -SPACING.x_small,
  },
  recoWrapper: {
    flexDirection: 'row',
  },
  addsSection: {
    marginTop: SPACING.large,
    marginHorizontal: SPACING.medium,
  },
  adsStyle: {
    height: windowHeight * 0.2,
    borderRadius: BORDER.roundedCornerBox,
  },
  recipesSection: {
    marginTop: -SPACING.x_small,
    paddingTop: SPACING.large,
    zIndex: -1,
  },
  sectionTitle: {
    ...GlobalStyle.sectionTitle,
    fontSize: SIZES._16px,
    color: COLORS.brown332,
    marginLeft: SPACING.medium,
  },
  communityContainer: {
    marginTop: -windowHeight * 0.012,
    marginHorizontal: SPACING.small,
  },
  communityWrapper: {
    marginHorizontal: windowWidth * 0.0135,
    marginTop: SPACING.small,
    width: '47%',
  },
  imageCommunity: {
    width: '100%',
    height: windowHeight * 0.2,
    borderRadius: BORDER.roundedCornerBox,
  },
});
export default Home;
