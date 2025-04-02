import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import SearchInput from '../../components/cores/SearchInput';
import AddressHeader from '../../components/headers/AddressHeader';
import ListStore from '../../components/listItem/ListStore';
import {
  BORDER,
  COLORS,
  FONTS,
  GlobalStyle,
  SIZES,
  SPACING,
} from '../../styles/theme';
import {windowHeight} from '../../utils/Dimensions';
import SavedLocations from '../../components/modals/SavedLocations';
import {ROUTES} from '../../constants/Routes';
import ListStories from '../../components/listItem/ListStories';
import {StoreContext} from '../../provider/StoreProvider';
import FloatingCart from '../../components/floating/FloatingCart';
import {
  LOCAL_STORAGE,
  LOCATION,
  instructionsFoodList,
} from '../../constants/ProjectConstants';
import {
  clearLocalData,
  getLocalDataObject,
  updateShowInstructions,
} from '../../services/Storage/LocalStorageService';
import {UserContext} from '../../provider/UserProvider';
import ListRecommend from '../../components/listItem/ListRecommend';
import {DynamicContentContext} from '../../provider/DynamicContentProvider';
import {BackHandler} from 'react-native';
import ListFoodBanner from '../../components/listItem/ListFoodBanner';
import InstructionsFoodHome from '../../components/modals/InstructionsFoodHome';
import {LocationContext} from '../../provider/LocationProvider';
import SuccessDialogue from '../../components/modals/SuccessDialogue';
import firestore from '@react-native-firebase/firestore';
import {COLLECTION} from '../../constants/Collections';
import auth from '@react-native-firebase/auth';
import CategoryProfile from '../../components/listItem/CategoryProfile';
import {getSpecificDistance} from '../../utils/HelperFunctions';
import {AddressContext} from '../../provider/AddressProvider';
import NetInfo from '@react-native-community/netinfo';
import RNExitApp from 'react-native-exit-app';

const Food = ({navigation}) => {
  const storeContext = useContext(StoreContext);
  const dynamicContext = useContext(DynamicContentContext);
  const locationContext = useContext(LocationContext);
  const userCtx = useContext(UserContext);
  const addressContext = useContext(AddressContext);
  const {primaryAddress} = addressContext;

  const [openModalAddress, setOpenModalAddress] = useState(false);
  const [iconName, setIconName] = useState('menu-down');
  const [iconTypeName, setIconTypeName] = useState(['menu-down', 'menu-up']);
  const [show, setShow] = useState(false);
  const [showModalInstructionsFood, setShowModalInstructionsFood] =
    useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [loop, setLoop] = useState(true);
  const [showModalSuccessEmail, setModalSuccessEmail] = useState(false);
  const [showModalNoInternet, setModalNoInternet] = useState(false);

  const loopHandler = status => {
    setLoop(status);
  };

  function handleBackButtonClick() {
    return;
  }

  useEffect(() => {
    const appOpened = async () => {
      const appOpen = await getLocalDataObject(LOCAL_STORAGE.APP_OPENED);

      if (appOpen != null) {
        userCtx.setModalInstructionsFood(appOpen.instructionsFood);
      }
    };

    appOpened();
  }, []);

  useEffect(() => {
    // storeContext.getStoreList();
    // dynamicContext.getBannerFood();
    console.log('tested this');
    setOpenModalAddress(false);
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, []);

  const clickToShowSavedAddress = async () => {
    if (iconName == iconTypeName[0]) {
      setIconName(iconTypeName[1]);
    } else {
      setIconName(iconTypeName[0]);
    }
    setShow(!show);
    setOpenModalAddress(!openModalAddress);
  };

  const clickToClose = async () => {
    if (iconName == iconTypeName[1]) {
      setIconName(iconTypeName[0]);
    }
    setShow(false);
    setOpenModalAddress(false);
  };

  const goToSearchProduct = () => {
    navigation.navigate('SearchProduct');
  };

  const searchChangeHandler = text => {
    storeContext.searchStores(text);
  };

  const onConfirmInstructions = () => {
    updateShowInstructions(
      LOCAL_STORAGE.APP_OPENED,
      showInstructions,
      null,
      null,
    );
    setShowModalInstructionsFood(false);
  };

  const signOut = () => {
    userCtx.setCurrentUser(null);
    userCtx.dispatchUser({
      type: 'AUTH',
      payload: {user: null, isLoggedIn: false},
    });
    setModalSuccessEmail(false);
    clearLocalData(LOCAL_STORAGE.USER);
    console.log('logout success');
    navigation.navigate(ROUTES.LOGIN);
    userCtx.setIsAccountDeleted(false);
  };

  const exitApp = () => {
    Platform.OS === 'ios' ? RNExitApp.exitApp() : BackHandler.exitApp();
  };

  const methods = async response => {
    try {
      await auth().currentUser.reload();
    } catch (error) {
      const localUser = await getLocalDataObject(LOCAL_STORAGE.USER);
      if (localUser) {
        if (!response.success) {
          if (Platform.OS === 'android') {
            NetInfo.fetch().then(isConnected => {
              if (isConnected.isConnected) {
                setModalSuccessEmail(true);
              }
              if (!isConnected.isConnected) {
                setModalNoInternet(true);
              }
            });
          } else {
            // For iOS devices
            NetInfo.addEventListener(isConnected => {
              if (isConnected.isConnected) {
                setModalSuccessEmail(true);
              }
              if (!isConnected.isConnected) {
                setModalNoInternet(true);
              }
            });
          }
        }
      }
      console.log(error);
    }
  };

  useEffect(() => {
    userCtx.getUsersRequest().then(res => {
      methods(res);
    });
  }, []);

  const origin = {
    latitude: primaryAddress.coordinates?.latitude,
    longitude: primaryAddress.coordinates?.longitude,
  };

  let storesCategoryFinal = [];

  const storesType = storeContext?.storeList
    ?.filter(item =>
      origin.latitude !== undefined && origin.longitude !== undefined
        ? getSpecificDistance(origin, {
            latitude: item.latitude,
            longitude: item.longitude,
          }) <= 4
        : null,
    )
    .map(item => item.type);

  if (storesType) {
    let storesCategory = [...storesType];
    let storeCategories = [...new Set(storesCategory)];
    storeCategories.map(item =>
      storesCategoryFinal.push({id: item, name: item}),
    );
  }

  const selectCategory = item => {
    navigation.navigate(ROUTES.LOCAL_BESTS, {
      storeCategory: {
        title: item.name,
        categoryName: item.name,
      },
    });
  };

  return (
    <MainScreen containerStyle={styles.container}>
      <AddressHeader
        locationPermission={locationContext.locationPermission}
        icon={iconName}
        onPress={clickToShowSavedAddress}
        onBackPress={ROUTES.HOME}
        leftBack>
        {!show &&
          locationContext.locationPermission ===
            LOCATION.GRANTED_PERMISSION && (
            <>
              <View style={styles.searchContainer}>
                <SearchInput
                  icon="magnify"
                  onFocus={goToSearchProduct}
                  placeholder="Search for food stores here ..."
                  onChangeText={searchChangeHandler}
                  searchInputContainerStyle={styles.searchInputContainerStyle}
                  inputStyles={{...FONTS.regular}}
                />
              </View>
              {storeContext.storiesList.length > 0 && (
                <ListStories
                  data={storeContext.storiesList}
                  onStoryOpen={loopHandler}
                />
              )}
            </>
          )}
      </AddressHeader>

      <MainFrame fullscreen>
        <SuccessDialogue
          noBackdropPress
          showModal={userCtx.isAccountDeleted}
          title="Account Deleted ✅"
          body={
            'Your account is now deleted. Your app will automatically log out after confirming this message.'
          }
          confirmButtonText="Okay"
          onConfirm={signOut}
        />

        <SuccessDialogue
          noBackdropPress
          showModal={showModalSuccessEmail}
          title="Email Successfully Updated 👌"
          body={
            'Your email is now updated. Login your new email after this text.'
          }
          confirmButtonText="Login now"
          onConfirm={signOut}
        />

        <SuccessDialogue
          noBackdropPress
          showModal={showModalNoInternet}
          title="No Internet Connection 📶"
          body={
            'Please check your connection and try again. App will automatically load with good connection.'
          }
          confirmButtonText="Exit Application"
          onConfirm={exitApp}
        />

        {/* {userCtx.showModalInstructionsFood && (
          <InstructionsFoodHome
            showModal={showModalInstructionsFood}
            instructions={instructionsFoodList}
            dataLength={4}
            additionalDataLength={5}
            onSelect={e => setShowInstructions(e ? false : true)}
            onConfirm={onConfirmInstructions}
            closeModal={() => setShowModalInstructionsFood(false)}
          />
        )} */}

        <FlatList
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
              {dynamicContext.bannerFoodList && (
                <View style={styles.carouselSection}>
                  <ListFoodBanner loop={loop} autoplay={loop} />
                </View>
              )}

              <View style={styles.promoDealsContainer}>
                <Text style={styles.sectionLabel}>Categories</Text>
                <CategoryProfile
                  data={storesCategoryFinal}
                  selectCategory={selectCategory}
                />
              </View>

              {storeContext.storeList?.length > 0 && (
                <View style={styles.categoryStoreListContainer}>
                  <Text style={styles.sectionLabel}>Promo Deals</Text>
                  <ListRecommend navigation={navigation} />
                </View>
              )}

              <View style={styles.localRestaurantContainer}>
                <View style={styles.rowContainer}>
                  <Text style={styles.sectionLabel}>Local Bests</Text>
                  <TouchableOpacity
                    style={styles.showAllContainer}
                    onPress={() =>
                      navigation.navigate(ROUTES.LOCAL_BESTS, {
                        storeCategory: {
                          title: 'Local Bests',
                        },
                      })
                    }>
                    <Text style={styles.sectionLabel1}>Show All</Text>
                  </TouchableOpacity>
                </View>
                <ListStore
                  navigation={navigation}
                  localBests={5}
                  storeSection={styles.storeSection}
                />
              </View>

              <View style={styles.topRestaurantContainer}>
                <View style={styles.rowContainer}>
                  <Text style={styles.sectionLabel}>Top Restaurants</Text>
                  <TouchableOpacity
                    style={styles.showAllContainer}
                    onPress={() =>
                      navigation.navigate(ROUTES.LOCAL_BESTS, {
                        storeCategory: {
                          title: 'Top Restaurants',
                        },
                      })
                    }>
                    <Text style={styles.sectionLabel1}>Show All</Text>
                  </TouchableOpacity>
                </View>
                <ListStore navigation={navigation} topRestaurants={5} />
              </View>
            </View>
          }
        />
        <SavedLocations
          navigateTo={ROUTES.FOOD}
          animationIn={'slideInDown'}
          animationOut={'slideOutUp'}
          showModal={openModalAddress}
          closeModal={clickToClose}
          marginTop={'0%'}
        />
      </MainFrame>
      {userCtx.isLoggedIn && <FloatingCart />}
    </MainScreen>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.whiteFA,
  },
  searchContainer: {
    marginHorizontal: SPACING.medium,
    marginBottom: SPACING.medium,
  },
  searchInputContainerStyle: {
    backgroundColor: COLORS.whiteFB2,
    borderRadius: BORDER.roundedCornerBox,
  },
  treatsSection: {
    marginTop: SPACING.medium,
  },
  carouselSection: {
    marginTop: SPACING.medium,
    alignItems: 'center',
  },
  promoDealsContainer: {
    marginTop: SPACING.small,
  },
  categoryContainer: {
    backgroundColor: COLORS.whiteFA,
  },
  categoryStoreListContainer: {
    marginTop: SPACING.medium,
  },
  localRestaurantContainer: {
    marginTop: SPACING.large,
  },
  topRestaurantContainer: {
    marginTop: SPACING.large,
    marginBottom: windowHeight * 0.03,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionLabel: {
    ...GlobalStyle.sectionLabel,
    flex: 1,
    fontSize: SIZES._16px,
    color: COLORS.tertiary,
    marginLeft: SPACING.medium,
  },
  showAllContainer: {
    marginRight: SPACING.small,
    paddingHorizontal: SPACING.small,
    paddingVertical: windowHeight * 0.003,
  },
  sectionLabel1: {
    ...FONTS.bold,
    fontSize: SIZES._12px,
    color: COLORS.orange,
  },
  storeSection: {
    paddingBottom: 0,
  },
});
export default Food;
