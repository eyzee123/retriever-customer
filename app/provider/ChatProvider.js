import React, {createContext, useReducer, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {chatInitialState, chatReducer} from '../reducers/ChatReducer';
import {showErrorMessage} from '../utils/FlashMessage';
import Labels from '../constants/Labels';
import {COLLECTION} from '../constants/Collections';

const ChatContext = createContext();

const ChatProvider = props => {
  const [chatCollection, setChatCollection] = useState(null);

  const [messages, setMessages] = useState([]);
  const [chatState, dispatchMessages] = useReducer(
    chatReducer,
    chatInitialState,
  );

  let unsubscribe;

  const setCollection = async orderID => {
    setChatCollection(
      firestore()
        .collection(COLLECTION.CURRENT_ORDERS)
        .doc(orderID)
        .collection('chat'),
    );
    return {sucess: true};
  };

  const getMessages = async () => {
    dispatchMessages({type: 'PROCESSING'});
    try {
      let messageArray = [];
      const getChat = chatCollection.orderBy('createdAt', 'desc');
      unsubscribe = getChat.onSnapshot(querySnapshot => {
        // console.log('listening');
        setMessages(
          querySnapshot.docs.map(doc => ({
            _id: doc.data()._id,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().message,
            user: doc.data().user,
          })),
        );
      });

      dispatchMessages({
        type: 'SUCCESS',
        payload: {
          messages: messageArray,
        },
      });

      return {data: messageArray};
    } catch (error) {
      showErrorMessage(Labels.genericError);
      console.log('error ' + error);
      dispatchMessages({
        type: 'FAILED',
        payload: {
          errorMessage: error.message,
        },
      });
      return {data: []};
    }
  };

  const stopSubscribing = async () => {
    unsubscribe();
  };

  const addMessage = async message => {
    // dispatchMessages({ type: 'PROCESSING' });
    try {
      chatCollection.add(message);
    } catch (error) {
      showErrorMessage(Labels.genericError);
      console.log('error ' + error);
      dispatchMessages({
        type: 'FAILED',
        payload: {
          errorMessage: error.message,
        },
      });
      return {data: []};
    }
  };

  const chatContext = {
    messages: messages,
    isLoading: chatState.isLoading,
    getMessages,
    setMessages,
    addMessage,
    stopSubscribing,
    setCollection,
  };

  return (
    <ChatContext.Provider value={chatContext}>
      {props.children}
    </ChatContext.Provider>
  );
};

export {ChatProvider, ChatContext};
