import {useContext} from 'react';
import {ActivityIndicator, Button, Text, View} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {UserContext} from '../../provider/UserProvider';
import {COLORS} from '../../styles/theme';
import {showSuccessMessage} from '../../utils/FlashMessage';

const User = () => {
  const userCtx = useContext(UserContext);

  const logout = () => {
    userCtx.signout().then(res => {
      if (!res.success) {
        console.log(userCtx.errorMessage);
        return;
      }
      console.log('logout success');
    });
  };
  const signin = () => {
    const credentials = {
      email: 'bejayguibao11@gmail.com',
      password: '12345678',
    };
    userCtx.signin(credentials).then(res => {
      if (!res.success) {
        console.log(userCtx.errorMessage);
        return;
      }
      console.log('signin success');
    });
  };

  const saveUser = () => {
    const user = {
      email: 'test20@gmail.com',
      password: '12345678',
      firstName: 'test',
      lastName: 'dummy',
      referral: '9999',
      contactNumber: '9182014993',
      birthDate: '11-19-2022',
    };
    //console.log('USER PAGE', authCtx.user);
    userCtx.addUser(user).then(response => {
      //console.log(response);
      // showSuccessMessage(response);
      if (!response.success) {
        console.log(userCtx.errorMessage);
        return;
      }
      console.log('register success');
      // alert(response);
      // showMessage({
      //   message: response,
      //   type: 'success',
      //   backgroundColor: COLORS.brandGreen,
      //   color: COLORS.white,
      // });
    });
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {userCtx.isLoading && <ActivityIndicator />}
      {!userCtx.isLoading && userCtx.hasError && (
        <Text>{userCtx.errorMessage}</Text>
      )}
      {userCtx.isLoggedIn && <Text>I'm Logged In</Text>}
      {!userCtx.isLoggedIn && <Text>I'm Logged Out</Text>}
      <Button onPress={saveUser} title="Save User" />
      <Button onPress={signin} title="Signin User" />
      <Button onPress={logout} title="Logout User" />
    </View>
  );
};

export default User;
