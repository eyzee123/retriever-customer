import React, {useContext} from 'react';
import {View, StyleSheet, Platform, ScrollView, FlatList} from 'react-native';
import {BORDER, SPACING, COLORS, SIZES} from '../../styles/theme';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import RoundedButton from '../cores/RoundedButton';
import {useNavigation} from '@react-navigation/native';
import Labels from '../../constants/Labels';
import {StoreContext} from '../../provider/StoreProvider';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const CategoryProfile = props => {
  const navigation = useNavigation();
  const storeContext = useContext(StoreContext);

  return (
    <View style={styles(props).categoryContainer}>
      {storeContext.productLoading ? (
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
        <ScrollView showsHorizontalScrollIndicator={false} horizontal>
          <View style={styles(props).rowContainer}>
            {props.data
              .filter(item =>
                !props.isLoggedIn ? item.name != Labels.history : item,
              )
              .map((item, index) => (
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
                    activeOpacity={item.name == 'Errands' ? 1 : 0}
                    btnText={[
                      styles(props).btnText,
                      {
                        marginTop:
                          Platform.OS === 'ios' ? windowHeight * 0.006 : 0,
                        color:
                          item.name == 'Foods' ||
                          item.name == 'Profile' ||
                          item.name == 'Login Account'
                            ? COLORS.white
                            : props.selectedCategory == item.name
                            ? COLORS.white
                            : COLORS.subTextColor1,
                      },
                    ]}
                    btnStyle={[
                      styles(props).btnStyle,
                      {
                        backgroundColor:
                          // props.selectedCategory == item.name
                          item.name == 'Foods' ||
                          item.name == 'Profile' ||
                          item.name == 'Login Account'
                            ? COLORS.orange
                            : props.selectedCategory == item.name
                            ? COLORS.orange
                            : COLORS.grayEC,
                      },
                      props.btnStyle,
                    ]}
                    btnTextContainer={styles(props).btnTextContainer}
                    outline
                    onPress={
                      props.selectCategory
                        ? () => props.selectCategory(item, index)
                        : () => navigation.navigate(item.navigate)
                    }
                  />
                </View>
              ))}
          </View>
        </ScrollView>
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
      backgroundColor: props.colored ? COLORS.white : COLORS.transparent,
    },
    categorySkeleton: {
      borderRadius: BORDER.roundedCornerBox,
      height: windowHeight * 0.03,
      width: windowWidth * 0.3,
      marginTop: SPACING.small,
      marginLeft: SPACING.medium,
    },
    btnContainer: {
      marginLeft: SPACING.medium,
    },
    btnText: {
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
    rowContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

export default CategoryProfile;
