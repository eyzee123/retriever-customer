import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import Header from '../../components/headers/Header';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import {BORDER, COLORS, FONTS, SPACING} from '../../styles/theme';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import RoundedButton from '../../components/cores/RoundedButton';
import ListFoodHistory from '../../components/listItem/ListFoodHistory';
import HistorySortFilter from '../../components/modals/HistorySortFilter';
import {ROUTES} from '../../constants/Routes';
import EmptyCart from '../../components/empty/EmptyCart';
import {IMAGES} from '../../constants/Images';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {COLLECTION} from '../../constants/Collections';
import {LoadingOverlay} from '../../components/general/LoadingIndicator';
import moment from 'moment';
import {UserContext} from '../../provider/UserProvider';
import PushNotification from 'react-native-push-notification';
import {OrderContext} from '../../provider/OrderProvider';
import CategoryProfile from '../../components/listItem/CategoryProfile';

const History = ({navigation}) => {
  const userCtx = useContext(UserContext);
  const orderCtx = useContext(OrderContext);
  const currentUser = auth().currentUser;
  const orderCollection = firestore().collection(COLLECTION.CURRENT_ORDERS);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openModalHistorySort, setOpenModalHistorySort] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [from, setFrom] = useState(moment().startOf('day').toDate());
  const [to, setTo] = useState(moment().endOf('day').toDate());
  const [scrollPercent, setScrollPercent] = useState(0);
  const [clickFetch, setClickFetch] = useState(false);
  const [historySize, setHistorySize] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState({
    id: 'Foods',
    name: 'Foods',
  });

  const category = [
    {id: 'Foods', name: 'Foods'},
    // {id: 'Errands', name: 'Errands'},
  ];

  useEffect(() => {
    userCtx.isLoggedIn ? getHistory() : null;
  }, []);

  const fetchMore = async () => {
    let latestTimestamp;

    history.map(item => {
      latestTimestamp = item.updatedAt.toDate();
    });

    let query = orderCollection;
    query = query.where('user.id', '==', currentUser.uid);
    query = query.where('status', 'in', [7, 99]);
    if (
      from.getDate() != moment().startOf('day').toDate().getDate() &&
      to.getDate() != moment().endOf('day').toDate().getDate()
    ) {
      query = query.where('updatedAt', '>=', from);
      query = query.where('updatedAt', '<=', to);
    }
    query = query.orderBy('updatedAt', 'desc');
    query = query.limit(5);
    query = query.startAfter(latestTimestamp);

    const orderResponse = await query.get();

    if (orderResponse.empty) {
      setIsLoading(false);
      setHistorySize(orderResponse.size);
      return;
    }

    orderResponse.forEach(async snapshot => {
      const formattedDate = moment(snapshot.data().updatedAt.toDate()).format(
        'dddd, DD MMM YYYY, h:mm a',
      );
      let orders = {
        id: snapshot.id,
        ...snapshot.data(),
        date: formattedDate,
      };
      setHistory(previousData => [...previousData, orders]);
      setClickFetch(true);
    });
  };

  const getHistory = async () => {
    setIsLoading(true);
    let orders = [];

    let query = orderCollection;
    query = query.where('user.id', '==', currentUser.uid);
    query = query.where('status', 'in', [7, 99]);
    query = query.orderBy('updatedAt', 'desc');
    query = query.limit(5);

    const orderResponse = await query.get();
    setHistorySize(orderResponse.size);

    if (orderResponse.empty) {
      setIsLoading(false);
      return;
    }

    orderResponse.forEach(async snapshot => {
      const formattedDate = moment(snapshot.data().updatedAt.toDate()).format(
        'dddd, DD MMM YYYY, h:mm a',
      );
      orders.push({
        id: snapshot.id,
        ...snapshot.data(),
        date: formattedDate,
      });
    });
    setIsLoading(false);
    setHistory(orders);

    return {data: orders};
  };

  const getSelectedFilter = dateFilter => {
    switch (dateFilter) {
      case 'Today':
        setFrom(moment().startOf('day').toDate());
        setTo(moment().endOf('day').toDate());
        break;
      case 'Yesterday':
        setFrom(moment().subtract(1, 'days').startOf('day').toDate());
        setTo(moment().subtract(1, 'days').endOf('day').toDate());
        break;
      case 'Last Week':
        setFrom(moment().subtract(1, 'weeks').startOf('week').toDate());
        setTo(moment().subtract(1, 'weeks').endOf('week').toDate());
        break;
      case 'Last Month':
        setFrom(moment().subtract(1, 'months').startOf('month').toDate());
        setTo(moment().subtract(1, 'months').endOf('month').toDate());
        break;
      case 'Custom Date':
        break;
      default:
        // Handle default case
        orderCtx.getOrderHistory(currentUser.uid, from, to);
    }
  };

  const getOrderFilterHistory = async (date, date1) => {
    setIsLoading(true);
    try {
      setOpenModalHistorySort(false);
      if (selectedFilter == 'Custom Date') {
        let startDate = moment(date, 'YYYY-MM-DD').startOf('day').toDate();
        let endDate = moment(date1, 'YYYY-MM-DD').endOf('day').toDate();
        await orderCtx
          .getOrderHistory(currentUser.uid, startDate, endDate)
          .then(response => {
            setHistory(response.data);
            setIsLoading(false);
          });
      } else {
        await orderCtx
          .getOrderHistory(currentUser.uid, from, to)
          .then(response => {
            setHistory(response.data);
            setIsLoading(false);
          });
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const gotoOrderDetails = item => {
    navigation.navigate(ROUTES.ORDER_DETAILS, {orderItem: item});
    PushNotification.cancelAllLocalNotifications();
  };

  let orderHistoryContent = (
    <EmptyCart
      image={selectedFilter != '' ? IMAGES.EMPTY_ORDER : IMAGES.EMPTY_HISTORY}
      label={
        selectedFilter != '' ? 'No existing order' : 'No recent orders here.'
      }
      sub_label={
        selectedFilter != ''
          ? `You don’t have any order within this${'\n'}date.`
          : `Buy something to see your recent${'\n'}or previous orders here.`
      }
    />
  );

  const scrollPercentage = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    return setScrollPercent(
      ((layoutMeasurement.height + contentOffset.y) / contentSize.height) * 100,
    );
  };

  if (history.length > 0) {
    orderHistoryContent = (
      <FlatList
        onScroll={({nativeEvent}) => {
          scrollPercentage(nativeEvent);
          if (scrollPercent >= 97) {
            setClickFetch(false);
          }
        }}
        showsVerticalScrollIndicator={false}
        data={history}
        renderItem={({item, index}) => (
          <View style={styles.listWrapper}>
            <ListFoodHistory
              date={item.date}
              storeName={item.store.storeName}
              total={item.totalCost}
              status={item.status}
              onPressDetails={() => gotoOrderDetails(item)}
              store={item.store}
            />
          </View>
        )}
      />
    );
  }

  const selectCategory = item => {
    setSelectedCategory(item);
  };

  return (
    <MainScreen containerStyle={styles.contentContainer}>
      <Header title="Order History">
        {userCtx.isLoggedIn && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => setOpenModalHistorySort(true)}>
            <Image source={IMAGES.SORT} style={styles.iconStyle} />
          </TouchableOpacity>
        )}
      </Header>
      <View style={styles.categoryContainer}>
        <CategoryProfile
          data={category}
          selectCategory={selectCategory}
          selectedCategory={selectedCategory.name}
        />
      </View>
      <MainFrame fullscreen>
        <View style={styles.container}>
          {isLoading && (
            <LoadingOverlay visible={isLoading} textContent="LOADING..." />
          )}
          {!isLoading && orderHistoryContent}
        </View>
      </MainFrame>
      {scrollPercent >= 97 && !clickFetch && historySize != 0 && (
        <TouchableOpacity onPress={fetchMore}>
          <Text style={styles.loadMore}>Load more..</Text>
        </TouchableOpacity>
      )}
      <HistorySortFilter
        showModal={openModalHistorySort}
        closeModal={() => {
          setOpenModalHistorySort(false), getHistory();
        }}
        onConfirmApply={(date, date1) => {
          getOrderFilterHistory(date, date1);
        }}
        selectedFilter={datefilter => {
          setSelectedFilter(datefilter.label);
          if (datefilter.label !== 'Custom Date') {
            getSelectedFilter(datefilter.label);
          }
        }}
      />
    </MainScreen>
  );
};
const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: COLORS.whiteFA,
  },
  categoryContainer: {
    height: windowHeight * 0.07,
    marginTop: SPACING.x_small,
    marginBottom: windowHeight * 0.013,
  },
  container: {
    flex: 1,
    marginHorizontal: SPACING.medium,
  },
  iconContainer: {
    paddingLeft: SPACING.x_small,
    paddingVertical: SPACING.x_small,
  },
  iconStyle: {
    marginRight: SPACING.x_small,
    height: windowHeight * 0.023,
    width: windowHeight * 0.023,
  },
  btnCategoryContainer: {
    marginHorizontal: windowHeight * 0.004,
    width: windowWidth * 0.255,
  },
  btnStyle: {
    borderRadius: BORDER.circle,
    paddingVertical: windowHeight * 0.007,
    marginVertical: 0,
  },
  listWrapper: {
    marginBottom: SPACING.medium,
  },
  loadMore: {
    ...FONTS.bold,
    textAlign: 'center',
    color: COLORS.orange,
    marginBottom: SPACING.medium,
  },
});

export default History;
