import React, {useContext, useEffect} from 'react';
import {View, StyleSheet, ImageBackground} from 'react-native';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import RoundedButton from '../../components/cores/RoundedButton';
import {ROUTES} from '../../constants/Routes';
import {storeLocalDataObject} from '../../services/Storage/LocalStorageService';
import {API_KEY, LOCAL_STORAGE} from '../../constants/ProjectConstants';
import {IMAGES} from '../../constants/Images';
import {LocationContext} from '../../provider/LocationProvider';
import Geocoder from 'react-native-geocoding';

const GetStarted = ({navigation}) => {
  const locationContext = useContext(LocationContext);

  useEffect(() => {
    //request location permission, if enabled get current position
    locationContext.requestLocationPermission();
    //initialize geocoder
    Geocoder.init(API_KEY.GEO_API_KEY);
  }, []);

  const gotoFood = async () => {
    try {
      const openedAppData = {
        appOpened: 'true',
        instructionsHome: true,
        instructionsFood: true,
        allowNotifications: true,
      };

      await storeLocalDataObject(LOCAL_STORAGE.APP_OPENED, openedAppData);
    } catch (error) {
      console.log('error', error);
    }

    navigation.replace(ROUTES.HOME, {
      toast: true,
    });
  };

  return (
    <MainScreen>
      <MainFrame fullscreen>
        <ImageBackground
          source={IMAGES.ON_BOARDING}
          style={styles.contentContainer}>
          <View style={styles.buttonContainer}>
            <RoundedButton
              text="Get Started"
              iconStyle={{marginRight: 0}}
              icon="chevron-double-right"
              color="white"
              onPress={gotoFood}
            />
          </View>
        </ImageBackground>
      </MainFrame>
    </MainScreen>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '35%',
  },
});

export default GetStarted;
