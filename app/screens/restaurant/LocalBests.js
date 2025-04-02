import React, {useContext} from 'react';
import MainScreen from '../../components/containers/MainScreen';
import MainFrame from '../../components/containers/MainFrame';
import ListStore from '../../components/listItem/ListStore';
import Header from '../../components/headers/Header';
import CartIconHeader from '../../components/headers/CartIconHeader';
import {UserContext} from '../../provider/UserProvider';
import {FlatList, StyleSheet} from 'react-native';
import {COLORS, SPACING} from '../../styles/theme';

const LocalBests = ({route, navigation}) => {
  const userCtx = useContext(UserContext);
  const {storeCategory} = route.params;

  return (
    <MainScreen containerStyle={styles.container}>
      <Header title={storeCategory.title}>
        {userCtx.isLoggedIn && <CartIconHeader />}
      </Header>
      <MainFrame fullscreen>
        <FlatList
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              {storeCategory.title == 'Local Bests' ? (
                <ListStore
                  navigation={navigation}
                  storeSection={styles.storeSection}
                  allLocalBestsRestaurants
                />
              ) : storeCategory.title == 'Top Restaurants' ? (
                <ListStore
                  navigation={navigation}
                  storeSection={styles.storeSection}
                  allTopRestaurants
                />
              ) : (
                <ListStore
                  selectedCategoryRestaurants={storeCategory.categoryName}
                  navigation={navigation}
                  storeSection={styles.storeSection}
                  allLocalBestsRestaurants
                />
              )}
            </>
          }
        />
      </MainFrame>
    </MainScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.whiteFA,
  },
  storeSection: {
    paddingBottom: SPACING.medium,
  },
});

export default LocalBests;
