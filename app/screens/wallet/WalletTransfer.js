import React from 'react';
import {View, StyleSheet} from 'react-native';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import RoundedButton from '../../components/cores/RoundedButton';
import WalletTransferForm from '../../components/forms/WalletTransferForm';
import WalletHeader from '../../components/headers/WalletHeader';
import {SPACING} from '../../styles/theme';
import {ROUTES} from '../../constants/Routes';

const WalletTransfer = ({navigation}) => {
  return (
    <MainScreen>
      <WalletHeader
        plain
        title="Transfer"
        onBackButtonPressed={() => navigation.goBack()}
      />
      <MainFrame fullscreen>
        <View style={styles.container}>
          <WalletTransferForm />
        </View>
      </MainFrame>
      <View style={styles.btnContainer}>
        <RoundedButton
          text="Next"
          onPress={() => navigation.navigate(ROUTES.WALLET_REVIEW)}
        />
      </View>
    </MainScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.medium,
  },
  btnContainer: {
    paddingHorizontal: SPACING.medium,
    marginBottom: SPACING.small,
  },
});

export default WalletTransfer;
