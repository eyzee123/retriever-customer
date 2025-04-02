import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import BagIllustration from '../../assets/images/bag.svg';
import {COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import {windowHeight} from '../../utils/Dimensions';
import {IMAGES} from '../../constants/Images';
const EmptyCart = props => {
  return (
    <View style={styles.cartEmptyContainer}>
      {props.image ? (
        <Image
          resizeMode="stretch"
          source={props.image}
          style={{height: windowHeight * 0.18, width: windowHeight * 0.18}}
        />
      ) : (
        <BagIllustration height={windowHeight * 0.25} />
      )}
      <Text style={styles.sectionTitle}>{props.label}</Text>
      <Text style={styles.sectionSub}>
        {props.sub_label}
        {props.tap_here ? (
          <Text style={[styles.tapHere]} onPress={props.onPress}>
            {' '}
            {props.tap_here}
          </Text>
        ) : null}
      </Text>

      {props.children}
    </View>
  );
};
const styles = StyleSheet.create({
  cartEmptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    ...FONTS.bold,
    fontSize: SIZES._16px,
    color: COLORS.darkGreen,
    marginTop: SPACING.medium,
  },
  sectionSub: {
    ...FONTS.regular,
    fontSize: SIZES._12px,
    color: COLORS.subTextColor1,
    textAlign: 'center',
    marginTop: SPACING.x_small,
  },
  tapHere: {
    ...FONTS.bold,
    color: COLORS.orange,
    fontSize: SIZES._12px,
  },
});

export default EmptyCart;
