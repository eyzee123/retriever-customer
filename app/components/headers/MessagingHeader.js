import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import {useNavigation} from '@react-navigation/native';
import UserAvatar from 'react-native-user-avatar';

const MessagingHeader = props => {
  const navigation = useNavigation();
  const goBack = () => {
    navigation.goBack();
  };
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.viewLeft}>
            <TouchableOpacity onPress={goBack}>
              <Icon
                style={styles.icon}
                name="chevron-left"
                size={SIZES.iconSize.medium}
                color={COLORS.orange}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.viewCenter}>
            <UserAvatar
              size={windowHeight * 0.05}
              name={props.fullname_initials}
              textColor={COLORS.black}
              bgColor={'#E5E5E6'}
              style={styles.image}
            />
            <View style={styles.contactContainer}>
              <Text style={styles.contactName}>{props.riderName}</Text>
              <View style={styles.unitContainer}>
                <Text style={styles.riderUnit}>{props.unit}</Text>
                <Text style={styles.bullet}> • </Text>
                <Text style={styles.riderUnit}>{props.plateNo}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={props.onPress}>
            <Icon
              name="phone-in-talk"
              size={SIZES.iconSize.small}
              color={COLORS.darkGreen}
              style={{marginRight: SPACING.x_small}}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.small,
    width: windowWidth,
    borderBottomColor: COLORS.subTextColor1,
    borderBottomWidth: 0.2,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewCenter: {
    flex: 1,
    flexDirection: 'row',
  },
  image: {
    marginLeft: SPACING.x_small,
    borderRadius: 100,
  },
  contactContainer: {
    justifyContent: 'center',
    marginLeft: SPACING.small,
  },
  contactName: {
    ...FONTS.bold,
    color: COLORS.darkGreen,
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
});
export default MessagingHeader;
