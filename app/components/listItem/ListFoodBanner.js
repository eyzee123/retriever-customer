import React, {useContext, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import SliderItem from './SliderItem';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import {BORDER, COLORS, SPACING} from '../../styles/theme';
import {DynamicContentContext} from '../../provider/DynamicContentProvider';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const ListFoodBanner = props => {
  const dynamicContext = useContext(DynamicContentContext);
  const isCarousel = useRef(null);
  const [index, setIndex] = useState(0);

  const renderItem = ({item, index}) => {
    return (
      <SliderItem
        image={item.adsImage}
        height={windowHeight * 0.2}
        key={index}
      />
    );
  };

  return (
    <>
      {dynamicContext.isLoading ? (
        <SkeletonPlaceholder borderRadius={4}>
          <View style={[styles.container, {marginTop: -10}]} />
        </SkeletonPlaceholder>
      ) : dynamicContext.bannerFoodList?.length == 1 ? (
        <SliderItem
          image={dynamicContext.bannerFoodList[0].adsImage}
          height={windowHeight * 0.2}
          width={windowWidth * 0.91}
        />
      ) : (
        <>
          <Carousel
            ref={isCarousel}
            data={dynamicContext?.bannerFoodList}
            renderItem={renderItem}
            sliderWidth={windowWidth * 1}
            itemWidth={windowWidth * 0.91}
            onSnapToItem={index => setIndex(index)}
            loop={props.loop}
            autoplay={props.autoplay}
          />
          <Pagination
            carouselRef={isCarousel}
            dotsLength={dynamicContext.bannerFoodList?.length}
            activeDotIndex={index}
            containerStyle={[
              styles.dotContainerStyle,
              {
                marginBottom:
                  dynamicContext.bannerFoodList?.length == 1
                    ? -windowWidth * 0.03
                    : -windowHeight * 0.031,
              },
            ]}
            inactiveDotStyle={styles.inactiveDotStyle}
            dotStyle={styles.dotStyle}
            inactiveDotOpacity={1}
            inactiveDotScale={1}
            tappableDots={true}
          />
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  dotContainerStyle: {
    marginTop: -windowWidth * 0.11,
    marginBottom: -windowWidth * 0.03,
  },
  dotStyle: {
    width: windowWidth * 0.1,
    height: windowHeight * 0.008,
    marginHorizontal: -windowHeight * 0.005,
    backgroundColor: COLORS.orange,
  },
  inactiveDotStyle: {
    backgroundColor: COLORS.white,
  },
  container: {
    height: windowHeight * 0.14,
    width: windowWidth * 0.91,
    marginVertical: SPACING.x_small,
    borderColor: COLORS.borderColor,
    borderRadius: BORDER.roundedCornerBox,
    borderWidth: 2,
  },
});

export default ListFoodBanner;
