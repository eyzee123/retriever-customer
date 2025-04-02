import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  SafeAreaView,
  Platform,
  Linking,
} from 'react-native';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import {COLORS, FONTS, GlobalStyle, SIZES, SPACING} from '../../styles/theme';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import WalletHeader from '../../components/headers/WalletHeader';
import {IMAGES} from '../../constants/Images';
import Accordion from 'react-native-collapsible/Accordion';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ScrollView} from 'react-native-gesture-handler';
import SectionItem from '../../components/listItem/SectionItem';
import {ROUTES} from '../../constants/Routes';
import DeviceInfo from 'react-native-device-info';

const About = ({navigation}) => {
  const [active, setActive] = useState([]);
  const SECTIONS = [
    {
      title: 'How do I list my restaurant / food business on Retriever?',
      content:
        'Interested in becoming a Retriever partner? Send us an email at sales@retriever.ph with the following info: Owner’s name, owner’s contact no., business name, and business address.',
    },
    {
      title: 'There is a problem with my order, who can I ask for help?',
      content: '',
    },
    {
      title: 'I forgot my password, can i change it?',
      content:
        "Don't worry, it's okay! On the login screen, tap on 'Forgot Password?' and enter the email that you used to register. We'll send you a link that you can use to change your password.",
    },
  ];

  const navLink = [
    {
      image: IMAGES.TERMS_CONDITIONS,
      text: 'Terms and Conditions',
      navigate: () => navigation.navigate(ROUTES.TERMS_AND_CONDITIONS),
    },
    {
      image: IMAGES.PRIVACY_POLICY,
      text: 'Privacy Policy',
      navigate: () =>
        Linking.openURL('https://www.retriever.ph/privacy-policy'),
    },
    {
      image: IMAGES.VISIT_WEBSITE,
      text: 'Visit the Website',
      navigate: () => Linking.openURL('https://www.retriever.ph/'),
    },
    {
      image: IMAGES.DISCORD,
      text: 'Visit our Social Media Sites',
      navigate: () => Linking.openURL('https://www.facebook.com/retriever.ph'),
    },
    // {
    //   image: IMAGES.FEEDBACK,
    //   text: 'Send Feedback Form',
    //   onPress: () => navigation.navigate(ROUTES.FEEDBACK),
    // },
  ];
  return (
    <MainScreen>
      <WalletHeader
        title="About us"
        onBackButtonPressed={() => navigation.goBack()}>
        <View style={styles.versionContainer}>
          <Text style={styles.appVersion}>v{DeviceInfo.getVersion()}</Text>
        </View>
      </WalletHeader>
      <ScrollView showsVerticalScrollIndicator={false}>
        <MainFrame fullscreen>
          <View style={styles.container}>
            <Text style={styles.sectionLabel}>
              Enjoy Fast and Convenient Delivery
            </Text>
            <Text style={styles.sectionSub}>
              Prepare to be experience the first ever homegrown super app for
              food delivery and other upcoming services.
            </Text>
            <View style={styles.navContainer}>
              {navLink.map((item, index) => (
                <View style={styles.sectionContainer} key={index}>
                  <SectionItem
                    image={item.image}
                    text={item.text}
                    onPress={item.navigate}
                  />
                </View>
              ))}
            </View>
            <Accordion
              sections={SECTIONS}
              activeSections={active}
              underlayColor={'transparent'}
              renderHeader={section => (
                <View style={styles.accordionContainer}>
                  <Text style={styles.title}>{section.title}</Text>
                  <Icon
                    name="chevron-down"
                    size={SIZES.iconSize.medium}
                    color={COLORS.darkGreen}
                  />
                </View>
              )}
              renderContent={section => (
                <View style={styles.content}>
                  {section.content != '' ? (
                    <Text style={styles.contentText}>{section.content}</Text>
                  ) : (
                    <Text style={styles.contentText}>
                      If you require any assistance, kindly inquire to this
                      email{' '}
                      <Text style={styles.textBold}>
                        bpsupport@retriever.ph
                      </Text>{' '}
                      or you can call our landline{' '}
                      <Text style={styles.textBold}>(082) 223-4435</Text> or
                      phone number{' '}
                      <Text style={styles.textBold}>(+63) 910-522-1226</Text>.
                    </Text>
                  )}
                </View>
              )}
              onChange={section => setActive(section)}
            />
          </View>
        </MainFrame>
      </ScrollView>
    </MainScreen>
  );
};

const styles = StyleSheet.create({
  versionContainer: {
    position: 'absolute',
    bottom: SPACING.medium,
    right: SPACING.medium,
    zIndex: 1,
  },
  appVersion: {
    ...FONTS.regular,
    color: COLORS.white,
  },
  container: {
    flex: 1,
    marginHorizontal: SPACING.medium,
    marginVertical: SPACING.large,
  },
  sectionLabel: {
    ...FONTS.bold,
    color: COLORS.darkGreen,
    fontSize: SIZES._20px,
  },
  sectionSub: {
    ...FONTS.regular,
    fontSize: SIZES._12px,
    color: COLORS.subTextColor1,
  },
  navContainer: {
    marginTop: SPACING.medium,
    marginBottom: SPACING.small,
  },
  sectionContainer: {
    marginBottom: SPACING.medium,
  },
  accordionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.x_small,
    paddingHorizontal: SPACING.small,
    borderWidth: 1,
    borderColor: COLORS.subTextColor,
    marginVertical: windowHeight * 0.003,
    borderRadius: 4,
  },
  title: {
    ...FONTS.bold,
    flex: 1,
    fontSize: SIZES._12px,
    color: COLORS.darkGreen,
  },
  content: {
    padding: SPACING.small,
    borderWidth: 1,
    borderColor: COLORS.subTextColor,
    marginVertical: windowHeight * 0.003,
    borderRadius: 4,
  },
  contentText: {
    ...FONTS.regular,
    flex: 1,
    fontSize: SIZES._12px,
    color: COLORS.subTextColor1,
  },
  textBold: {
    ...FONTS.bold,
    fontSize: SIZES._12px,
    color: COLORS.subTextColor1,
  },
});

export default About;
