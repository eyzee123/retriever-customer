import React, {
  createContext,
  useReducer,
  useState,
  useCallback,
  useEffect,
} from 'react';
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {userInitialState, userReducer} from '../reducers/UserReducer';
import {ERROR} from '../constants/Status';
import {
  getLocalDataObject,
  storeLocalDataObject,
} from '../services/Storage/LocalStorageService';
import {LOCAL_STORAGE} from '../constants/ProjectConstants';
import {COLLECTION} from '../constants/Collections';
import {Base64} from 'js-base64';

const UserContext = createContext();

const UserProvider = props => {
  const usersCollection = firestore().collection(COLLECTION.USERS);
  const usersRequestCollection = firestore().collection(
    COLLECTION.USERS_REQUEST,
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [userState, dispatchUser] = useReducer(userReducer, userInitialState);
  const [showModalInstructionsFood, setModalInstructionsFood] = useState(true);
  const [showModalInstructionsHome, setModalInstructionsHome] = useState(true);
  const [showModalInstructionsSettings, setModalInstructionsSettings] =
    useState(false);
  const [allowNotifications, setAllowNotifications] = useState(true);
  const [isAccountDeleted, setIsAccountDeleted] = useState(false);

  //executes whenever there is authentication change
  // const authChanged = useCallback(firebaseUser => {
  //   setCurrentUser(firebaseUser);
  //   setIsLoggedIn(firebaseUser ? true : false);
  // }, []);

  // //check if auth change
  // useEffect(() => {
  //   const subscriber = auth().onAuthStateChanged(authChanged);
  //   return subscriber;
  // }, [authChanged]);

  useEffect(() => {
    const appOpened = async () => {
      const appOpen = await getLocalDataObject(LOCAL_STORAGE.APP_OPENED);

      if (appOpen != null) {
        if (appOpen.instructionsFood) {
          setModalInstructionsFood(true);
        } else {
          setModalInstructionsFood(false);
        }

        if (appOpen.instructionsHome) {
          setModalInstructionsHome(true);
        } else {
          setModalInstructionsHome(false);
        }

        if (appOpen.allowNotifications) {
          setAllowNotifications(true);
        } else {
          setAllowNotifications(false);
        }

        if (appOpen.instructionsFood && appOpen.instructionsHome) {
          setModalInstructionsSettings(true);
        } else {
          setModalInstructionsSettings(false);
        }
      } else {
        setModalInstructionsSettings(true);
      }
    };

    appOpened();
  }, []);

  const signout = async () => {
    dispatchUser({type: 'PROCESSING'});
    try {
      await auth().signOut();
      return {success: true};
    } catch (error) {
      console.log('error', error);
      dispatchUser({
        type: 'FAILED',
      });
      return {success: false, error: error.message};
    }
  };

  const signin = async (email, password) => {
    dispatchUser({type: 'PROCESSING'});

    try {
      let res = await auth().signInWithEmailAndPassword(email, password);

      if (res.user) {
        //to update email from verification
        await usersCollection.doc(res.user.uid).update({email: res.user.email});
        //to update email from verification
        var encryptPassword = Base64.encode(password);
        const user = await usersCollection.doc(res.user.uid).get();
        const localData = {
          ...user._data,
          id: res.user.uid,
          // password: encryptPassword,
        };
        await usersCollection
          .doc(res.user.uid)
          .update({password: encryptPassword});
        await storeLocalDataObject(LOCAL_STORAGE.USER, localData);
        dispatchUser({
          type: 'AUTH',
          payload: {user: localData, isLoggedIn: true},
        });

        console.log('login', 'success');
        return {success: true};
      }
      dispatchUser({
        type: 'FAILED',
      });
      return {success: false, error: ERROR.DEFAULT_ERROR};
    } catch (error) {
      console.log('catch', error);
      let message = ERROR.DEFAULT_ERROR;
      if (error.code === 'auth/invalid-email') {
        message = ERROR.INVALID_EMAIL;
      }
      if (error.code === 'auth/user-not-found') {
        message = ERROR.USER_NOT_FOUND;
      }
      if (error.code === 'auth/wrong-password') {
        message = ERROR.PASSWORD_INVALID;
      }
      if (error.code === 'auth/too-many-requests') {
        message = ERROR.TOO_MANY_LOGIN_ATTEMPT;
      }
      dispatchUser({
        type: 'FAILED',
      });
      return {success: false, error: message};
    }
  };

  const getUserById = async id => {
    const user = await usersCollection.doc(id).get();
    return user._data;
  };

  const addUser = async user => {
    dispatchUser({type: 'PROCESSING'});
    user.createdAt = firestore.FieldValue.serverTimestamp();
    const {email, password} = user;

    try {
      const responseData = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      delete user.password;
      var encryptPassword = Base64.encode(password);
      const userData = {
        ...user,
        uid: responseData.user.uid,
        password: encryptPassword,
      };
      const localUser = {
        ...user,
        id: responseData.user.uid,
        // password: encryptPassword,
      };
      const response = await usersCollection
        .doc(responseData.user.uid)
        .set(userData);
      await storeLocalDataObject(LOCAL_STORAGE.USER, localUser);
      dispatchUser({
        type: 'SUCCESS',
        payload: {user: user},
      });
      return {success: true};
    } catch (error) {
      let message = ERROR.DEFAULT_ERROR;
      if (error.code === 'auth/email-already-in-use') {
        message = ERROR.EMAIL_ALREADY_IN_USE;
      }
      if (error.code === 'auth/invalid-email') {
        message = ERROR.INVALID_EMAIL;
      }
      dispatchUser({
        type: 'FAILED',
      });
      return {success: false, error: message};
    }
  };

  const updateUserEmail = async newEmail => {
    dispatchUser({type: 'PROCESSING'});
    const user = auth().currentUser;

    try {
      await user.verifyBeforeUpdateEmail(newEmail);
      // await usersCollection.doc(user.uid).update({email: newEmail});
      dispatchUser({
        type: 'SUCCESS',
        payload: {user: getUserById(user.uid)},
      });
      return {success: true};
    } catch (error) {
      dispatchUser({type: 'FAILED'});
      return {success: false, error};
    }
  };

  const updateUserContactNumber = async newContact => {
    dispatchUser({type: 'PROCESSING'});
    const user = auth().currentUser;

    try {
      await usersCollection.doc(user.uid).update({contactNumber: newContact});
      const localUser = await getLocalDataObject(LOCAL_STORAGE.USER);
      await storeLocalDataObject(LOCAL_STORAGE.USER, {
        ...localUser,
        contactNumber: newContact,
      });

      let temp_contact = newContact;
      const contactNumber = temp_contact.substring(3, 13);
      console.log(contactNumber);
      setCurrentUser(prevState => {
        return {
          ...prevState,
          contactNumber: contactNumber,
        };
      });
      dispatchUser({
        type: 'SUCCESS',
        payload: {user: getUserById(user.uid)},
      });
      return {success: true};
    } catch (error) {
      dispatchUser({type: 'FAILED'});
      return {success: false, error};
    }
  };
  const updateUserPassword = async newPassword => {
    dispatchUser({type: 'PROCESSING'});
    const user = auth().currentUser;

    try {
      await user.updatePassword(newPassword);
      dispatchUser({
        type: 'SUCCESS',
        payload: {user: getUserById(user.uid)},
      });
      return {success: true};
    } catch (error) {
      dispatchUser({type: 'FAILED'});
      return {success: false, error};
    }
  };

  const getUser = async () => {
    const user = auth().currentUser;
    const localUser = await getLocalDataObject(LOCAL_STORAGE.USER);
    try {
      // await usersCollection.doc(user.uid).update({[field]: value});
      await usersCollection
        .where('uid', '==', user.uid)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(async snapshot => {
            let data = snapshot.data();

            await storeLocalDataObject(LOCAL_STORAGE.USER, {
              ...localUser,
              birthDate: data.birthDate,
              firstName: data.firstName,
              lastName: data.lastName,
            });
          });
        });

      return {success: true};
    } catch (error) {
      dispatchUser({type: 'FAILED'});
      return {success: false, error};
    }
  };

  const usersRequest = async (requestType, reason, details, password) => {
    dispatchUser({type: 'PROCESSING'});
    const user = auth().currentUser;
    try {
      const date = firebase.firestore.FieldValue.serverTimestamp();
      var encryptPassword = Base64.encode(password);

      const requestInfo = {
        createdAt: date,
        statusChangeUserInfo: 'pending',
        statusDeleteUser: 'pending',
        updatedAt: date,
        id: user.uid,
        email: user.email,
        password: encryptPassword,
      };

      let request;
      if (reason == 'Full Name') {
        request = {
          reason: reason,
          firstName: details.firstName,
          lastName: details.lastName,
          createdAt: date,
          status: 'pending',
        };
      } else if (reason == 'Date of Birth') {
        request = {
          reason: reason,
          birthDate: details,
          createdAt: date,
          status: 'pending',
        };
      } else {
        request = {
          reason: reason,
          moreDetails: details,
          createdAt: date,
          status: 'pending',
        };
      }

      await usersRequestCollection.doc(user.uid).set(requestInfo);
      await usersRequestCollection
        .doc(user.uid)
        .collection(requestType)
        .doc(reason)
        .set(request);

      await usersRequestCollection
        .doc(user.uid)
        .collection(requestType)
        .doc(reason)
        .update({...request, id: reason});

      dispatchUser({
        type: 'SUCCESS',
        payload: {user: getUserById(user.uid)},
      });

      return {success: true};
    } catch (error) {
      dispatchUser({type: 'FAILED'});
      return {success: false, error};
    }
  };

  const getUsersRequest = async () => {
    const localUser = await getLocalDataObject(LOCAL_STORAGE.USER);
    try {
      let err;
      await usersRequestCollection
        .where('statusDeleteUser', '==', 'approved')
        .where('id', '==', localUser.id)
        .get()
        .then(querySnapshot => {
          if (!querySnapshot.empty) {
            setIsAccountDeleted(true);
            err = true;
          } else {
            err = false;
          }
        });
      return {success: err};
    } catch (error) {
      console.log('error', error.toString());
      return {success: false};
    }
  };

  const userContext = {
    user: userState.user,
    isLoading: userState.isLoading,
    errorMessage: userState.errorMessage,
    hasError: userState.hasError,
    isLoggedIn: userState.isLoggedIn,
    currentUser,
    signout,
    signin,
    addUser,
    updateUserEmail,
    updateUserPassword,
    updateUserContactNumber,
    dispatchUser,
    setCurrentUser,
    setIsLoggedIn,
    showModalInstructionsFood,
    setModalInstructionsFood,
    showModalInstructionsHome,
    setModalInstructionsHome,
    showModalInstructionsSettings,
    setModalInstructionsSettings,
    allowNotifications,
    setAllowNotifications,
    usersRequest,
    getUsersRequest,
    isAccountDeleted,
    setIsAccountDeleted,
    getUser,
  };

  return (
    <UserContext.Provider value={userContext}>
      {props.children}
    </UserContext.Provider>
  );
};

export {UserProvider, UserContext};
