import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import {COLORS, GlobalStyle, SIZES, SPACING} from '../../styles/theme';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {windowHeight} from '../../utils/Dimensions';

const SectionItem = props => {
  return (
    <TouchableOpacity style={styles.sectionItem} onPress={props.onPress}>
      <View style={styles.viewLeft}>
        <Image
          resizeMode="stretch"
          source={props.image}
          style={{height: '100%', width: '100%'}}
        />
      </View>
      <Text style={styles.sectionText}>{props.text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewLeft: {
    height: windowHeight * 0.025,
    width: windowHeight * 0.025,
  },
  sectionText: {
    ...GlobalStyle.sectionLabel,
    fontSize: SIZES._12px,
    color: COLORS.darkGreen,
    marginLeft: SPACING.small,
  },
});

export default SectionItem;
