import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  Animated,
  SafeAreaView,
  Platform,
} from 'react-native';
import {
  BORDER,
  COLORS,
  FONTS,
  GlobalStyle,
  SIZES,
  SPACING,
} from '../../styles/theme';
import Icon from 'react-native-vector-icons/Feather';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import {useNavigation} from '@react-navigation/native';
import RoundedButton from '../../components/cores/RoundedButton';
import {ROUTES} from '../../constants/Routes';
import LinearGradient from 'react-native-linear-gradient';

const Status = ({route}) => {
  const navigation = useNavigation();
  const {store} = route.params;
  const {status} = route.params;
  const stories = store.stories;
  const type = 'Cafe';
  const branch = 'Matina Branch';
  const [current, setCurrent] = useState({data: stories[0], index: 0});

  useEffect(() => {
    let timer = setTimeout(() => {
      if (current.index === stories.length - 1) {
        return status === 'restoProfile'
          ? navigation.goBack()
          : status === 'restoInfo'
          ? navigation.navigate(ROUTES.RESTAURANT_INFO, {store: store})
          : status === 'listcurrentorder'
          ? navigation.navigate(ROUTES.CURRENT_ORDERS)
          : status === 'cart'
          ? navigation.navigate(ROUTES.CART)
          : navigation.navigate(ROUTES.FOOD);
      }
      setCurrent({
        ...current,
        index: current.index + 1,
        data: stories[current.index + 1],
      });
    }, 10000);
    return () => clearTimeout(timer);
  }, [current]);

  const ProgressView = () => {
    const progressAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
      Animated.timing(progressAnim, {
        toValue: (windowWidth - 40) / stories.length,
        duration: 10000,
        useNativeDriver: false,
      }).start();
    }, [progressAnim]);
    return (
      <Animated.Text
        style={{
          backgroundColor: 'white',
          width: progressAnim,
          borderRadius: BORDER.roundedCornerBox,
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        useAngle={true}
        angle={360}
        colors={COLORS.gradientColorBlack}
        style={[styles.gradientStyle, {height: windowHeight * 0.5}]}
      />
      <View style={styles.safeArea}>
        {/* <StatusBar backgroundColor="black" barStyle="light-content" /> */}
        <View style={styles.imageContainer}>
          {status === 'restoProfile' || status === 'restoInfo' ? (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View style={styles.imageWrapper}>
                <Image
                  source={{
                    uri: store.storeProfilePhoto,
                  }}
                  style={styles.image}
                />
              </View>
              <View style={{marginLeft: SPACING.small}}>
                <Text style={styles.store}>{store.storeName}</Text>
                <Text style={styles.branch}>{store.type}</Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={async () => {
                if (status === 'listcurrentorder') {
                  await navigation.navigate(ROUTES.CURRENT_ORDERS),
                    await navigation.navigate(ROUTES.RESTAURANT_PROFILE, {
                      store: store,
                    });
                } else {
                  await navigation.navigate(ROUTES.FOOD),
                    await navigation.navigate(ROUTES.RESTAURANT_PROFILE, {
                      store: store,
                    });
                }
              }}>
              <View style={styles.imageWrapper}>
                <Image
                  source={{
                    uri: store.storeProfilePhoto,
                  }}
                  style={styles.image}
                />
              </View>
              <View style={{marginLeft: SPACING.small}}>
                <Text style={styles.store}>{store.storeName}</Text>
                <Text style={styles.branch}>{store.type}</Text>
              </View>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() =>
              status === 'restoProfile'
                ? navigation.goBack()
                : status === 'restoInfo'
                ? navigation.navigate(ROUTES.RESTAURANT_INFO, {store: store})
                : status === 'listcurrentorder'
                ? navigation.navigate(ROUTES.CURRENT_ORDERS)
                : status === 'cart'
                ? navigation.navigate(ROUTES.CART)
                : navigation.navigate('Food')
            }>
            <Icon name="x" color={COLORS.white} size={SIZES.iconSize.medium} />
          </TouchableOpacity>
        </View>

        <View style={styles.loadingContainer}>
          {stories?.map((item, index) => (
            <View
              style={[
                styles.loadingWrapper,
                {marginHorizontal: windowWidth * 0.005},
              ]}
              key={index}>
              {current.index === index ? <ProgressView /> : null}
            </View>
          ))}
        </View>
      </View>
      <Image
        resizeMode="cover"
        source={{uri: current.data?.url}}
        style={styles.storyImage}
      />
      <TouchableOpacity
        onPress={() => {
          if (current.index === 0) {
            return status === 'restoProfile'
              ? navigation.goBack()
              : status === 'restoInfo'
              ? navigation.navigate(ROUTES.RESTAURANT_INFO, {store: store})
              : status === 'listcurrentorder'
              ? navigation.navigate(ROUTES.CURRENT_ORDERS)
              : status === 'cart'
              ? navigation.navigate(ROUTES.CART)
              : navigation.navigate('Food');
          }
          setCurrent({
            ...current,
            index: current.index - 1,
            data: stories[current.index - 1],
          });
        }}
        style={[styles.controller, {left: 0}]}
      />
      <TouchableOpacity
        onPress={() => {
          if (current.index === stories.length - 1) {
            return status === 'restoProfile'
              ? navigation.goBack()
              : status === 'restoInfo'
              ? navigation.navigate(ROUTES.RESTAURANT_INFO, {store: store})
              : status === 'listcurrentorder'
              ? navigation.navigate(ROUTES.CURRENT_ORDERS)
              : status === 'cart'
              ? navigation.navigate(ROUTES.CART)
              : navigation.navigate('Food');
          }
          setCurrent({
            ...current,
            index: current.index + 1,
            data: stories[current.index + 1],
          });
        }}
        style={[styles.controller, {right: 0}]}
      />
      <View style={styles.footer}>
        <LinearGradient
          useAngle={true}
          angle={180}
          colors={COLORS.gradientColorBlack}
          style={styles.gradientStyle}
        />
        {/* <TouchableOpacity style={styles.likesContainer}>
          <Icon name="heart" color={COLORS.white} size={windowHeight * 0.04} />
          <Text style={styles.likes}>2.5k</Text>
        </TouchableOpacity> */}
        <View style={styles.btnContainer}>
          <RoundedButton
            btnStyle={{backgroundColor: 'white'}}
            text="Order Now"
            btnText={{color: COLORS.darkGreen}}
            onPress={async () => {
              await navigation.navigate(ROUTES.FOOD),
                await navigation.navigate(ROUTES.RESTAURANT_PROFILE, {
                  store: store,
                });
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    height: '100%',
  },
  safeArea: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? SPACING.x_large : 0,
    height: windowHeight * 0.4,
  },
  imageContainer: {
    padding: SPACING.medium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    width: '100%',
    top: 0,
    left: 0,
  },
  imageWrapper: {
    borderRadius: BORDER.circle,
    width: windowHeight * 0.058,
    height: windowHeight * 0.058,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    borderRadius: BORDER.circle,
    resizeMode: 'cover',
    width: '92%',
    height: '92%',
    zIndex: 1,
  },
  store: {
    ...FONTS.bold,
    color: COLORS.white,
  },
  branch: {
    ...FONTS.regular,
    color: COLORS.white,
    fontSize: SIZES._12px,
  },
  loadingContainer: {
    flexDirection: 'row',
    width: '92%',
    position: 'absolute',
    top: windowHeight * 0.105,
  },
  loadingWrapper: {
    flex: 1,
    height: windowHeight * 0.004,
    borderRadius: BORDER.roundedCornerBox,
    backgroundColor: 'gray',
  },
  storyImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  controller: {
    position: 'absolute',
    width: windowWidth / 2,
    height: windowHeight * 0.85,
    bottom: 0,
  },
  likesContainer: {
    position: 'absolute',
    bottom: SPACING.xxx_large,
    right: SPACING.large,
    alignItems: 'center',
  },
  likes: {
    ...GlobalStyle.sectionLabel,
    color: COLORS.white,
  },
  btnContainer: {
    position: 'absolute',
    width: windowWidth,
    paddingHorizontal: SPACING.small,
    bottom: SPACING.medium,
  },
  footer: {
    position: 'absolute',
    height: windowHeight * 0.5,
    width: '100%',
    bottom: 0,
  },
  gradientStyle: {
    height: '100%',
    width: '100%',
  },
});

export default Status;
