import React, {useContext, useEffect, useState} from 'react';
import {StoreContext} from '../../provider/StoreProvider';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import {BORDER, COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import {MultiStoryContainer, ProfileHeader} from 'react-native-story-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RoundedButton from '../cores/RoundedButton';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../constants/Routes';
import {getHoursDifference2Dates} from '../../utils/HelperFunctions';
import {firebase} from '@react-native-firebase/firestore';

const ListSingleStoreStories = props => {
  const navigation = useNavigation();
  const storeContext = useContext(StoreContext);
  const [storiesData, setStoriesData] = useState([]);
  const [progressIndex, setProgressIndex] = useState(0);
  const [isStoryViewVisible, setIsStoryViewShow] = useState(false);
  const [pressedIndex, setPressedIndex] = useState(0);

  const openStories = index => {
    setIsStoryViewShow(true);
    setPressedIndex(index);
  };

  useEffect(() => {
    let arraySingleStoreStories = [];
    storeContext.storiesList.map(item => {
      if (item.id === props.store.storeID) {
        arraySingleStoreStories.push(item);
      }
    });
    setStoriesData(arraySingleStoreStories);
  }, []);

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
    // await updateLocalDataObject(
    //   LOCAL_STORAGE.STORIES,
    //   storeContext.storiesList[userIndex].stories[progressIndex].storyId,
    //   true,
    //   userIndex,
    //   progressIndex,
    // );
    // console.log(userIndex);
    setProgressIndex(progressIndex);
  };

  return (
    <>
      {storiesData.length !== 0 ? (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={storiesData}
          keyExtractor={item => item?.id?.toString()}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() => openStories(index)}
              disabled={item.stories.length > 0 ? false : true}
              style={[
                styles(props).storeAvatarWrapper,
                {
                  borderColor:
                    item.stories[item.stories.length - 1].isSeen > 0
                      ? '#E0E0E0'
                      : COLORS.orange,
                },
              ]}>
              <FastImage
                source={{uri: item.profile}}
                style={styles(props).avatarImage}
              />
            </TouchableOpacity>
          )}
        />
      ) : (
        <View
          style={[
            styles(props).storeAvatarWrapper,
            {
              borderColor: '#E0E0E0',
            },
          ]}>
          <FastImage
            source={{uri: props.store.storeProfilePhoto}}
            style={styles(props).avatarImage}
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
          onComplete={() => setIsStoryViewShow(false)}
          stories={storiesData}
          style={{
            marginHorizontal: SPACING.small,
          }}
          renderHeaderComponent={({userStories}) => (
            <ProfileHeader
              onImageClick={() => getStore(userStories.id)}
              userImage={{uri: userStories?.profile ?? ''}}
              userName={userStories?.username}
              userMessage={userStories?.title}
              userImageStyle={styles(props).userImageStyle}
              rootStyle={{width: '90%'}}
              userNameStyle={styles(props).store}
              userMessageStyle={styles(props).branch}
              customCloseButton={
                <TouchableOpacity onPress={() => setIsStoryViewShow(false)}>
                  <Icon
                    name="close"
                    size={SIZES.iconSize.medium}
                    color={COLORS.white}
                  />
                </TouchableOpacity>
              }
            />
          )}
          renderCustomView={() => (
            <View style={styles(props).timeContainer}>
              <Text style={styles(props).time}>
                {getHoursDifference2Dates(
                  storeContext.storiesList[0]?.stories[progressIndex]
                    ?.createdAt,
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
          renderFooterComponent={({userStories}) =>
            props.profile ? null : (
              <View style={styles(props).footerComponent}>
                <RoundedButton
                  btnStyle={styles(props).btnStyles}
                  text="Order Now"
                  btnText={{color: COLORS.darkGreen}}
                  onPress={() => getStore(userStories.id)}
                />
              </View>
            )
          }
          userStoryIndex={pressedIndex}
          progressViewProps={styles(props).progressView}
          barStyle={styles(props).barStyle}
        />
      )}
    </>
  );
};

const styles = props =>
  StyleSheet.create({
    storeAvatarWrapper: {
      width: props.small ? windowHeight * 0.07 : windowHeight * 0.09,
      height: props.small ? windowHeight * 0.07 : windowHeight * 0.09,
      backgroundColor: COLORS.white,
      borderWidth: 2,
      borderRadius: BORDER.circle,
      borderColor: COLORS.orange,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarImage: {
      resizeMode: 'cover',
      width: '92%',
      height: '92%',
      borderRadius: BORDER.circle,
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
    footerComponent: {
      position: 'absolute',
      width: '100%',
      alignSelf: 'center',
      bottom: SPACING.x_large,
    },
    btnStyles: {
      backgroundColor: 'white',
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

export default ListSingleStoreStories;
