import React, {useState, useContext} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import CustomSwitch from '../../components/general/CustomSwitch';
import Header from '../../components/headers/Header';
import CustomDropdown from '../../components/general/CustomDropdown';
import {COLORS, FONTS, SPACING} from '../../styles/theme';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import {updateShowInstructions} from '../../services/Storage/LocalStorageService';
import {LOCAL_STORAGE} from '../../constants/ProjectConstants';
import {UserContext} from '../../provider/UserProvider';
import PushNotification from 'react-native-push-notification';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import {COLLECTION} from '../../constants/Collections';
import RoundedButton from '../../components/cores/RoundedButton';

const Settings = props => {
  const userCtx = useContext(UserContext);

  const language = [
    {
      label: 'English',
      value: '1',
    },
  ];
  const [value, setValue] = useState('1');

  const selectLanguage = item => {
    setValue(item.value);
  };

  const toggleSwitchAllowNotif = async () => {
    const currentUSer = auth().currentUser;
    if (userCtx.allowNotifications) {
      updateShowInstructions(
        LOCAL_STORAGE.APP_OPENED,
        userCtx.showModalInstructionsFood,
        userCtx.showModalInstructionsHome,
        false,
      );
      PushNotification.abandonPermissions();
      userCtx.setAllowNotifications(false);
    } else {
      updateShowInstructions(
        LOCAL_STORAGE.APP_OPENED,
        userCtx.showModalInstructionsFood,
        userCtx.showModalInstructionsHome,
        true,
      );
      // PushNotification.requestPermissions();

      const tokensCollection = firestore().collection(COLLECTION.FCM_TOKEN);
      const date = firestore.FieldValue.serverTimestamp();

      const token = await messaging().getToken();
      console.log('register token success', token);
      const data = {
        token,
        createdAt: date,
        updatedAt: date,
      };
      await tokensCollection.doc(currentUSer.uid).set(data);

      userCtx.setAllowNotifications(true);
    }
  };

  const toggleSwitch = () => {
    if (userCtx.showModalInstructionsSettings) {
      updateShowInstructions(
        LOCAL_STORAGE.APP_OPENED,
        false,
        false,
        userCtx.allowNotifications,
      );
      userCtx.setModalInstructionsSettings(false);
    } else {
      updateShowInstructions(
        LOCAL_STORAGE.APP_OPENED,
        true,
        true,
        userCtx.allowNotifications,
      );
      userCtx.setModalInstructionsSettings(true);
    }
  };

  return (
    <MainScreen>
      <Header title="Settings" icon="chevron-back-outline" />
      <MainFrame fullscreen>
        <View style={styles.container}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionLabel}>Language</Text>
            <CustomDropdown
              data={language}
              value={value}
              onChange={selectLanguage}
              width={'35%'}
              dropdownStyle={styles.dropdownStyle}
              selectStyle={{textAlign: 'right', color: COLORS.orange}}
            />
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionLabel}>Push notifications</Text>
            <CustomSwitch
              isOn={userCtx.allowNotifications}
              onToggle={toggleSwitchAllowNotif}
              onColor={COLORS.orange}
            />
          </View>
          {/* <View style={styles.sectionContainer}>
            <Text style={styles.sectionLabel}>Show startup instructions</Text>
            <CustomSwitch
              isOn={userCtx.showModalInstructionsSettings}
              onToggle={toggleSwitch}
              onColor={COLORS.orange}
            />
          </View> */}
        </View>
      </MainFrame>
    </MainScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.medium,
  },
  sectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: COLORS.subTextColor,
    borderBottomWidth: 1,
    paddingBottom: SPACING.small,
    marginTop: SPACING.medium,
    paddingHorizontal: SPACING.medium,
  },
  sectionLabel: {
    ...FONTS.bold,
  },
  dropdownStyle: {
    borderColor: COLORS.transparent,
    marginBottom: -windowHeight * 0.006,
    marginRight: -windowWidth * 0.026,
  },
});

export default Settings;
