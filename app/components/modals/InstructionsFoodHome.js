import React, {useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import Modal from 'react-native-modal';
import {BORDER, COLORS, SIZES, SPACING} from '../../styles/theme';
import RoundedButton from '../cores/RoundedButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import CustomCheckbox1 from '../general/CustomCheckbox1';

const InstructionsFoodHome = props => {
  const isCarousel = useRef(null);
  const [index, setIndex] = useState(0);

  const renderItem = ({item, index}) => {
    return (
      <ImageBackground
        resizeMode="cover"
        source={item.image}
        style={styles.image}
        borderTopLeftRadius={18}
        borderTopRightRadius={18}>
        <TouchableOpacity
          style={styles.closeContainer}
          onPress={props.closeModal}>
          <Icon
            name="close"
            size={SIZES.iconSize.medium}
            color={COLORS.white}
          />
        </TouchableOpacity>
      </ImageBackground>
    );
  };

  return (
    <Modal
      isVisible={props.showModal}
      onBackdropPress={props.closeModal}
      animationIn={'slideInDown'}
      animationOut={'slideOutDown'}
      animationInTiming={1000}
      animationOutTiming={1000}>
      <View style={styles.container}>
        <Carousel
          scrollEnabled={false}
          firstItem={
            index == props.additionalDataLength ? props.dataLength : index
          }
          ref={isCarousel}
          data={props.instructions}
          renderItem={renderItem}
          sliderWidth={windowWidth * 1}
          itemWidth={windowWidth * 0.9025}
        />
        <Pagination
          carouselRef={isCarousel}
          dotsLength={props.instructions.length}
          activeDotIndex={
            index == props.additionalDataLength ? props.dataLength : index
          }
          containerStyle={styles.dotContainerStyle}
          inactiveDotStyle={styles.inactiveDotStyle}
          dotStyle={styles.dotStyle}
          inactiveDotOpacity={0.7}
          inactiveDotScale={1}
        />
        <View style={styles.footer}>
          {index == props.additionalDataLength ? (
            <>
              <View style={{marginBottom: SPACING.small}}>
                <CustomCheckbox1
                  text="Don’t show this again."
                  onSelect={props.onSelect}
                />
              </View>
              <RoundedButton
                text="Got it"
                onPress={props.onConfirm}
                btnStyle={styles.btnStyle}
              />
            </>
          ) : (
            <View style={styles.btnContainer}>
              {index == 0 || index == props.additionalDataLength ? null : (
                <View style={styles.btnContainerWrapper}>
                  <RoundedButton
                    text="Back"
                    onPress={() => {
                      index > 0 ? setIndex(index - 1) : null;
                    }}
                    btnStyle={[
                      styles.btnStyle,
                      {
                        backgroundColor: COLORS.subTextColor,
                      },
                    ]}
                    btnText={{color: COLORS.subTextColor1}}
                  />
                </View>
              )}

              <View
                style={[
                  styles.btnContainerWrapper,
                  {marginLeft: index !== 0 ? SPACING.small : 0},
                ]}>
                <RoundedButton
                  text="Next"
                  onPress={() => {
                    index < props.additionalDataLength
                      ? setIndex(index + 1)
                      : null;
                  }}
                  btnStyle={styles.btnStyle}
                />
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingBottom: SPACING.small,
    backgroundColor: COLORS.transparent,
    borderRadius: 18,
  },
  image: {
    height: windowHeight * 0.63,
    width: '100%',
  },
  closeContainer: {
    alignSelf: 'flex-end',
    margin: SPACING.small,
  },
  footer: {
    backgroundColor: COLORS.white,
    width: '100%',
    paddingVertical: SPACING.small,
    paddingHorizontal: windowWidth * 0.035,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  btnContainer: {
    flexDirection: 'row',
  },
  btnContainerWrapper: {
    flex: 1,
  },
  btnStyle: {
    borderRadius: BORDER.roundedCornerInput,
  },
  dotContainerStyle: {
    marginTop: -windowWidth * 0.14,
    marginBottom: -windowWidth * 0.027,
  },
  dotStyle: {
    width: windowWidth * 0.13,
    height: windowHeight * 0.006,
    marginHorizontal: -windowHeight * 0.005,
    backgroundColor: COLORS.white,
  },
  inactiveDotStyle: {
    backgroundColor: COLORS.white,
  },
});
export default InstructionsFoodHome;
