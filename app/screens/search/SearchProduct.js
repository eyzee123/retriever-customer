import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import RoundedButton from '../../components/cores/RoundedButton';
import SearchProductHeader from '../../components/headers/SearchProductHeader';
import {BORDER, COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ListStoreProduct from '../../components/listItem/ListStoreProduct';
import {FlatList} from 'react-native-gesture-handler';
import SearchFilter from '../../components/modals/SearchFilter';
import {IMAGES} from '../../constants/Images';
import EmptyCart from '../../components/empty/EmptyCart';
import {StoreContext} from '../../provider/StoreProvider';
import FastImage from 'react-native-fast-image';
import {ROUTES} from '../../constants/Routes';
import firestore from '@react-native-firebase/firestore';
import {COLLECTION} from '../../constants/Collections';
import Lottie from 'lottie-react-native';
import {useNavigation} from '@react-navigation/native';
import LinearStoreItem from '../../components/listItem/LinearStoreItem';
import {AddressContext} from '../../provider/AddressProvider';
import {getSpecificDistance} from '../../utils/HelperFunctions';
import getHighlightedText from '../../hooks/useHighlightedText';

const SearchProduct = props => {
  const navigation = useNavigation();
  const storeContext = useContext(StoreContext);
  const addressContext = useContext(AddressContext);
  const {primaryAddress} = addressContext;
  const [openModalFilter, setOpenModalFilter] = useState(false);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const storeCollection = firestore().collection(COLLECTION.STORES);

  const [searchResult, setSearchResult] = useState([]);
  const [productSearchResult, setProductSearchResult] = useState([]);
  const [storeSearchResult, setStoreSearchResult] = useState([]);
  const [enterSearch, setEnterSearch] = useState(false);

  const [btnCategory, setBtnCategory] = useState([
    {title: 'Popular', selected: false},
    {title: 'Price', selected: true},
    {title: 'Food', selected: true},
    {title: 'Clear', selected: true},
  ]);

  const origin = {
    latitude: primaryAddress.coordinates?.latitude,
    longitude: primaryAddress.coordinates?.longitude,
  };

  const clickCategory = index => {
    let array = [...btnCategory];
    for (let x = 0; x < btnCategory.length; x++) {
      if (x == index) {
        array[x].selected = false;
      } else {
        array[x].selected = true;
      }
    }
    setBtnCategory(array);
  };

  const searchFE = async searchVal => {
    let storeArray = [];
    const searchedStores = storeContext.storeList.filter(item =>
      item.storeName.trim().toLowerCase().includes(searchVal.toLowerCase()) &&
      item.status == 'open' &&
      origin.latitude !== undefined &&
      origin.longitude !== undefined
        ? getSpecificDistance(origin, {
            latitude: item.latitude,
            longitude: item.longitude,
          }) <= 4
        : null,
    );

    searchedStores.map(item => {
      console.log(item.storeName);

      const searchedProducts = item.products.filter(item =>
        item.productName.trim().toLowerCase().includes(searchVal.toLowerCase()),
      );

      const storeObj = {
        ...item,
        id: item.id,
        rating: 5,
        products: searchedProducts,
      };
      const index = productSearchResult.findIndex(d => d.id === data.id);

      if (index < 0) {
        storeArray.push(storeObj);
      }
    });

    const joinArray = storeArray.concat(productSearchResult);
    setSearchResult(joinArray);
  };

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setIsLoading(true);
      searchStoresyProduct(query);
    }, 500);
    return () => clearTimeout(timeOutId);
  }, [query]);

  useEffect(() => {
    setIsLoading(false);
  }, [searchResult]);

  const searchHandler = value => {
    const arr = value.split(' ');
    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }
    const finalKeyWord = arr.join(' ');
    setQuery(finalKeyWord);
  };

  useEffect(() => {
    // searchStores(query);
    searchFE(query);
  }, [productSearchResult]);

  const searchStores = async searchKey => {
    let storeArray = [];
    if (searchKey != '') {
      try {
        const storeNameFilter = await storeCollection
          .where('storeName', '>=', searchKey)
          .where('storeName', '<', searchKey + 'z')
          .get();

        if (!storeNameFilter.empty) {
          storeArray = [];
          storeNameFilter.forEach(async data => {
            const storeObj = {
              ...data.data(),
              id: data.id,
              rating: 5,
              products: [],
            };

            const index = productSearchResult.findIndex(d => d.id === data.id);

            if (index < 0) {
              storeArray.push(storeObj);
            }
          });
        }

        const joinArray = storeArray.concat(productSearchResult);
        setSearchResult(joinArray);
      } catch (error) {
        console.log('store search error', error);
        setIsLoading;
      }
    } else {
      setSearchResult([]);
    }
  };

  const searchStoresyProduct = async searchKey => {
    if (searchKey !== '') {
      try {
        //Search by product
        //Query documents in the 'mainCollection'
        firestore()
          .collection('stores')
          .get()
          .then(querySnapshot => {
            // setSearchResult(searchResult => []);
            setProductSearchResult([]);
            querySnapshot.forEach(mainDoc => {
              // Get the subcollection reference
              const subCollectionRef = mainDoc.ref.collection('products');

              // Query documents in the 'subCollection'
              subCollectionRef
                .where('productName', '>=', searchKey)
                .where('productName', '<', searchKey + 'z')
                .get()
                .then(subQuerySnapshot => {
                  arrProducts = [];
                  subQuerySnapshot.forEach(subDoc => {
                    // Access the document data

                    const storeObj = {
                      ...mainDoc.data(),
                      id: mainDoc.id,
                      rating: 5,
                      products: [{...subDoc.data(), id: subDoc.id}],
                    };

                    const productObj = {
                      ...subDoc.data(),
                      id: subDoc.id,
                    };

                    // setSearchResult(prev =>
                    //   prev.id === mainDoc.id
                    //     ? {...prev, products: [...prev.products, productObj]}
                    //     : [...prev, storeObj],
                    // );

                    setProductSearchResult(prevArray => {
                      let newArray = [];
                      const updatedArray = [...prevArray];
                      const index = updatedArray.findIndex(
                        data => data.id === mainDoc.id,
                      );
                      if (index >= 0) {
                        updatedArray[index] = {
                          ...updatedArray[index],
                          products: [
                            ...updatedArray[index].products,
                            productObj,
                          ],
                        };
                        return updatedArray;
                      } else {
                        newArray = [...prevArray, storeObj];
                        return newArray;
                      }
                    });
                  });
                })
                .catch(error => {
                  console.error(
                    'Error getting subcollection documents: ',
                    error,
                  );
                });
            });
          })
          .catch(error => {
            console.error('Error getting main collection documents: ', error);
          });
        //End Search by Product
      } catch (error) {
        console.log('search', error);
      }
    } else {
      // setSearchResult(searchResult => []);
      setProductSearchResult([]);
    }
  };

  const searchSumitHandler = () => {
    setEnterSearch(true);
  };
  const activeSearchHandler = active => {
    // setEnterSearch(!active);
  };
  const itemClickHandler = item => {
    props.navigation.navigate(ROUTES.RESTAURANT_PROFILE, {
      store: item,
    });
  };

  return (
    <MainScreen>
      <SearchProductHeader
        placeholder="What are you looking for?"
        onSearch={searchHandler}
        // onPress={() => setOpenModalFilter(true)}
        onSubmitSearch={searchSumitHandler}
        onActiveSearch={activeSearchHandler}
      />
      <SearchFilter
        showModal={openModalFilter}
        closeModal={() => setOpenModalFilter(false)}
      />
      <MainFrame fullscreen>
        <View style={styles.container}>
          {!enterSearch ? (
            <>
              {query.trim() != '' ? (
                <>
                  <View style={styles.searchWrapper}>
                    <Text style={styles.queryText}>Search results for: </Text>
                    <Text style={styles.queryTextResult}>"{query}"</Text>
                  </View>
                  {isLoading ? (
                    <View style={styles.lottieContainer}>
                      <Lottie
                        resizeMode="cover"
                        source={require('./../../assets/animations/loading-dots.json')}
                        style={{height: windowHeight * 0.25}}
                        autoPlay
                        loop
                      />
                    </View>
                  ) : searchResult.length > 0 ? (
                    <FlatList
                      showsVerticalScrollIndicator={false}
                      data={searchResult}
                      renderItem={({item}) => (
                        <TouchableOpacity
                          style={[
                            styles.searchContainer,
                            {
                              marginTop: SPACING.x_small,
                              marginHorizontal: SPACING.medium,
                            },
                          ]}
                          onPress={itemClickHandler.bind(null, item)}>
                          <Icon
                            name="magnify"
                            color={COLORS.orange}
                            size={SIZES.iconSize.medium}
                            style={{marginRight: windowWidth * 0.03}}
                          />
                          <Text style={styles.queryText}>
                            {getHighlightedText(item.storeName, query)}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  ) : (
                    <EmptyCart
                      image={IMAGES.EMPTY_SEARCH}
                      label="No Results Found?"
                      sub_label={`Shop not found. Try our recommended${'\n'}shops.`}
                      tap_here="Tap here."
                      onPress={() => navigation.goBack(ROUTES.FOOD)}
                    />
                  )}
                </>
              ) : (
                <EmptyCart
                  image={IMAGES.EMPTY_CURRENTORDER}
                  label="Are you hungry?"
                  sub_label={`Search for shops that would satisfy${'\n'}your cravings.`}
                />
              )}
            </>
          ) : (
            <>
              {/* <View style={styles.categoryContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {btnCategory.map((item, index) => (
                    <View style={styles.btnContainer} key={index}>
                      <RoundedButton
                        text={item.title}
                        onPress={() => clickCategory(index)}
                        btnStyle={[
                          styles.btnStyle,
                          {opacity: item.selected ? 1 : 0.3},
                        ]}
                        outline
                      />
                    </View>
                  ))}
                </ScrollView>
              </View> */}

              {searchResult.length > 0 ? (
                isLoading ? (
                  <View style={styles.lottieContainer}>
                    <Lottie
                      resizeMode="cover"
                      source={require('./../../assets/animations/loading-dots.json')}
                      style={{height: windowHeight * 0.25}}
                      autoPlay
                      loop
                    />
                  </View>
                ) : (
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                      <View style={{marginBottom: SPACING.medium}}>
                        <FlatList
                          scrollEnabled={false}
                          showsVerticalScrollIndicator={false}
                          data={searchResult}
                          renderItem={({item}) => (
                            <>
                              <LinearStoreItem
                                storeName={getHighlightedText(
                                  item.storeName,
                                  query,
                                )}
                                storeImage={{uri: item.storeCoverPhoto}}
                                storeAddress={item.storeAddress}
                                schedule={item.schedule}
                                distance={
                                  (origin.latitude !== undefined &&
                                    origin.longitude !== undefined &&
                                    getSpecificDistance(origin, {
                                      latitude: item.latitude,
                                      longitude: item.longitude,
                                    })) ||
                                  ''
                                }
                                // promo
                                rate={item.storeRating.averageRatings || 'TBD'}
                                prepare_time={item.preparationTime}
                                status={item.status}
                                onPress={itemClickHandler.bind(null, item)}
                                contentContainer={styles.contentContainer}
                              />

                              {item.products.length > 0 && (
                                <View style={styles.listMenuContainer}>
                                  <View style={styles.line} />
                                  <FlatList
                                    scrollEnabled={false}
                                    showsVerticalScrollIndicator={false}
                                    data={item.products}
                                    renderItem={({item: product}) => (
                                      <View style={styles.listProducts}>
                                        <ListStoreProduct
                                          image={product.productPicture}
                                          product={getHighlightedText(
                                            product.productName,
                                            query,
                                          )}
                                          price={product.productPrice}
                                          onPress={() =>
                                            navigation.navigate(
                                              ROUTES.ADD_TO_CART,
                                              {
                                                store: item,
                                                product: product,
                                              },
                                            )
                                          }
                                        />
                                      </View>
                                    )}
                                  />
                                </View>
                              )}
                            </>
                          )}
                        />
                      </View>
                    }
                  />
                )
              ) : (
                <EmptyCart
                  image={IMAGES.EMPTY_SEARCH}
                  label="No Results Found?"
                  sub_label={`Shop not found. Try our recommended${'\n'}shops.`}
                  tap_here="Tap here."
                  onPress={() => navigation.goBack(ROUTES.FOOD)}
                />
              )}
            </>
          )}
        </View>
      </MainFrame>
    </MainScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.whiteFA,
  },
  lottieContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginTop: -SPACING.x_small,
    marginBottom: SPACING.x_small,
    color: COLORS.white,
  },
  btnContainer: {
    marginRight: SPACING.x_small,
  },
  queryText: {
    ...FONTS.bold,
    color: COLORS.darkGreen,
  },
  queryTextResult: {
    ...FONTS.regular,
    color: COLORS.darkGreen,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.small,
    borderBottomColor: COLORS.subTextColor,
    borderBottomWidth: 1,
    marginTop: SPACING.x_small,
  },
  searchWrapper: {
    flexDirection: 'row',
    marginLeft: SPACING.medium,
    marginTop: SPACING.medium,
  },
  btnStyle: {
    paddingHorizontal: SPACING.medium,
    paddingVertical: windowHeight * 0.007,
  },
  line: {
    borderWidth: 1,
    borderColor: COLORS.subTextColor,
    marginBottom: SPACING.x_small,
    width: '100%',
  },
  listMenuContainer: {
    paddingHorizontal: SPACING.small,
    backgroundColor: COLORS.white,
    paddingBottom: SPACING.small,
    marginHorizontal: SPACING.default,
    borderBottomLeftRadius: BORDER.roundedCornerBox,
    borderBottomRightRadius: BORDER.roundedCornerBox,
  },
  listProducts: {
    marginTop: SPACING.x_small,
    marginBottom: SPACING.x_small,
  },
  title: {
    ...FONTS.regular,
    fontSize: SIZES._16px,
    color: COLORS.darkGreen,
    marginTop: SPACING.large,
  },
});

export default SearchProduct;
