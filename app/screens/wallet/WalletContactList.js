import React from 'react';
import {View, StyleSheet} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import SearchInput from '../../components/cores/SearchInput';
import WalletHeader from '../../components/headers/WalletHeader';
import ListContacts from '../../components/listItem/ListContacts';
import {COLORS, SPACING} from '../../styles/theme';
import {ROUTES} from '../../constants/Routes';

const WalletContactList = ({navigation}) => {
  const contactList = [
    {
      name: 'Kadin Philips',
      contact: '915 123 2341',
    },
    {
      name: 'Livia Korsgaard',
      contact: '915 123 2341',
    },
    {
      name: 'Ryan Gouse',
      contact: '915 123 2341',
    },
    {
      name: 'Ruben Franci',
      contact: '915 123 2341',
    },
    {
      name: 'Ashlynn Torff',
      contact: '915 123 2341',
    },
    {
      name: 'Alfredo Botosh',
      contact: '915 123 2341',
    },
    {
      name: 'Kadin Rosser',
      contact: '915 123 2341',
    },
    {
      name: 'Abram Siphron',
      contact: '915 123 2341',
    },
    {
      name: 'Abram Siphron',
      contact: '915 123 2341',
    },
  ];
  return (
    <MainScreen>
      <WalletHeader
        plain
        title="Transfer"
        onBackButtonPressed={() => navigation.goBack()}
      />
      <MainFrame fullscreen>
        <View style={styles.container}>
          <SearchInput
            icon="magnify"
            placeholder="Enter a name or mobile number"
            outline
          />
          <FlatList
            style={{marginTop: SPACING.medium}}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={contactList}
                  renderItem={({item, index}) => (
                    <>
                      <ListContacts
                        name={item.name}
                        contact={item.contact}
                        onPress={() =>
                          navigation.navigate(ROUTES.WALLET_TRANSFER)
                        }
                      />
                      <View style={styles.line} />
                    </>
                  )}
                />
              </View>
            }
          />
        </View>
      </MainFrame>
    </MainScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.medium,
    paddingHorizontal: SPACING.medium,
  },
  line: {
    borderBottomColor: COLORS.subTextColor1,
    borderWidth: 0.2,
    width: '100%',
    marginVertical: SPACING.medium,
  },
});
export default WalletContactList;
