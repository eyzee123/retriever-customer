import React from 'react';
import {ScrollView, Text, View} from 'react-native';

const scrollPercentage = ({layoutMeasurement, contentOffset, contentSize}) => {
  return (
    ((layoutMeasurement.height + contentOffset.y) / contentSize.height) * 100
  );
};

const PercentageScrollView = ({onReadPercentageChanged, children}) => {
  return (
    <ScrollView
      onScroll={({nativeEvent}) => {
        onReadPercentageChanged(scrollPercentage(nativeEvent));
      }}
      scrollEventThrottle={400}>
      {children}
    </ScrollView>
  );
};

export default PercentageScrollView;
