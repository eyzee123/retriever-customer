import {useNavigation} from '@react-navigation/native';
import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import {ROUTES} from '../../constants/Routes';
import {StoreContext} from '../../provider/StoreProvider';
import {BORDER, COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RoundedButton from '../cores/RoundedButton';
import {
  MultiStoryContainer,
  ProfileHeader,
  TransitionMode,
} from 'react-native-story-view';
import {
  getLocalDataObject,
  removeLocalDataObject,
  updateLocalDataObject,
} from '../../services/Storage/LocalStorageService';
import {LOCAL_STORAGE} from '../../constants/ProjectConstants';
import {firebase} from '@react-native-firebase/firestore';
import {
  getHoursDifference2Dates,
  getSpecificDistance,
} from '../../utils/HelperFunctions';
import {AddressContext} from '../../provider/AddressProvider';

const ListStories = props => {
  const navigation = useNavigation();
  const storeContext = useContext(StoreContext);
  const addressContext = useContext(AddressContext);
  const {primaryAddress} = addressContext;
  const [isStoryViewVisible, setIsStoryViewShow] = useState(false);
  const [pressedIndex, setPressedIndex] = useState(0);
  const [progressIndex, setProgressIndex] = useState(0);
  const [userIndex, setUserIndex] = useState(0);

  const origin = {
    latitude: primaryAddress.coordinates?.latitude,
    longitude: primaryAddress.coordinates?.longitude,
  };

  const openStories = async storeId => {
    await props.onStoryOpen(false);
    const pressedIndex1 = props.data.findIndex(item => item.id === storeId);
    setPressedIndex(pressedIndex1);
    setProgressIndex(0);
    setIsStoryViewShow(true);

    await updateLocalDataObject(
      LOCAL_STORAGE.STORIES,
      storeContext.storiesList[pressedIndex1]?.stories[progressIndex]?.storyId,
      true,
      pressedIndex1,
      progressIndex,
    );
  };

  const getStore = async storeID => {
    setIsStoryViewShow(false);
    await storeContext.storeList.map(item => {
      if (item.storeID === storeID) {
        navigation.navigate(ROUTES.RESTAURANT_PROFILE, {
          store: item,
        });
      }
    });
  };

  const changePositionHandler = async (progressIndex, userIndex) => {
    await updateLocalDataObject(
      LOCAL_STORAGE.STORIES,
      storeContext.storiesList[userIndex].stories[progressIndex].storyId,
      true,
      userIndex,
      progressIndex,
    );
    setProgressIndex(progressIndex);
    setUserIndex(userIndex);
  };

  const completeHandler = async () => {
    setIsStoryViewShow(false);
    props.onStoryOpen(true);

    const localDataStories = await getLocalDataObject(LOCAL_STORAGE.STORIES);
    storeContext.setStoreStories(localDataStories);
  };

  const deleteStory = () => {
    // await storeContext.deleteStory(
    //   storeContext.storiesList[userIndex].id,
    //   storeContext.storiesList[userIndex].stories[progressIndex].storyId,
    // );
    removeLocalDataObject(
      LOCAL_STORAGE.STORIES,
      storeContext.storiesList[userIndex].stories[progressIndex].storyId,
    );
    // console.log(
    //   storeContext.storiesList[userIndex].id,
    //   storeContext.storiesList[userIndex].stories[progressIndex].storyId,
    // );
  };

  const filteredStoriesLength = () => {
    const filteredStoriesList = props.data.filter(item =>
      item.status == 'open' &&
      origin.latitude !== undefined &&
      origin.longitude !== undefined
        ? getSpecificDistance(origin, {
            latitude: item.latitude,
            longitude: item.longitude,
          }) <= 4
        : null,
    );

    return filteredStoriesList.length;
  };

  return (
    <View style={styles.storiesSection}>
      {storeContext.isLoading ? (
        <View style={styles.storiesWrapper}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={[1, 2, 3, 4, 5]}
            horizontal
            renderItem={({item, index}) => (
              <SkeletonPlaceholder borderRadius={4} key={index}>
                <View style={styles.container} />
              </SkeletonPlaceholder>
            )}
            keyExtractor={item => item.id}
            numColumns={1}
            key={item => item.id}
          />
        </View>
      ) : (
        <>
          {filteredStoriesLength() > 0 && (
            <View style={styles.storiesWrapper}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={props.data.filter(item =>
                  item.status == 'open' &&
                  origin.latitude !== undefined &&
                  origin.longitude !== undefined
                    ? getSpecificDistance(origin, {
                        latitude: item.latitude,
                        longitude: item.longitude,
                      }) <= 4
                    : null,
                )}
                keyExtractor={item => item?.id?.toString()}
                renderItem={({item, index}) => (
                  <View
                    style={[
                      styles.storyAvatarContainer,
                      {
                        marginLeft: index == 0 ? SPACING.medium : SPACING.small,
                        marginRight:
                          props.data.length - 1 == index ? SPACING.medium : 0,
                      },
                    ]}
                    key={index}>
                    <TouchableOpacity onPress={() => openStories(item.id)}>
                      <View
                        style={[
                          styles.storeAvatarWrapper,
                          {
                            borderColor: item.stories[item.stories.length - 1]
                              .isSeen
                              ? '#E0E0E0'
                              : COLORS.orange,
                            borderWidth: item.stories.length > 0 ? 1.8 : 0,
                          },
                        ]}>
                        <Image
                          source={{uri: item.profile}}
                          style={styles.avatarImage}
                        />
                      </View>
                    </TouchableOpacity>
                    <Text style={styles.avatarText} numberOfLines={1}>
                      {item.username.length > 13
                        ? item.username.slice(0, 12) + '...'
                        : item.username}
                    </Text>
                  </View>
                )}
              />
            </View>
          )}

          {isStoryViewVisible && (
            // add other StoryContainer Props
            <MultiStoryContainer
              progressIndex={progressIndex}
              onChangePosition={changePositionHandler}
              enableProgress={true}
              visible={isStoryViewVisible}
              onComplete={completeHandler}
              stories={props.data}
              style={{
                marginHorizontal: SPACING.small,
              }}
              renderHeaderComponent={({userStories}) => (
                <ProfileHeader
                  onImageClick={() => getStore(userStories.id)}
                  userImage={{uri: userStories?.profile ?? ''}}
                  userName={userStories?.username}
                  userMessage={userStories?.title}
                  userImageStyle={styles.userImageStyle}
                  rootStyle={{width: '90%'}}
                  userNameStyle={styles.store}
                  userMessageStyle={styles.branch}
                  customCloseButton={
                    <TouchableOpacity onPress={completeHandler}>
                      <Icon
                        name="close"
                        size={SIZES.iconSize.medium}
                        color={COLORS.white}
                      />
                    </TouchableOpacity>
                  }
                />
              )}
              renderFooterComponent={({userStories}) => (
                <View style={styles.btnStyles}>
                  <RoundedButton
                    btnStyle={{backgroundColor: 'white'}}
                    text="Order Now"
                    btnText={{color: COLORS.darkGreen}}
                    onPress={() => getStore(userStories.id)}
                  />
                </View>
              )}
              renderCustomView={() => (
                <View style={styles.timeContainer}>
                  <Text style={styles.time}>
                    {getHoursDifference2Dates(
                      storeContext.storiesList[userIndex]?.stories[
                        progressIndex
                      ]?.createdAt,
                      firebase.firestore.Timestamp.now().seconds * 1000,
                    )}
                    hr
                  </Text>
                  <Icon
                    name="earth"
                    size={windowHeight * 0.016}
                    color={COLORS.white}
                    style={{opacity: 0.7, marginTop: windowHeight * 0.003}}
                  />
                </View>
              )}
              userStoryIndex={pressedIndex}
              progressViewProps={styles.progressView}
              barStyle={styles.barStyle}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  storiesSection: {},
  storiesWrapper: {
    marginBottom: SPACING.small,
  },
  storyAvatarContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: windowWidth * 0.025,
  },
  storeAvatarWrapper: {
    width: windowHeight * 0.08,
    height: windowHeight * 0.08,
    backgroundColor: COLORS.tertiary,
    borderRadius: BORDER.circle,
    borderColor: COLORS.orange,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...FONTS.bold,
    fontSize: SIZES._8px,
    color: COLORS.white,
    marginTop: SPACING.x_small,
  },
  avatarImage: {
    resizeMode: 'cover',
    width: '92%',
    height: '92%',
    borderRadius: BORDER.circle,
  },
  container: {
    width: windowHeight * 0.08,
    height: windowHeight * 0.08,
    borderColor: COLORS.borderColor,
    borderWidth: 2,
    borderRadius: BORDER.circle,
    marginLeft: windowWidth * 0.025,
  },
  userImageStyle: {
    height: windowHeight * 0.065,
    width: windowHeight * 0.065,
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
  btnStyles: {
    position: 'absolute',
    width: '100%',
    alignSelf: 'center',
    bottom: SPACING.x_large,
  },
  progressView: {
    style: {
      width: '100%',
      position: 'absolute',
      top: windowHeight * 0.12,
    },
  },
  barStyle: {
    barActiveColor: COLORS.white,
    barHeight: 3,
  },
  timeContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: windowHeight * 0.1,
    marginLeft: windowWidth * 0.187,
  },
  time: {
    ...FONTS.regular,
    color: COLORS.white,
    fontSize: SIZES._10px,
    marginRight: windowWidth * 0.01,
  },
});
export default ListStories;
