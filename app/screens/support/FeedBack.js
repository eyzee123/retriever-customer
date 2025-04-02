import React from 'react';
import {View, StyleSheet} from 'react-native';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import FeedBackForm from '../../components/forms/FeedBackForm';
import Header from '../../components/headers/Header';
import {SPACING} from '../../styles/theme';

const FeedBack = ({navigation}) => {
  return (
    <MainScreen>
      <Header
        title="Feedback Form"
        onBackButtonPressed={() => navigation.goBack()}
      />
      <MainFrame fullscreen>
        <View style={styles.container}>
          <FeedBackForm />
        </View>
      </MainFrame>
    </MainScreen>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: SPACING.medium,
    paddingHorizontal: SPACING.medium,
  },
});

export default FeedBack;
