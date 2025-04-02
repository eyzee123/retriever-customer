import React from 'react';

import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {BORDER, COLORS, FONTS, SIZES} from '../../styles/theme';
import {constants} from '../../styles';
import History from '../../screens/history/History';

const CustomDrawerItem = ({label, icon, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.drawerItemContainer}>
      <FontAwesome name={icon} size={20} color={COLORS.tertiary} />
      <Text style={styles.drawerItemLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const CustomDrawer = props => {
  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{backgroundColor: COLORS.background}}>
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <Image
              source={require('../../assets/images/user-profile.jpg')}
              style={styles.imageAvatar}
            />
            <View style={{flexDirection: 'column'}}>
              <Text
                style={{
                  color: COLORS.tertiary,
                  ...FONTS.bold,
                  fontSize: 17,
                }}>
                Juan de la Cruz
              </Text>

              <Text
                style={{
                  color: COLORS.subtitle,
                  ...FONTS.regular,
                  fontSize: 12,
                }}>
                jdlcruz@hotmail.com
              </Text>
              <Text
                style={{
                  color: COLORS.subtitle,
                  ...FONTS.regular,
                  fontSize: 12,
                }}>
                09063675732
              </Text>
            </View>
          </View>
          <FontAwesome name="edit" size={14} color={COLORS.tertiary} />
        </View>
        <View style={{flex: 1, backgroundColor: '#fff', paddingTop: 10}}>
          {/* <DrawerItemList {...props} /> */}
          <CustomDrawerItem
            label={constants.screens.home}
            icon="home"
            onPress={() => props.navigation.navigate('Home')}
          />
          <CustomDrawerItem
            label={constants.screens.history}
            icon="history"
            onPress={() => props.navigation.navigate('History')}
          />
          <CustomDrawerItem
            label={constants.screens.address}
            icon="address-book"
            onPress={() => props.navigation.navigate('Address')}
          />
          <CustomDrawerItem
            label={constants.screens.settings}
            icon="cog"
            onPress={() => props.navigation.navigate('Settings')}
          />
          <CustomDrawerItem
            label={constants.screens.support}
            icon="question"
            onPress={() => props.navigation.navigate('Support')}
          />
          <CustomDrawerItem
            label={constants.screens.about}
            icon="info"
            onPress={() => props.navigation.navigate('About')}
          />
          <CustomDrawerItem
            label={constants.screens.loginCreate}
            icon="user"
            onPress={() => props.navigation.navigate('Login/Create Account')}
          />
        </View>
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    padding: 10,

    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    margin: 10,
  },
  imageAvatar: {
    height: 66,
    width: 66,
    borderRadius: BORDER.roundedImage,
    marginRight: 7,
  },
  drawerItemContainer: {
    flexDirection: 'row',
    height: 40,

    marginBottom: SIZES.base,
    alignItems: 'center',
    paddingLeft: SIZES.radius,
    borderRadius: SIZES.base,
  },

  drawerItemLabel: {
    marginLeft: 15,
    color: COLORS.tertiary,
    ...FONTS.regular,
  },
});

export default CustomDrawer;
