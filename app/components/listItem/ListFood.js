import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {BORDER, SPACING, GlobalStyle, SIZES, COLORS} from '../../styles/theme';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import {StoreContext} from '../../provider/StoreProvider';
import GridMenuItem from './GridMenuItem';
import {ROUTES} from '../../constants/Routes';
import ListViewMenuItem from './ListViewMenuItem';

const ListFood = props => {
  const storeContext = useContext(StoreContext);
  const [dataCords, setDataCords] = useState([]);

  const scrollHandler = index => {
    if (dataCords.length > props.scrollIndex) {
      props.refItem.scrollTo({
        x: 0,
        y: dataCords[props.scrollIndex],
        animated: true,
      });
    } else {
      console.log('Out of bounds');
    }
  };

  useEffect(() => {
    scrollHandler();
  }, [props.scrollIndex]);

  return (
    <View style={styles.menuContainer}>
      {storeContext.productLoading ? (
        <View style={{marginLeft: SPACING.medium}}>
          <SkeletonPlaceholder borderRadius={4}>
            <View style={styles.skeletonCategory} />
            <View style={styles.foodContainer}>
              {[1, 2, 3].map((item, index) => {
                return (
                  <View style={{width: '50%'}} key={index}>
                    <View style={styles.skeleton} />
                    <View style={styles.skeletonText} />
                  </View>
                );
              })}
            </View>
          </SkeletonPlaceholder>
        </View>
      ) : (
        props.categoryData
          .sort((a, b) => b.name < a.name)
          .map((item, index) => (
            <View
              style={styles.container}
              key={index}
              onLayout={event => {
                const layout = event.nativeEvent.layout;
                dataCords[index] = layout.y + windowHeight * 0.47;
                setDataCords(dataCords);
                // console.log('datacords', dataCords);
                // console.log('height: ', layout.height);
                // console.log('width: ', layout.width);
                // console.log('x: ', layout.x);
                // console.log('y: ', layout.y);
              }}>
              <Text style={styles.sectionLabel}>{item.name}</Text>
              <View style={styles.productListContainer}>
                {props.store.products
                  .filter(
                    product =>
                      product.productType == item.name &&
                      product.productPicture != '',
                  )
                  .map((item, index) => (
                    <View style={styles.gridContainer} key={index}>
                      <GridMenuItem
                        image={{uri: item.productPicture}}
                        name={item.productName}
                        actual_price={`₱${item.productPrice}`}
                        storeStatus={props.storeStatus}
                        // promo
                        onPress={() =>
                          props.navigation.navigate(ROUTES.ADD_TO_CART, {
                            action: '',
                            store: props.store,
                            product: item,
                          })
                        }
                      />
                    </View>
                  ))}
              </View>
              <View style={styles.listViewContainer}>
                {props.store.products
                  .filter(
                    product =>
                      product.productType == item.name &&
                      product.productPicture == '',
                  )
                  .map((item, index) => (
                    <View key={index}>
                      <ListViewMenuItem
                        productName={item.productName}
                        actual_price={`₱${item.productPrice.toFixed(2)}`}
                        onPress={() =>
                          props.navigation.navigate(ROUTES.ADD_TO_CART, {
                            action: '',
                            store: props.store,
                            product: item,
                          })
                        }
                      />
                    </View>
                  ))}
              </View>
            </View>
          ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonCategory: {
    width: '50%',
    height: '5%',
    marginTop: SPACING.medium,
  },
  skeletonText: {
    width: '50%',
    height: '5%',
    marginTop: SPACING.small,
  },
  skeleton: {
    borderRadius: BORDER.roundedCornerBox,
    height: windowHeight * 0.2,
    width: windowWidth * 0.435,
    marginTop: SPACING.medium,
  },
  menuContainer: {
    flex: 1,
    marginTop: SPACING.large,
  },
  container: {
    marginLeft: SPACING.medium,
    marginBottom: SPACING.x_large,
  },
  foodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridContainer: {
    width: '50%',
    marginBottom: SPACING.x_small,
  },
  listViewContainer: {
    marginRight: SPACING.medium,
  },
  sectionLabel: {
    ...GlobalStyle.sectionLabel,
    fontSize: SIZES._20px,
    color: COLORS.tertiary,
  },
  productListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default ListFood;
