import React, {useState} from 'react';
import {View, StyleSheet, Text, Image, FlatList} from 'react-native';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import RoundedButton from '../../components/cores/RoundedButton';
import {BORDER, COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ROUTES} from '../../constants/Routes';

const Call = ({navigation}) => {
  const [call, setCall] = useState('Call');
  const callAnswer = () => {
    setCall('Answer');
  };

  return (
    <MainScreen>
      <MainFrame fullscreen>
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image
              resizeMode="stretch"
              source={require('../../assets/images/users/person.png')}
              style={styles.image}
            />
          </View>
          <Text style={styles.riderName}>Juan de la Cruz Jr.</Text>
          <View style={styles.unitContainer}>
            <Text style={styles.riderUnit}>Motorcycle</Text>
            <Text style={styles.bullet}> • </Text>
            <Text style={styles.riderUnit}>GAA 7654</Text>
          </View>
          <View style={styles.btnCallContainer}>
            {call == 'Call' ? (
              <>
                <View style={styles.btnCallWrapper}>
                  <RoundedButton
                    icon="phone-hangup"
                    iconStyle={styles.iconStyle}
                    btnStyle={styles.btnStyle}
                    onPress={() => navigation.goBack()}
                  />
                  <Text style={styles.accept}>Decline</Text>
                </View>
                <View style={styles.btnCallWrapper}>
                  <RoundedButton
                    icon="phone-hangup"
                    iconStyle={styles.iconStyle}
                    btnStyle={[
                      styles.btnStyle,
                      {
                        backgroundColor: '#27AE60',
                        transform: [{rotate: '225deg'}],
                      },
                    ]}
                    onPress={callAnswer}
                  />
                  <Text style={styles.accept}>Accept</Text>
                </View>
              </>
            ) : (
              <>
                <Icon
                  name="volume-high"
                  size={windowHeight * 0.045}
                  color={COLORS.subTextColor1}
                />
                <View style={styles.btnCallWrapper}>
                  <RoundedButton
                    icon="phone-hangup"
                    iconStyle={styles.iconStyle}
                    btnStyle={styles.btnStyle}
                    onPress={() => navigation.goBack()}
                  />
                </View>
                <Icon
                  name="microphone"
                  size={windowHeight * 0.045}
                  color={COLORS.subTextColor1}
                />
              </>
            )}
          </View>
        </View>
      </MainFrame>
    </MainScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    padding: SPACING.small,
    backgroundColor: COLORS.subTextColor,
    borderRadius: 200,
  },
  image: {
    height: windowHeight * 0.2,
    width: windowHeight * 0.2,
    borderRadius: BORDER.circle,
  },
  riderName: {
    ...FONTS.bold,
    color: COLORS.darkGreen,
    marginTop: SPACING.x_small,
  },
  unitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riderUnit: {
    ...FONTS.regular,
    fontSize: SIZES._12px,
    color: COLORS.subTextColor1,
  },
  bullet: {
    color: COLORS.tertiary,
  },
  btnCallContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: windowWidth,
    marginTop: SPACING.xxxx_large,
  },
  btnCallWrapper: {
    marginHorizontal: SPACING.xx_large,
    alignItems: 'center',
  },
  iconStyle: {
    marginRight: 0,
  },
  btnStyle: {
    backgroundColor: '#EB5757',
    borderRadius: 100,
    padding: SPACING.medium,
  },
  accept: {
    ...FONTS.bold,
    color: COLORS.darkGreen,
  },
});

export default Call;
