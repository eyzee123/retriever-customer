const orderInitialState = {
  order: {},
  deliveryDetails: {},
  promo: {},
  isLoading: false,
  success: null,
  errorMessage: '',
  setDeliveryDetails: (distance, duration) => {},
};

const orderReducer = (state = orderInitialState, action) => {
  switch (action.type) {
    case 'PROCESSING':
      return {
        isLoading: true,
      };
    case 'FAILED':
      return {
        isLoading: false,
        success: false,
        errorMessage: action.payload.order,
      };
    case 'SUCCESS':
      return {
        order: action.payload.order,
        isLoading: false,
        success: true,
      };
    case 'GET_DELIVERY_FEE':
      return {
        ...state,
        deliveryDetails: action.payload.deliveryDetails,
      };
    case 'ADD_ORDER_ITEM':
      return {
        ...state,
        order: action.payload.orderItem,
      };
    case 'ADD_PROMO_ITEM':
      return {
        ...state,
        promo: action.payload.promoItem,
      };
    default:
      return state;
  }
};

export {orderReducer, orderInitialState};
