import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import {BORDER, COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RoundedButton from '../cores/RoundedButton';
import LinearFilters from '../listItem/LinearFilters';

const SearchFilter = ({showModal, closeModal}) => {
  const [btnCategory, setBtnCategory] = useState([
    {title: 'Popular', selected: false},
    {title: 'Price', selected: true},
    {title: 'Food', selected: true},
  ]);
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
  return (
    <Modal
      isVisible={showModal}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      animationInTiming={1000}
      animationOutTiming={1000}
      useNativeDriver={true}
      style={styles.contentContainer}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.headerWrapper}>
            <TouchableOpacity onPress={closeModal}>
              <Icon
                style={styles.icon}
                name="close"
                size={SIZES.iconSize.small}
                color={COLORS.darkGreen}
              />
            </TouchableOpacity>
            <View style={styles.viewCenter}>
              <Text style={styles.txtHeader}>Filters</Text>
            </View>
          </View>
          <View style={styles.categoryContainer}>
            {btnCategory.map((item, index) => {
              return (
                <View style={styles.btnContainer} key={index}>
                  <RoundedButton
                    text={item.title}
                    onPress={() => clickCategory(index)}
                    btnStyle={[
                      styles.btnStyle,
                      {
                        borderBottomColor: item.selected
                          ? COLORS.transparent
                          : COLORS.orange,
                      },
                    ]}
                    btnText={{
                      color: item.selected ? COLORS.darkGreen : COLORS.orange,
                    }}
                    outline
                  />
                </View>
              );
            })}
          </View>
        </View>

        <Text style={styles.sectionLabel}>Popular</Text>
        <LinearFilters
          image={require('../../assets/icons/searchfilter/clock.png')}
          text="Open Now"
          count="99"
        />
        <LinearFilters
          image={require('../../assets/icons/searchfilter/tag.png')}
          text="Best Deals"
          count="99"
          iconStyle={{transform: [{rotate: '90deg'}]}}
        />

        <Text style={styles.sectionLabel}>Price</Text>
        <View style={styles.priceContainer}>
          <View style={[styles.priceWrapper, {marginRight: SPACING.medium}]}>
            <Text style={styles.price}>₱</Text>
          </View>
          <View style={[styles.priceWrapper, {marginRight: SPACING.medium}]}>
            <Text style={styles.price}>₱₱</Text>
          </View>
          <View style={styles.priceWrapper}>
            <Text style={styles.price}>₱₱₱</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Food</Text>
        <LinearFilters
          image={require('../../assets/icons/searchfilter/asian.png')}
          text="Asian"
          count="20"
          imageStyle={{
            height: windowHeight * 0.013,
          }}
        />
        <LinearFilters
          image={require('../../assets/icons/searchfilter/burger.png')}
          text="Burgers"
          count="99"
          imageStyle={{
            height: windowHeight * 0.018,
          }}
        />
        <LinearFilters
          image={require('../../assets/icons/searchfilter/coffee.png')}
          text="Coffee & Tea"
          count="99"
          imageStyle={{
            width: windowHeight * 0.015,
            marginLeft: windowHeight * 0.0025,
            marginRight: windowHeight * 0.002,
          }}
        />
        <LinearFilters
          image={require('../../assets/icons/searchfilter/brunch.png')}
          text="Brunch"
          count="99"
        />
        <LinearFilters
          image={require('../../assets/icons/searchfilter/cake.png')}
          text="Dessert"
          count="99"
        />
      </View>

      <View style={styles.footerContainer}>
        <View style={{flex: 1, marginRight: SPACING.x_small}}>
          <RoundedButton
            text="Reset"
            btnStyle={{
              backgroundColor: COLORS.subTextColor,
              borderRadius: BORDER.roundedCornerInput,
            }}
            btnText={{color: COLORS.subTextColor1}}
          />
        </View>
        <View style={{flex: 1}}>
          <RoundedButton
            text="Apply"
            btnStyle={{
              borderRadius: BORDER.roundedCornerInput,
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: 'center',
  },
  container: {
    width: windowWidth,
    height: windowHeight,
    padding: SPACING.medium,
    backgroundColor: COLORS.white,
  },
  headerContainer: {
    paddingHorizontal: SPACING.medium,
    paddingBottom: SPACING.small,
    borderBottomColor: COLORS.subTextColor1,
    borderBottomWidth: 0.2,
    width: windowWidth,
    alignSelf: 'center',
  },
  headerWrapper: {
    flexDirection: 'row',
  },
  viewCenter: {
    flex: 1,
    alignItems: 'center',
    marginLeft: -SPACING.large,
  },
  txtHeader: {
    ...FONTS.bold,
    fontSize: SIZES.small,
    color: COLORS.darkGreen,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginTop: SPACING.medium,
  },
  btnContainer: {
    marginRight: SPACING.large,
  },
  btnStyle: {
    borderColor: COLORS.white,
    borderBottomColor: COLORS.orange,
    borderRadius: 0,
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: SPACING.x_small,
  },
  sectionLabel: {
    ...FONTS.bold,
    fontSize: SIZES._12px,
    color: COLORS.subTextColor1,
    marginTop: SPACING.medium,
  },
  priceContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.x_small,
  },
  priceWrapper: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.small,
    borderRadius: BORDER.roundedCornerInput,
    borderWidth: 0.3,
    marginTop: SPACING.small,
    borderColor: COLORS.subTextColor1,
  },
  price: {
    ...FONTS.bold,
    color: COLORS.darkGreen,
  },
  footerContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: -SPACING.large,
    paddingVertical: SPACING.medium,
    paddingHorizontal: SPACING.small,
    width: windowWidth,
    borderColor: 'transparent',
    // borderTopColor: COLORS.subTextColor1,
    // borderWidth: 0.2,
    elevation: 1,
  },
});
export default SearchFilter;
