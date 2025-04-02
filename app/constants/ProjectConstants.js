import {IMAGES} from './Images';

export const LOCAL_STORAGE = {
  DEVICE_ID: 'DEVICE_ID',
  USER: 'USER',
  PRIMARY_ADDRESS_ID: 'PRIMARY_ADDRESS_ID',
  APP_OPENED: 'APP_OPENED',
  STORIES: 'stories',
};

export const API_KEY = {
  GEO_API_KEY: 'AIzaSyCzCKhHT9IPhglpHSsaEzjWPDlk4yZWOzY',
};

export const STRING_FORMAT = {
  DATE_FORMAT: 'MM-DD-YYYY',
  COUNRTY_CODE: '+63',
};

export const LOCATION = {
  CURRENT_LOCATION: 'CURRENT_LOCATION',
  GRANTED_PERMISSION: 'granted',
};

export const BUTTON = {
  BTN_SEND_OTP: 'Send Otp',
  BTN_CONFIRM_OTP: 'Confirm',
};

export const NOTIFICATIONS = {
  NEW_MESSAGE_TITLE: 'New Message',
  NEW_ORDER_TITLE: 'Retriever Notification',
  NEW_ORDER_BODY: 'You receive new order!',
};

export const TIMER = {
  ORDER_PENDING: 8,
  OTP_RESEND: 30,
};

export const PROMO_TEXT = {
  SUB_TOTAL: 'Subtotal',
  DELIVERY_FEE: 'Delivery',
};

export const TRACKING_NUMBER = {
  PREFIX: '#ORDR',
};

export const FCM_SERVER = {
  URL: 'https://dev-retriever-server.firebaseapp.com/notifications',
};

//Instructions Data Food
export const instructionsFoodList = [
  {
    image: IMAGES.FOOD_INSTRUCTIONS_1,
  },
  {
    image: IMAGES.FOOD_INSTRUCTIONS_2,
  },
  {
    image: IMAGES.FOOD_INSTRUCTIONS_3,
  },
  {
    image: IMAGES.FOOD_INSTRUCTIONS_4,
  },
  {
    image: IMAGES.FOOD_INSTRUCTIONS_5,
  },
];

//Instructions Data Home
export const instructionsHomeList = [
  {
    image: IMAGES.HOME_INSTRUCTIONS_1,
  },
  {
    image: IMAGES.HOME_INSTRUCTIONS_2,
  },
  {
    image: IMAGES.HOME_INSTRUCTIONS_3,
  },
];
