import React, {useContext} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {BORDER, SPACING, COLORS, SIZES} from '../../styles/theme';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import {StoreContext} from '../../provider/StoreProvider';
import RoundedButton from '../cores/RoundedButton';
import Animated, {FadeInLeft, FadeOutLeft} from 'react-native-reanimated';
import {IMAGES} from '../../constants/Images';

const CategoryList = props => {
  const storeContext = useContext(StoreContext);

  return (
    <View style={[styles(props).categoryContainer, props.categoryContainer]}>
      {storeContext.categoryLoading ? (
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={[1, 2, 3]}
          renderItem={({item, index}) => (
            <SkeletonPlaceholder borderRadius={4} key={index}>
              <View style={styles(props).categorySkeleton} />
            </SkeletonPlaceholder>
          )}
        />
      ) : (
        <View style={styles(props).rowContainer}>
          {props.categoryID !== '0' && (
            <TouchableOpacity onPress={props.onCancel}>
              <Animated.View
                entering={FadeInLeft.duration(400)}
                exiting={FadeOutLeft.duration(400)}
                style={styles(props).iconAnimateStyle}>
                <Image source={IMAGES.CANCEL1} style={styles(props).cancel} />
              </Animated.View>
            </TouchableOpacity>
          )}

          {props.categoryID !== '0' ? (
            <View style={styles(props).btnContainer}>
              <RoundedButton
                text={props.categoryName}
                btnText={[
                  styles(props).btnText,
                  {
                    marginTop: Platform.OS === 'ios' ? windowHeight * 0.006 : 0,
                  },
                ]}
                btnStyle={styles(props).btnStyle}
                btnTextContainer={styles(props).btnTextContainer}
                outline
              />
            </View>
          ) : (
            <FlatList
              data={props.data}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({item, index}) => (
                <View
                  style={[
                    styles(props).btnContainer,
                    {
                      marginLeft: index == 0 ? SPACING.medium : SPACING.small,
                      marginRight:
                        props.data.length - 1 == index ? SPACING.medium : 0,
                    },
                  ]}
                  key={index}>
                  <RoundedButton
                    text={item.name}
                    btnText={[
                      styles(props).btnText1,
                      {
                        marginTop:
                          Platform.OS === 'ios' ? windowHeight * 0.006 : 0,
                      },
                    ]}
                    btnStyle={[
                      styles(props).btnStyle,
                      styles(props).btnDefault,
                    ]}
                    btnTextContainer={styles(props).btnTextContainer}
                    outline
                    onPress={() => props.selectCategory(item)}
                  />
                </View>
              )}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = props =>
  StyleSheet.create({
    categoryContainer: {
      flex: 1,
      flexDirection: 'row',
      paddingTop: SPACING.x_small,
      backgroundColor: COLORS.white,
    },
    categorySkeleton: {
      borderRadius: BORDER.roundedCornerBox,
      height: windowHeight * 0.03,
      width: windowWidth * 0.3,
      marginTop: SPACING.small,
      marginLeft: SPACING.medium,
    },
    iconAnimateStyle: {
      marginLeft: SPACING.medium,
      marginRight: -SPACING.x_small,
    },
    cancel: {
      height: windowHeight * 0.044,
      width: windowHeight * 0.044,
    },
    btnContainer: {
      marginLeft: SPACING.medium,
    },
    btnText: {
      color: COLORS.white,
      fontSize: SIZES._12px,
    },
    btnText1: {
      color: COLORS.subTextColor1,
      fontSize: SIZES._12px,
    },
    btnStyle: {
      borderRadius: BORDER.roundedCornerInput,
      paddingTop: windowHeight * 0.005,
      paddingBottom: windowHeight * 0.007,
      backgroundColor: COLORS.orange,
      borderColor: COLORS.transparent,
      paddingHorizontal: SPACING.medium,
    },
    btnTextContainer: {
      paddingVertical: windowWidth * 0.008,
    },
    btnDefault: {
      backgroundColor: COLORS.grayEC,
    },
    rowContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

export default CategoryList;
