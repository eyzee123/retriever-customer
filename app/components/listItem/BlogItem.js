import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {BORDER, COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import {windowHeight} from '../../utils/Dimensions';

const BlogItem = props => {
  return (
    <View style={styles.container}>
      <Image source={props.image} style={styles.image} resizeMode="cover" />
      <View style={styles.details}>
        <Text style={styles.blogItemTitle} numberOfLines={1}>
          {props.title}
        </Text>
        <Text style={styles.blogItemDesc} numberOfLines={4}>
          {props.body}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: windowHeight * 0.139,
    borderRadius: BORDER.roundedCornerBox,
    backgroundColor: COLORS.cardBackground,
    marginBottom: SPACING.small,
  },
  image: {
    width: '40%',
    height: '100%',
    resizeMode: 'cover',
    borderTopLeftRadius: BORDER.roundedCornerBox,
    borderBottomLeftRadius: BORDER.roundedCornerBox,
  },
  details: {
    flex: 1,
    margin: SPACING.small,
  },
  blogItemTitle: {
    ...FONTS.bold,
    color: COLORS.tertiary,
    fontSize: SIZES._12px,
  },
  blogItemDesc: {
    ...FONTS.regular,
    fontSize: SIZES._10px,
    color: COLORS.tertiary,
    marginTop: windowHeight * 0.005,
    textAlign: 'justify',
  },
});
export default BlogItem;
