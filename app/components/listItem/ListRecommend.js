import React, {useContext} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import GridStoreItem from './GridStoreItem';
import {StoreContext} from '../../provider/StoreProvider';
import {SPACING} from '../../styles/theme';
import {ROUTES} from '../../constants/Routes';
import {AddressContext} from '../../provider/AddressProvider';
import {getSpecificDistance} from '../../utils/HelperFunctions';

const ListRecommend = props => {
  const storeContext = useContext(StoreContext);
  const addressContext = useContext(AddressContext);
  const {primaryAddress} = addressContext;

  const origin = {
    latitude: primaryAddress.coordinates?.latitude,
    longitude: primaryAddress.coordinates?.longitude,
  };

  const filteredStoresLength = () => {
    const filteredStoreList = storeContext.storeList.filter(item =>
      item.status == 'open' &&
      origin.latitude !== undefined &&
      origin.longitude !== undefined
        ? getSpecificDistance(origin, {
            latitude: item.latitude,
            longitude: item.longitude,
          }) <= 4
        : null,
    );

    return filteredStoreList.length;
  };

  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      horizontal={true}
      data={storeContext.storeList
        .filter(item =>
          item.status == 'open' &&
          origin.latitude !== undefined &&
          origin.longitude !== undefined
            ? getSpecificDistance(origin, {
                latitude: item.latitude,
                longitude: item.longitude,
              }) <= 4
            : null,
        )
        .sort((a, b) => b.storeName > a.storeName)}
      renderItem={({item, index}) =>
        index < 5 && (
          <View style={styles.recommendSection} key={index}>
            <GridStoreItem
              storeName={item.storeName}
              storeImage={{uri: item.storeCoverPhoto}}
              storeLength={
                filteredStoresLength() < 5 ? filteredStoresLength() : 5
              }
              storeIndex={index}
              prepare_time={item.preparationTime}
              // promo
              onPress={() =>
                props.navigation.navigate(ROUTES.RESTAURANT_PROFILE, {
                  store: item,
                })
              }
            />
          </View>
        )
      }
    />
  );
};

const styles = StyleSheet.create({
  recommendSection: {
    marginTop: SPACING.small,
  },
  // container: {
  //   height: windowHeight * 0.2,
  //   width: windowWidth * 0.43,
  //   borderRadius: BORDER.roundedCornerBox,
  //   marginLeft: SPACING.medium,
  //   marginRight: -SPACING.x_small,
  // },
});

export default ListRecommend;
