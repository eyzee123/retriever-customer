import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {FAB} from 'react-native-paper';

const FabButton = props => {
  return (
    <View style={styles(props).container}>
      <FAB
        style={styles(props).fab}
        small
        icon="plus"
        onPress={() => console.log('Pressed')}
      />
    </View>
  );
};
const styles = props =>
  StyleSheet.create({
    container: {},
    fab: {},
  });
export default FabButton;
