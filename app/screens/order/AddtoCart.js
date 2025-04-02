import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import RoundedInput from '../../components/cores/RoundedInput';
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
import Footer from '../../components/footers/Footer';
import RoundedButton from '../../components/cores/RoundedButton';
import {ROUTES} from '../../constants/Routes';
import Header from '../../components/headers/Header';
import {IMAGES} from '../../constants/Images';
import AddOnsItem from '../../components/listItem/AddOnsItem';
import {CartContext} from '../../provider/CartProvider';
import {ProductContext} from '../../provider/ProductProvider';
import {UserContext} from '../../provider/UserProvider';
import ConfirmationDialogue from '../../components/modals/ConfirmationDialogue';
import SetupDialogue from '../../components/modals/SetupDialogue';
import {LoadingOverlay} from '../../components/general/LoadingIndicator';
import {formatThousands} from '../../utils/HelperFunctions';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';

const AddToCart = ({route, navigation}) => {
  const userCtx = useContext(UserContext);
  const productContext = useContext(ProductContext);
  const cartContext = useContext(CartContext);

  const [isLoading, setIsLoading] = useState(false);
  const [openModalCartFull, setModalCartFull] = useState(false);
  const [openModalCartVariant, setModalCartVariant] = useState(false);
  const [openModalDeleteProduct, setModalDeleteProduct] = useState(false);
  const [openModalSetupAcc, setOpenModalSetupAcc] = useState(false);
  const [isShowInfo, setShowInfo] = useState(false);
  const [keyboardAvoidView, setKeyboardAvoidView] = useState(false);

  const {action} = route.params;
  const {store} = route.params;
  const {product} = route.params;

  const [quantity, setQuantity] = useState(
    action === 'edit' ? product.amount : 1,
  );
  const [variant, setSelectedVariant] = useState(
    action === 'edit' ? product.variants : null,
  );

  const [addOn, setSelectedAddon] = useState(
    action === 'edit' ? product.addons : [],
  );
  const [totalPrice, setTotalPrice] = useState(
    action === 'edit' ? product.totalCost : product.productPrice,
  );
  const [instruction, setInstruction] = useState(
    action === 'edit' ? product.specialInstructions : '',
  );

  const goToLogin = async () => {
    setOpenModalSetupAcc(false);
    await navigation.navigate(ROUTES.LOGIN);
  };

  const goToRegister = async () => {
    setOpenModalSetupAcc(false);
    await navigation.navigate(ROUTES.REGISTER);
  };

  useEffect(() => {
    productContext.getProductAddOns(store.id, product.productID);
    productContext.getProductVariant(store.id, product.productID);
    productContext.getIngredients(store.id, product.productID);
  }, [product]);

  useEffect(() => {
    let totalVariant = 0;
    const totalAddons =
      addOn.length > 0
        ? addOn.reduce((accumulator, item) => {
            return accumulator + +item.price;
          }, 0)
        : 0;
    totalVariant = variant ? +variant.price : 0;

    const totalCost =
      (+product.productPrice + totalVariant + totalAddons) * quantity;

    setTotalPrice(totalCost);
  }, [variant, addOn, quantity]);

  const goBack = () => {
    navigation.goBack();
  };

  const addToCartHandler = async () => {
    if (!userCtx.isLoggedIn) {
      setOpenModalSetupAcc(true);
      return;
    }
    if (productContext.variant.length > 0 && !variant) {
      setModalCartVariant(true);
      // alert('Please select atleast 1 variant');
      return;
    }

    setIsLoading(true);
    const products = {
      ...product,
      amount: quantity,
      totalCost: totalPrice,
      variants: variant,
      addons: addOn,
      specialInstructions: instruction,
    };

    const item = {
      ...store,
      product: {...products},
    };
    const res = await cartContext.addItem(item);

    if (res?.limit) {
      setModalCartFull(true);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);

    if (action == 'cartDetails') {
      navigation.navigate(ROUTES.CART);
    } else {
      navigation.goBack();
    }
  };

  const updateCartHandler = async () => {
    setIsLoading(true);
    const products = {
      ...product,
      amount: quantity,
      totalCost: totalPrice,
      variants: variant,
      addons: addOn,
      specialInstructions: instruction,
    };
    const item = {
      ...store,
      product: {...products},
    };
    await cartContext.updateItem(item);
    setIsLoading(false);
    navigation.navigate(ROUTES.CART);
  };

  const deleteCartHandler = async () => {
    const products = {
      ...product,
      amount: quantity,
      totalCost: totalPrice,
      variants: variant,
      addons: addOn,
      specialInstructions: instruction,
    };
    const item = {
      ...store,
      product: {...products},
    };

    await cartContext.removeProduct(item);
    navigation.navigate(ROUTES.CART);
  };

  const addItemHandler = () => {
    setQuantity(quantity + 1);
  };
  const removeItemHandler = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addOnSelectHandler = item => {
    if (!item.selected) {
      setTotalPrice(totalPrice - item.price * quantity);
      const removeItemIndex = addOn.findIndex(data => data.id === item.id);
      addOn.splice(removeItemIndex, 1);
    } else {
      setSelectedAddon(prevState => [...prevState, item]);
    }
  };

  const setVariant = item => {
    setSelectedVariant(item);
  };
  const gotoCart = () => {
    setModalCartFull(false);
    navigation.navigate(ROUTES.CART);
  };

  return (
    <MainScreen>
      <LoadingOverlay visible={isLoading} textContent="LOADING..." />
      <SetupDialogue
        title="Ooops! No Account Logged. 🙊"
        body="There currently is no active account on this device. Let’s get you set up with our quick registration system!"
        onConfirmText="Register"
        onConfirmText1="Log in"
        showModal={openModalSetupAcc}
        closeModal={() => setOpenModalSetupAcc(false)}
        onConfirmButton1={goToLogin}
        onConfirmButton={goToRegister}
      />
      {action === 'edit' && <Header title="Edit Order" />}
      <ConfirmationDialogue
        image={IMAGES.WARNING}
        title="Whoops! Your cart is full.  🛒"
        body="To continue adding, delete some of your orders queued in cart."
        onCancelButtonText="Cancel"
        confirmButtonText="Go to Cart"
        showModal={openModalCartFull}
        onCancel={() => setModalCartFull(false)}
        onConfirm={gotoCart}
      />
      <ConfirmationDialogue
        image={IMAGES.WARNING}
        title="Forgetting something?"
        body="Don’t forget to pick a variant. Please select at least one (1) variant for this product."
        confirmButtonText="Okay"
        showModal={openModalCartVariant}
        onCancel={() => setModalCartVariant(false)}
        onConfirm={() => setModalCartVariant(false)}
        single
      />
      <ConfirmationDialogue
        image={IMAGES.WARNING}
        title="Delete Product"
        body="Are you sure you want to delete this product from your cart?"
        onCancelButtonText="Cancel"
        confirmButtonText="Yes"
        showModal={openModalDeleteProduct}
        onCancel={() => setModalDeleteProduct(false)}
        onConfirm={deleteCartHandler}
      />
      {product.productPicture != '' ? (
        <FastImage
          source={{uri: product.productPicture}}
          style={styles.storeCoverPhoto}>
          <LinearGradient
            colors={COLORS.gradientColorBlack}
            style={styles.gradientStyle}
          />
          {action !== 'edit' && (
            <View style={styles.backHeaderContainer}>
              <BackHeader
                iconColor={
                  product.productPicture != '' ? COLORS.white : COLORS.orange
                }
                onBackButtonPressed={goBack}
              />
            </View>
          )}
        </FastImage>
      ) : (
        action !== 'edit' && (
          <View style={styles.backHeaderContainer}>
            <BackHeader
              iconColor={
                product.productPicture != '' ? COLORS.white : COLORS.orange
              }
              onBackButtonPressed={goBack}
            />
          </View>
        )
      )}

      <MainFrame fullscreen>
        <View
          style={[
            styles.header,
            {
              marginTop:
                product.productPicture != '' || action == 'edit'
                  ? 0
                  : windowHeight * 0.055,
            },
          ]}
          onTouchStart={() => setShowInfo(false)}>
          <View style={styles.headerWrapper}>
            <View style={{width: '60%'}}>
              <Text style={styles.productName}>{product.productName}</Text>
            </View>
            <View style={styles.productPriceContainer}>
              <Text style={styles.price}>₱ {product.productPrice}</Text>
              <Text style={styles.txtTotal}>Total Price</Text>
            </View>
          </View>

          {productContext?.ingredients[0]?.name.length > 0 && (
            <View style={styles.allergyContainer}>
              <View style={styles.allergyWrapper}>
                {productContext.ingredients.map(ingredient =>
                  ingredient.name.map((name, index) => (
                    <View style={styles.allergies} key={index}>
                      <Text style={styles.allergyText}>{name}</Text>
                    </View>
                  )),
                )}
              </View>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setShowInfo(!isShowInfo)}
                style={styles.infoContainer}>
                <View style={styles.infoIcon}>
                  <Icon name="alert-outline" color={COLORS.white} />
                </View>
              </TouchableOpacity>
            </View>
          )}

          {isShowInfo && (
            <View style={styles.viewInfoBoxContainer}>
              <View style={styles.viewInfoBox} />
              <View style={styles.rowContainer}>
                <Icon1
                  style={styles.iconInfo}
                  name="information"
                  size={windowHeight * 0.027}
                  color={'#1A4652'}
                />
                <Text style={styles.allergySection}>
                  This section indicates the food allergies within the product.
                </Text>
              </View>
            </View>
          )}
          <Text style={styles.productDesc}>{product.productDescription}</Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          onTouchStart={() => setShowInfo(false)}>
          <View
            style={[
              styles.container,
              {
                marginBottom:
                  Platform.OS === 'ios'
                    ? keyboardAvoidView
                      ? windowHeight * 0.23
                      : 0
                    : SPACING.medium,
              },
            ]}>
            {productContext.variant.length > 0 && (
              <>
                <View style={styles.containerVertical}>
                  <View style={styles.rowContainer}>
                    <Text
                      style={[styles.sectionLabel, {fontSize: SIZES._16px}]}>
                      Variant Type
                    </Text>
                    <Text style={styles.selectVariant}>Select 1</Text>
                    <View style={styles.infoIcon1}>
                      <Icon name="alert-outline" color={COLORS.white} />
                    </View>
                  </View>
                  <Text style={styles.sectionSubLabel1}>
                    This option is required.
                  </Text>
                </View>

                {productContext.variantType.map((type, index) => (
                  <View style={{marginBottom: SPACING.x_large}}>
                    {/* <Text style={styles.sectionLabel}>{type}</Text> */}
                    {productContext.variant
                      .filter(filter => filter.title === type)
                      .map((item, index) => (
                        <View style={styles.drinkSizeContainer} key={index}>
                          <View style={styles.radioContainer}>
                            <Pressable onPress={setVariant.bind(this, item)}>
                              <MaterialIcon
                                name={
                                  variant && variant.id == item.id
                                    ? 'checkbox-marked-circle'
                                    : 'checkbox-blank-circle-outline'
                                }
                                color={
                                  variant && variant.id == item.id
                                    ? COLORS.orange
                                    : COLORS.grayText
                                }
                                size={windowHeight * 0.03}
                              />
                            </Pressable>
                            <Text
                              style={[
                                styles.sectionLabel,
                                {
                                  flex: 1,
                                  marginLeft: SPACING.small,
                                  marginTop:
                                    Platform.OS === 'ios'
                                      ? windowHeight * 0.0035
                                      : 0,
                                },
                              ]}
                              onPress={setVariant.bind(this, item)}>
                              {item.name}
                            </Text>
                          </View>

                          <View style={styles.priceWrapper} key={index}>
                            <Text style={styles.currentPrice}>
                              {item.price == 0 ? null : `+ ₱${item.price}`}
                            </Text>
                          </View>
                        </View>
                      ))}
                  </View>
                ))}
              </>
            )}

            {productContext.addons.length > 0 && (
              <View style={{marginBottom: SPACING.x_large}}>
                <Text style={[styles.sectionLabel, {fontSize: SIZES._16px}]}>
                  Add-on Type
                </Text>
                <Text
                  style={[
                    styles.sectionSubLabel1,
                    {marginBottom: SPACING.x_small},
                  ]}>
                  This is optional.
                </Text>
                <View style={{marginTop: windowHeight * 0.004}}>
                  {productContext.addons.map((item, index) => (
                    <AddOnsItem
                      key={index}
                      item={item}
                      selected={
                        addOn.findIndex(data => data.id === item.id) >= 0
                          ? true
                          : false
                      }
                      onItemSelect={addOnSelectHandler}
                    />
                  ))}
                </View>
              </View>
            )}
            <Text style={styles.sectionLabel}>Special Instructions</Text>
            <RoundedInput
              onFocus={() => setKeyboardAvoidView(true)}
              onBlur={() => setKeyboardAvoidView(false)}
              multiline={true}
              numberOfLines={4}
              minHeight={Platform.OS === 'ios' ? 20 * 4 : null}
              textAlignVertical="top"
              placeholder="Enter your special instructions here..."
              inputStyle={styles.inputStyle}
              value={instruction}
              onChangeText={value => setInstruction(value)}
            />
            <View style={styles.btnContainer}>
              <View style={styles.btnWrapper}>
                <RoundedButton
                  text="-"
                  btnStyle={styles.btnStyle1}
                  btnText={styles.btnText}
                  outline
                  onPress={removeItemHandler}
                />
              </View>
              <View style={[styles.btnWrapper, styles.btnWrapper1]}>
                <RoundedInput
                  value={`${quantity}`}
                  onChangeText={value => setQuantity(Number(value))}
                  keyboardType="numeric"
                  inputStyle={styles.inputQuantity}
                />
              </View>
              <View style={styles.btnWrapper}>
                <RoundedButton
                  text="+"
                  btnStyle={styles.btnStyle1}
                  btnText={styles.btnText}
                  outline
                  onPress={addItemHandler}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </MainFrame>

      <Footer>
        <View style={styles.footerContainer}>
          {action === 'edit' ? (
            <View style={styles.footerBtnWrapper}>
              <View style={styles.footerBtnWrapperStyle}>
                <RoundedButton
                  text="Delete"
                  onPress={() => setModalDeleteProduct(true)}
                  btnStyle={styles.btnStyle}
                  btnText={{color: COLORS.subTextColor1}}
                />
              </View>
              <View style={{flex: 1}}>
                <RoundedButton
                  disabled={
                    productContext.variantType.length !== 0
                      ? quantity != '' && variant
                        ? false
                        : true
                      : quantity != ''
                      ? false
                      : true
                  }
                  text={`Update ( ₱${formatThousands(totalPrice)} )`}
                  onPress={updateCartHandler}
                  btnStyle={{borderRadius: BORDER.circle}}
                />
              </View>
            </View>
          ) : (
            <View style={styles.footerBtnContainer}>
              <RoundedButton
                disabled={
                  productContext.variantType.length !== 0
                    ? quantity != '' && variant
                      ? false
                      : true
                    : quantity != ''
                    ? false
                    : true
                }
                text={`Add to Cart ( ₱${formatThousands(totalPrice)} )`}
                onPress={addToCartHandler}
              />
            </View>
          )}
        </View>
      </Footer>
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
    zIndex: 1,
  },
  backContainer: {
    position: 'absolute',
    width: windowWidth,
    zIndex: 1,
  },
  viewRight: {
    height: windowHeight * 0.025,
    width: windowHeight * 0.025,
  },
  header: {
    borderBottomWidth: 1,
    marginHorizontal: SPACING.medium,
    paddingVertical: SPACING.medium,
    borderBottomColor: COLORS.lightGray,
  },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productName: {
    ...FONTS.bold,
    fontSize: SIZES._18px,
    color: COLORS.brown332,
  },
  productPriceContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  price: {
    ...FONTS.bold,
    fontSize: SIZES._18px,
    color: COLORS.orange,
  },
  txtTotal: {
    ...FONTS.regular,
    fontSize: SIZES._12px,
    color: COLORS.subTextColor2,
  },
  infoContainer: {
    paddingLeft: SPACING.x_small,
    paddingVertical: SPACING.x_small,
    borderRadius: BORDER.circle,
  },
  infoIcon: {
    height: windowHeight * 0.023,
    width: windowHeight * 0.023,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.subTextColor2,
    borderRadius: BORDER.circle,
    zIndex: 1,
  },
  infoIcon1: {
    height: windowHeight * 0.02,
    width: windowHeight * 0.02,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER.circle,
    zIndex: 1,
  },
  viewInfoBoxContainer: {
    position: 'absolute',
    right: -windowWidth * 0.015,
    top: windowHeight * 0.145,
    padding: SPACING.small,
    borderWidth: 1,
    borderColor: COLORS.subTextColor,
    backgroundColor: COLORS.subTextColor,
    borderRadius: 10,
    zIndex: 1,
  },
  viewInfoBox: {
    position: 'absolute',
    top: -SPACING.x_small,
    right: SPACING.small,
    height: windowHeight * 0.015,
    width: windowHeight * 0.015,
    transform: [{rotate: '45deg'}],
    borderTopWidth: 1,
    borderTopColor: COLORS.subTextColor,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.subTextColor,
    backgroundColor: COLORS.subTextColor,
  },
  allergyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.small,
  },
  allergyWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  allergies: {
    backgroundColor: COLORS.lightOrange,
    borderRadius: BORDER.roundedCornerInput,
    marginRight: windowHeight * 0.005,
  },
  allergyText: {
    ...FONTS.bold,
    fontSize: SIZES._10px,
    color: COLORS.orange,
    paddingHorizontal: windowWidth * 0.017,
    paddingVertical: windowWidth * 0.008,
    marginTop: Platform.OS === 'ios' ? 0 : -windowWidth * 0.0035,
  },
  container: {
    marginVertical: SPACING.medium,
    marginHorizontal: SPACING.medium,
  },
  containerVertical: {
    marginBottom: SPACING.small,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconInfo: {
    transform: [{rotate: '180deg'}],
  },
  allergySection: {
    ...FONTS.regular,
    fontSize: SIZES._12px,
    marginLeft: SPACING.small,
  },
  productDesc: {
    ...FONTS.regular,
    fontSize: SIZES._12px,
    color: COLORS.subTextColor1,
    textAlign: 'justify',
  },
  sectionLabel: {
    ...GlobalStyle.sectionLabel,
    color: COLORS.brown332,
  },
  selectVariant: {
    flex: 1,
    ...FONTS.regular,
    fontSize: SIZES._12px,
    color: COLORS.red1,
    marginLeft: SPACING.x_small,
  },
  sectionSubLabel1: {
    ...FONTS.regular,
    fontSize: SIZES._12px,
    color: COLORS.subTextColor1,
  },
  drinkSizeContainer: {
    flexDirection: 'row',
    marginTop: windowHeight * 0.004,
    marginLeft: SPACING.small,
  },
  radioContainer: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: windowHeight * 0.01,
    marginLeft: -SPACING.x_small,
  },
  priceContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  priceWrapper: {
    flexDirection: 'row',
    paddingTop: windowHeight * 0.014,
  },
  currentPrice: {
    ...FONTS.regular,
    color: COLORS.tertiary,
  },
  inputStyle: {
    borderColor: COLORS.iconSearchColor,
    paddingVertical: SPACING.small,
  },
  btnContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: SPACING.large,
  },
  btnWrapper: {
    height: windowWidth * 0.15,
  },
  btnWrapper1: {
    marginHorizontal: SPACING.small,
    width: windowWidth * 0.15,
    height: windowWidth * 0.117,
  },
  btnStyle1: {
    paddingVertical: windowHeight * 0.005,
    borderRadius: 5,
    backgroundColor: COLORS.white,
    borderColor: '#F2F2F2',
    borderWidth: 1,
    textAlign: 'center',
    ...FONTS.body,
  },
  inputQuantity: {
    textAlign: 'center',
    borderColor: '#F2F2F2',
    borderWidth: 1,
    borderRadius: 5,
    paddingBottom:
      Platform.OS === 'ios' ? windowHeight * 0.015 : SPACING.x_small,
    height: windowHeight * 0.044,
    paddingHorizontal:
      Platform.OS === 'ios' ? windowWidth * 0.03 : windowWidth * 0.04,
  },
  btnText: {
    color: COLORS.orange,
    fontSize: SIZES._20px,
    marginTop: Platform.OS === 'ios' ? 0 : -windowWidth * 0.013,
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerBtnWrapper: {
    flexDirection: 'row',
  },
  footerBtnWrapperStyle: {
    width: windowWidth * 0.3,
    marginRight: SPACING.x_small,
  },
  btnStyle: {
    borderRadius: BORDER.circle,
    backgroundColor: COLORS.subTextColor,
  },
  dotContainerStyle: {
    marginTop: -windowHeight * 0.055,
    marginBottom: -windowHeight * 0.03,
  },
  dotStyle: {
    width: windowWidth * 0.12,
    height: windowHeight * 0.007,
    marginHorizontal: -windowHeight * 0.006,
    backgroundColor: COLORS.orange,
  },
  inactiveDotStyle: {
    backgroundColor: COLORS.white,
  },
  footerBtnContainer: {
    width: '100%',
  },
});
export default AddToCart;
