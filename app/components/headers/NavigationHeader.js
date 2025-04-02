import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  Platform,
  SafeAreaView,
  ViewComponent,
} from 'react-native';
import {BORDER, COLORS, FONTS, SIZES, SPACING} from '../../styles/theme';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Avatar} from 'react-native-paper';

const NavigationHeader = props => {
  const headerType = () => {
    var tp;
    if (this.props.type == 'primary') {
      tp = COLORS.primary;
    } else if (this.props.type == 'secondary') {
      tp = COLORS.secondary;
    } else {
      tp = COLORS.background;
    }
    return tp;
  };

  return (
    <SafeAreaView style={styles.header}>
      <View style={styles.parentWrapper}>
        <TouchableOpacity onPress={props.onMenuIconPressed}>
          <Avatar.Icon
            icon="menu"
            size={30}
            color={COLORS.orange}
            backgroundColor={COLORS.white}
          />
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <FontAwesome
            name="map-pin"
            size={16}
            color={COLORS.orange}
            style={{marginRight: SPACING.x_small}}
          />
          <Text style={styles.currentLocation}>Current Location</Text>
        </View>
        <TouchableOpacity>
          <Avatar.Icon
            icon="wallet"
            size={30}
            color={COLORS.orange}
            backgroundColor={COLORS.white}
          />
        </TouchableOpacity>
      </View>
      {props.children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    backgroundColor: COLORS.primary,
    flexDirection: 'column',
  },

  parentWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.medium,
  },
  leftIcon: {
    height: 30,
    width: 30,
    color: COLORS.tertiary,
    padding: SPACING.x_small,
    backgroundColor: COLORS.white,
    borderRadius: 30 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    width: '60%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER.roundedCornerCard,
    paddingVertical: 7,
  },
  rightIcon: {
    height: 30,
    width: 30,
    color: COLORS.tertiary,
    padding: SPACING.x_small,
    backgroundColor: COLORS.white,
    borderRadius: 30 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentLocation: {
    ...FONTS.regular,
    color: COLORS.orange,
  },
});
export default NavigationHeader;
