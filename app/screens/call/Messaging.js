import React, {useState, useEffect, useCallback, useContext} from 'react';
import {
  GiftedChat,
  Bubble,
  InputToolbar,
  Send,
  Composer,
} from 'react-native-gifted-chat';
import axios from 'axios';
import MainFrame from '../../components/containers/MainFrame';
import MainScreen from '../../components/containers/MainScreen';
import MessagingHeader from '../../components/headers/MessagingHeader';
import {ChatContext} from '../../provider/ChatProvider';
import {BORDER, COLORS, FONTS, SPACING} from '../../styles/theme';
import {Image, View, StyleSheet, Linking} from 'react-native';
import {windowHeight, windowWidth} from '../../utils/Dimensions';
import {UserContext} from '../../provider/UserProvider';
import UserAvatar from 'react-native-user-avatar';
import {FCM_SERVER, NOTIFICATIONS} from '../../constants/ProjectConstants';
import {COLLECTION} from '../../constants/Collections';
import firestore from '@react-native-firebase/firestore';

const Messaging = ({navigation, route}) => {
  const chatContext = useContext(ChatContext);
  const userCtx = useContext(UserContext);
  const {riderDetails} = route.params;

  const [messages, setMessages] = useState([]);
  const [currentUser, setUser] = useState(userCtx.currentUser);

  useEffect(() => {
    //need to set current user to indentify messages sent
    //get messages in firestore
    chatContext.getMessages();
    console.log(currentUser);

    console.log(riderDetails.name);
    //stop listening to snapshot
    return () => chatContext.stopSubscribing();
  }, []);

  const sendPushNotification = async (userId, message) => {
    const tokenResponse = await firestore()
      .collection(COLLECTION.RIDER_ACCOUNTS)
      .doc(userId) //receiver id
      .get();
    if (!tokenResponse.data()) {
      return;
    }
    const token = tokenResponse.data().token;
    console.log('token send', token);
    try {
      const orderData = {
        type: 'chat',
      };
      const response = await axios.post(FCM_SERVER.URL, {
        token: token,
        title: NOTIFICATIONS.NEW_MESSAGE_TITLE,
        body: message,
        orderData,
      });
      // resetCartState();
      console.log('send notif success', response);
    } catch (err) {
      //Do nothing
      console.log('send notif error', err.response);
      return;
    }
  };

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );

    const {_id, createdAt, text, user} = messages[0];
    //add message in firestore
    console.log({
      _id,
      createdAt,
      message: text,
      user,
    });
    chatContext.addMessage({
      _id,
      createdAt,
      message: text,
      user,
    });

    sendPushNotification(riderDetails.email, text);
  }, []);

  const ChatMessageBubble = props => (
    <Bubble
      {...props}
      textStyle={styles.textStyle}
      wrapperStyle={styles.wrapperStyle}
    />
  );

  function renderInputToolbar(props) {
    return (
      <InputToolbar
        {...props}
        containerStyle={styles.input}
        textInputStyle={{color: 'black'}}
      />
    );
  }

  const CustomSend = props => (
    <View>
      <Send
        {...props}
        disabled={!props.text}
        containerStyle={styles.chatContainer}>
        <Image
          {...props}
          source={require('../../assets/icons/send.png')}
          style={styles.image}
        />
      </Send>
    </View>
  );

  const customAvatar = props => (
    <UserAvatar
      size={windowHeight * 0.04}
      name={props.currentMessage.user?.fullName}
      textColor={
        props.currentMessage.user?.type === 'rider'
          ? COLORS.red
          : COLORS.success
      }
      bgColor={'#E5E5E6'}
    />
  );

  return (
    <MainScreen>
      <MessagingHeader
        fullname_initials={riderDetails.name}
        riderName={riderDetails.name}
        unit={riderDetails.unit}
        plateNo={riderDetails.plateNo}
        onPress={() => Linking.openURL(`tel:${riderDetails.phoneNumber}`)}
      />

      <MainFrame fullscreen>
        <View style={styles.container}>
          <GiftedChat
            onSend={messages => onSend(messages)}
            messages={chatContext.messages}
            isLoadingEarlier
            // renderTime={() => null}
            renderAvatar={props => customAvatar(props)}
            renderComposer={props => (
              <Composer {...props} placeholder={'Message...'} />
            )}
            messagesContainerStyle={{paddingBottom: 30}}
            renderSend={props => CustomSend(props)}
            renderInputToolbar={props => renderInputToolbar(props)}
            renderBubble={props => <ChatMessageBubble {...props} />}
            user={{
              _id: currentUser?.id,
              email: currentUser?.email,
              fullName: `${currentUser?.firstName} ${currentUser?.lastName}`,
              type: 'customer',
              //update avatar
              // avatar: 'https://i.pravatar.cc/300',
            }}
          />
        </View>
      </MainFrame>
    </MainScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: SPACING.small,
  },
  chatContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.inputBorderColor,
    borderRadius: BORDER.circle,
    marginHorizontal: SPACING.medium,
    marginBottom: SPACING.small,
  },
  image: {
    height: windowHeight * 0.03,
    width: windowHeight * 0.03,
    marginHorizontal: SPACING.small,
    alignSelf: 'center',
  },
  textStyle: {
    left: {
      ...FONTS.regular,
      color: COLORS.darkGreen,
    },
    right: {
      ...FONTS.regular,
      color: COLORS.white,
    },
  },
  wrapperStyle: {
    left: {
      padding: SPACING.x_small,

      backgroundColor: '#F2F2F2',
    },
    right: {
      padding: SPACING.x_small,
      // borderRadius: BORDER.circle,
      backgroundColor: COLORS.orange,
    },
  },
});
export default Messaging;
