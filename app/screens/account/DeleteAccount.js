import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import MainScreen from '../../components/containers/MainScreen';
import MainFrame from '../../components/containers/MainFrame';
import Header from '../../components/headers/Header';
import {COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import ListDeleteReason from '../../components/listItem/ListDeleteReason';
import {ROUTES} from '../../constants/Routes';

const DeleteAccount = ({navigation}) => {
  const deleteReasons = [
    {
      title: 'Data privacy concerns',
      body: 'Maybe we can assure you by reading our terms and conditions.',
      link: ROUTES.TERMS_AND_CONDITIONS,
    },
    {
      title: 'Personal Info Changes',
      body: 'You can contact our support system that will help you update your personal info here.',
      link: ROUTES.REQUEST,
    },
    {
      title: 'Other reasons',
      body: 'If you really wish to delete your account, you can access it here to process delete request.',
      link: ROUTES.REQUEST,
    },
  ];

  return (
    <MainScreen>
      <Header title="Delete Account" />
      <MainFrame fullscreen>
        <View style={styles.container}>
          <Text style={styles.title}>Reason for delete</Text>
          <Text style={styles.subTitle}>
            Care to tell us the reason of your account deletion?
          </Text>
          {deleteReasons.map((item, index) => (
            <View style={styles.listContainer} key={index}>
              <ListDeleteReason
                title={item.title}
                body={item.body}
                onPress={() => navigation.navigate(item.link, {index: index})}
              />
            </View>
          ))}
        </View>
      </MainFrame>
    </MainScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.medium,
  },
  title: {
    ...FONTS.bold,
    color: COLORS.darkGreen,
    fontSize: SIZES._18px,
  },
  subTitle: {
    ...FONTS.regular,
    color: COLORS.darkGreen,
    fontSize: SIZES._14px,
    marginBottom: SPACING.small,
  },
  listContainer: {
    marginTop: SPACING.small,
  },
});

export default DeleteAccount;
