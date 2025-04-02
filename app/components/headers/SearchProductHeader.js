import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {BORDER, COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SearchInput from '../cores/SearchInput';
import {useNavigation} from '@react-navigation/native';
import {StoreContext} from '../../provider/StoreProvider';

const SearchProductHeader = props => {
  const navigation = useNavigation();
  const goBack = () => {
    navigation.goBack();
  };
  const searcHandler = text => {
    props.onSearch(text);
  };
  return (
    <SafeAreaView style={[styles.container, props.conatinerStyle]}>
      <View style={styles.contentContainer}>
        <TouchableOpacity onPress={goBack} style={styles.viewLeft}>
          <Icon
            style={styles.icon}
            name="chevron-left"
            size={windowHeight * 0.04}
            color={COLORS.orange}
            // onPress={goBack}
          />
        </TouchableOpacity>
        <View style={styles.addAddressContainer}>
          <SearchInput
            placeholder={props.placeholder}
            onChangeText={searcHandler}
            returnKeyType="search"
            onSubmitSearch={props.onSubmitSearch}
            onActiveSearch={props.onActiveSearch}
            outline
          />
        </View>
        {/* <TouchableOpacity onPress={props.onPress} style={styles.viewRight}>
          <Icon
            style={styles.icon}
            name="tune"
            size={SIZES.iconSize.medium}
            color={COLORS.orange}
          />
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    backgroundColor: COLORS.white,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.medium,
  },
  addAddressContainer: {
    flex: 1,
    marginHorizontal: SPACING.x_small,
  },
  txtHeader: {
    ...FONTS.bold,
    color: COLORS.white,
  },
  viewLeft: {
    borderRadius: BORDER.circle,
    marginLeft: -windowWidth * 0.02,
  },
  viewRight: {
    borderRadius: BORDER.circle,
    padding: windowHeight * 0.004,
  },
});

export default SearchProductHeader;
