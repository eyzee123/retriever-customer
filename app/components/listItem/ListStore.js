import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import LinearStoreItem from './LinearStoreItem';
import {StoreContext} from '../../provider/StoreProvider';
import {ROUTES} from '../../constants/Routes';
import {windowHeight} from '../../utils/Dimensions';
import {BORDER, SPACING} from '../../styles/theme';
import {AddressContext} from '../../provider/AddressProvider';
import {getSpecificDistance} from '../../utils/HelperFunctions';

const ListStore = props => {
  const addressContext = useContext(AddressContext);
  const {primaryAddress} = addressContext;
  const storeContext = useContext(StoreContext);

  const origin = {
    latitude: primaryAddress.coordinates?.latitude,
    longitude: primaryAddress.coordinates?.longitude,
  };

  const listStores = (item, index) => (
    <View key={index}>
      <LinearStoreItem
        storeName={item.storeName}
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
        onPress={() =>
          props.navigation.navigate(ROUTES.RESTAURANT_PROFILE, {
            store: item,
          })
        }
      />
    </View>
  );

  return (
    <View style={[styles.storeSection, props.storeSection]}>
      {storeContext.isLoading
        ? [1, 2, 3].map(({item, index}) => (
            <SkeletonPlaceholder borderRadius={4} key={index}>
              <View style={styles.container} />
            </SkeletonPlaceholder>
          ))
        : storeContext?.storeList
            .filter(item =>
              props.selectedCategoryRestaurants
                ? props.selectedCategoryRestaurants == item.type &&
                  origin.latitude !== undefined &&
                  origin.longitude !== undefined
                  ? getSpecificDistance(origin, {
                      latitude: item.latitude,
                      longitude: item.longitude,
                    }) <= 4
                  : null
                : props.topRestaurants
                ? item.storeRating.averageRatings != 0 &&
                  item.status == 'open' &&
                  origin.latitude !== undefined &&
                  origin.longitude !== undefined
                  ? getSpecificDistance(origin, {
                      latitude: item.latitude,
                      longitude: item.longitude,
                    }) <= 4
                  : null
                : props.allTopRestaurants
                ? item.storeRating.averageRatings != 0 &&
                  origin.latitude !== undefined &&
                  origin.longitude !== undefined
                  ? getSpecificDistance(origin, {
                      latitude: item.latitude,
                      longitude: item.longitude,
                    }) <= 4
                  : null
                : props.localBests
                ? item.status == 'open' &&
                  origin.latitude !== undefined &&
                  origin.longitude !== undefined
                  ? getSpecificDistance(origin, {
                      latitude: item.latitude,
                      longitude: item.longitude,
                    }) <= 4
                  : null
                : item &&
                  origin.latitude !== undefined &&
                  origin.longitude !== undefined
                ? getSpecificDistance(origin, {
                    latitude: item.latitude,
                    longitude: item.longitude,
                  }) <= 4
                : null,
            )
            .sort((a, b) =>
              props.topRestaurants
                ? b.storeRating.averageRatings > a.storeRating.averageRatings
                : a,
            )
            .map((item, index) => {
              if (index < props.topRestaurants || index < props.localBests) {
                return listStores(item, index);
              }
              if (props.allTopRestaurants || props.allLocalBestsRestaurants) {
                return listStores(item, index);
              }
            })}
    </View>
  );
};

const styles = StyleSheet.create({
  storeSection: {
    paddingBottom: SPACING.small,
  },
  container: {
    height: windowHeight * 0.2,
    marginTop: SPACING.small,
    borderRadius: BORDER.roundedCornerBox,
    marginHorizontal: SPACING.medium,
  },
});

export default ListStore;
