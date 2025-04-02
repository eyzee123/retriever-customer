import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import SearchInput from '../../components/cores/SearchInput';
import Header from '../../components/headers/Header';
import ListPromos from '../../components/listItem/ListPromos';
import {IMAGES} from '../../constants/Images';
import {ROUTES} from '../../constants/Routes';
import {BORDER, COLORS, FONTS, SPACING} from '../../styles/theme';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import firestore from '@react-native-firebase/firestore';
import {COLLECTION} from '../../constants/Collections';
import {OrderContext} from '../../provider/OrderProvider';
import EmptyCart from '../../components/empty/EmptyCart';
import Lottie from 'lottie-react-native';

const AddPromo = ({navigation}) => {
  const [promos, setPromos] = useState(null);
  const orderContext = useContext(OrderContext);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');

  const [searchResult, setSearchResult] = useState([]);
  const [enterSearch, setEnterSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setIsLoading(true);
      searchPromo(query);
    }, 500);
    return () => clearTimeout(timeOutId);
  }, [query]);

  useEffect(() => {
    getPromos();
  }, []);

  const getPromos = async () => {
    const now = new Date();
    const currentTimeStamp = firestore.Timestamp.fromDate(now);
    const promoList = [];
    try {
      const response = await firestore()
        .collection(COLLECTION.PROMOS)
        .where('promoTill', '>', currentTimeStamp)
        .where('promoMode', '==', 'Public')
        .get();
      response.forEach(data => {
        promoList.push({...data.data(), id: data.id});
      });
      const filteredPromoList = promoList.filter(
        promo => promo.promoCount < promo.promoAllowusers,
      );
      setPromos(filteredPromoList);
    } catch (error) {
      console.log(error);
    }
  };

  const selectPromoHandler = item => {
    orderContext.addPromoItem(item);
    navigation.navigate(ROUTES.CART_DETAILS);
  };

  const searchHandler = value => {
    setQuery(value);
    if (value == '') {
      setEnterSearch(false);
      getPromos();
    }
  };

  const searchPromo = async query => {
    if (query != '') {
      const now = new Date();
      const currentTimeStamp = firestore.Timestamp.fromDate(now);
      const promoList = [];
      try {
        const response = await firestore()
          .collection(COLLECTION.PROMOS)
          .where('promoCode', '==', query)
          .where('promoTill', '>', currentTimeStamp)
          .get();

        if (!response.empty) {
          response.forEach(data => {
            if (data.data().promoCount < data.data().promoAllowusers) {
              // orderContext.addPromoItem({...data.data(), id: data.id});
              // navigation.navigate(ROUTES.CART_DETAILS);
              response.forEach(data => {
                promoList.push({...data.data(), id: data.id});
              });
              const filteredPromoList = promoList.filter(
                promo => promo.promoCount < promo.promoAllowusers,
              );
              setPromos(filteredPromoList);
            } else {
              console.log('Promo is Invalid');
              setPromos([]);
            }
          });
          setIsLoading(false);
        } else {
          console.log('Promo not found');
          setPromos([]);
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  const searchSumitHandler = async () => {
    setEnterSearch(true);
  };

  const activeSearchHandler = active => {};

  const itemClickHandler = item => {
    props.navigation.navigate(ROUTES.RESTAURANT_PROFILE, {
      store: item,
    });
  };

  return (
    <MainScreen>
      <Header
        containerStyle={styles.containerStyle}
        backPressContainer={styles.backPressContainer}
      />
      <View style={styles.searchContainer}>
        <SearchInput
          icon="magnify"
          placeholder="Enter promo or gift code here "
          onChangeText={searchHandler}
          returnKeyType="search"
          onSubmitSearch={searchSumitHandler}
          onActiveSearch={activeSearchHandler}
        />
      </View>

      <MainFrame fullscreen>
        <View style={styles.container}>
          <View style={styles.containerWrapper}>
            {!enterSearch ? (
              <>
                {query.trim() != '' ? (
                  <>
                    <View style={styles.searchResult}>
                      <Text style={styles.queryText}>Search result: </Text>
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
                    ) : promos?.length > 0 ? (
                      <FlatList
                        data={promos}
                        renderItem={({item}) => (
                          <ListPromos
                            item={item}
                            promoLength={promos.length}
                            onPromoSelect={selectPromoHandler}
                          />
                        )}
                      />
                    ) : (
                      <EmptyCart
                        image={IMAGES.EMPTY_SEARCH}
                        label="Promo not available"
                        sub_label={`Sorry, your searched promo is not${'\n'}available.`}
                      />
                    )}
                  </>
                ) : promos?.length > 0 ? (
                  <FlatList
                    data={promos}
                    renderItem={({item}) => (
                      <ListPromos
                        item={item}
                        promoLength={promos.length}
                        onPromoSelect={selectPromoHandler}
                      />
                    )}
                  />
                ) : (
                  <EmptyCart
                    image={IMAGES.EMPTY_PROMO}
                    label="No promo available"
                    sub_label={`There is no existing promo at${'\n'}the moment.`}
                  />
                )}
              </>
            ) : (
              <>
                {query.trim() != '' ? (
                  <>
                    <View style={styles.searchResult}>
                      <Text style={styles.queryText}>Search result: </Text>
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
                    ) : promos?.length > 0 ? (
                      <FlatList
                        data={promos}
                        renderItem={({item}) => (
                          <ListPromos
                            item={item}
                            promoLength={promos.length}
                            onPromoSelect={selectPromoHandler}
                          />
                        )}
                      />
                    ) : (
                      <EmptyCart
                        image={IMAGES.EMPTY_SEARCH}
                        label="Promo not available"
                        sub_label={`Sorry, your searched promo is not${'\n'}available.`}
                      />
                    )}
                  </>
                ) : promos?.length > 0 ? (
                  <FlatList
                    data={promos}
                    renderItem={({item}) => (
                      <ListPromos
                        item={item}
                        promoLength={promos.length}
                        onPromoSelect={selectPromoHandler}
                      />
                    )}
                  />
                ) : (
                  <EmptyCart
                    image={IMAGES.EMPTY_PROMO}
                    label="No promo available"
                    sub_label={`There is no existing promo at${'\n'}the moment.`}
                  />
                )}
              </>
            )}
          </View>
        </View>
      </MainFrame>
    </MainScreen>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    height: windowHeight * 0.09,
  },
  backPressContainer: {
    marginTop: windowHeight * 0.008,
  },
  searchContainer: {
    position: 'absolute',
    width: '81%',
    right: SPACING.medium,
    top: windowHeight * 0.022,
  },
  viewRight: {
    height: windowHeight * 0.025,
    width: windowHeight * 0.025,
    marginRight: SPACING.small,
  },
  container: {
    flex: 1,
    marginHorizontal: SPACING.medium,
  },
  lottieContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerWrapper: {
    flex: 1,
  },
  searchResult: {
    flexDirection: 'row',
    marginTop: SPACING.small,
  },
  promoContainer: {
    width: '100%',
    // marginTop: SPACING.medium,
  },
  line: {
    borderColor: COLORS.subTextColor1,
    borderBottomWidth: 0.4,
    marginTop: SPACING.x_small,
  },
  queryText: {
    ...FONTS.bold,
    color: COLORS.darkGreen,
  },
  queryTextResult: {
    ...FONTS.regular,
    color: COLORS.darkGreen,
  },
});
export default AddPromo;
