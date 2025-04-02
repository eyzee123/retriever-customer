import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {BORDER, COLORS, GlobalStyle, SIZES, SPACING} from '../../styles/theme';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import Icon from 'react-native-vector-icons/Feather';
import RoundedButton from '../cores/RoundedButton';
import {IMAGES} from '../../constants/Images';
import Ratings from '../general/Ratings';
import FastImage from 'react-native-fast-image';

const ReviewStoreAndRider = ({
  showModal,
  closeModal,
  onModalHide,
  onPressSubmit,
  storeName,
  storeImage,
}) => {
  const [rating, setRating] = useState(5);

  const ratingCompleted = rating => {
    setRating(rating);
  };
  return (
    <Modal
      isVisible={showModal}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      animationInTiming={1000}
      animationOutTiming={1000}
      useNativeDriver={true}
      onModalHide={onModalHide}
      style={styles.contentContainer}>
      <SafeAreaView>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={closeModal}
            style={{marginLeft: windowWidth * 0.025}}>
            <Icon
              name="x"
              size={SIZES.iconSize.medium}
              color={COLORS.darkGreen}
            />
          </TouchableOpacity>
          <View style={styles.containerWrapper}>
            <View style={styles.wrapper}>
              <View style={styles.imageContainer}>
                <FastImage
                  source={{uri: storeImage}}
                  style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: BORDER.circle,
                  }}
                />
              </View>
              <Text style={styles.sectionLabel}>
                How was your order from {storeName}?
              </Text>
              <Text style={styles.sectionSubLabel}>
                Enjoyed the food and service of the shop? Rate it based on your
                satisfactory rating.
              </Text>
              <Ratings
                imageSize={windowHeight * 0.05}
                ratingBackgroundColor="#E0E0E0"
                style={{marginVertical: SPACING.large}}
                readonly={false}
                onFinishRating={ratingCompleted}
                startingValue={rating}
              />
            </View>
            {/* <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: COLORS.subTextColor,
              }}
            /> */}
            {/* <View style={styles.wrapper}>
              <View style={styles.imageContainer}>
                <Image
                  source={require('../../assets/images/users/person.png')}
                  style={{height: '100%', width: '100%'}}
                />
              </View>
              <Text style={styles.sectionLabel}>
                How was the delivery of Juan?
              </Text>
              <Text style={styles.sectionSubLabel}>
                How was the delivery service of the rider? Rate five (5) stars
                if it is satisfactory.
              </Text>
              <Ratings
                imageSize={windowHeight * 0.05}
                ratingBackgroundColor="#E0E0E0"
                style={{marginVertical: SPACING.large}}
                readonly={false}
              />
            </View> */}
            {/* </View> */}

            <View
              style={{
                borderTopWidth: 2,
                borderTopColor: COLORS.subTextColor,
                paddingVertical: SPACING.large,
              }}>
              <View
                style={{
                  marginHorizontal: windowWidth * 0.025,
                }}>
                <RoundedButton
                  text="Submit Review"
                  onPress={onPressSubmit.bind(null, rating)}
                />
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: 'center',
  },
  container: {
    width: windowWidth,
    height: windowHeight,
    paddingTop: SPACING.medium,
    // paddingHorizontal: SPACING.medium,
    backgroundColor: COLORS.white,
  },
  containerWrapper: {
    flex: 1,
  },
  wrapper: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: windowWidth * 0.025,
  },
  imageContainer: {
    height: windowHeight * 0.12,
    width: windowHeight * 0.12,
    borderRadius: BORDER.circle,
  },
  sectionLabel: {
    ...GlobalStyle.sectionLabel,
    fontSize: SIZES._20px,
    textAlign: 'center',
    marginVertical: SPACING.small,
  },
  sectionSubLabel: {
    ...GlobalStyle.sectionSubLabel,
    textAlign: 'center',
    color: '#7D7E82',
  },
});

export default ReviewStoreAndRider;
