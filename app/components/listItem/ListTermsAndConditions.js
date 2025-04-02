import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {FONTS, SIZES, SPACING} from '../../styles/theme';
import {windowHeight} from '../../utils/Dimensions';

const ListTermsAndConditions = props => {
  return (
    <View>
      {props.keyword ? (
        <View style={styles(props).bodyWrapper1}>
          {props.sectionNumber ? (
            <Text style={styles(props).sectionNumber}>
              {props.sectionNumber}{' '}
            </Text>
          ) : null}
          <Text style={styles(props).body}>
            <Text style={{fontStyle: 'italic'}}>{props.keyword}</Text>
            {props.body}
          </Text>
        </View>
      ) : (
        <View style={styles(props).bodyWrapper}>
          {props.sectionNumber ? (
            <Text style={styles(props).sectionNumber}>
              {props.sectionNumber}{' '}
            </Text>
          ) : null}
          <Text style={[styles(props).body, props.fontStyle]}>
            {props.body}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = props =>
  StyleSheet.create({
    bodyWrapper: {
      flexDirection: 'row',
      marginTop: SPACING.x_small,
    },
    bodyWrapper1: {
      flexDirection: 'row',
      marginTop: SPACING.x_small,
      marginLeft: windowHeight * 0.038,
    },
    sectionNumber: {
      ...FONTS.regular,
      fontSize: SIZES._14px,
      marginRight: SPACING.x_small,
    },
    body: {
      flex: 1,
      ...FONTS.regular,
      fontSize: SIZES._14px,
      textAlign: 'justify',
    },
    subBody: {
      flex: 1,
      ...FONTS.regular,
      fontSize: SIZES._14px,
      textAlign: 'justify',
    },
  });

export default ListTermsAndConditions;
