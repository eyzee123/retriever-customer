const defaultCartState = {
  items: [],
  isLoading: false,
  error: '',
  addItem: item => {},
  updateItem: item => {},
  removeItem: id => {},
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'PROCESSING':
      return {
        ...state,
        error: '',
        isLoading: true,
      };
    case 'SUCCESS':
      return {
        ...state,
        error: '',
        isLoading: false,
        items: action.payload.item,
      };
    case 'ERROR':
      return {
        ...state,
        error: action.payload.error,
        isLoading: false,
      };
    case 'EMPTY':
      return {
        ...state,
        error: '',
        items: [],
      };

    default:
      return state;
  }
  //   if (action.type === 'ADD') {
  //   }

  //   if (action.type === 'REMOVE') {
  //     const existingCartItemIndex = state.items.findIndex(
  //       item => item.id === action.id,
  //     );
  //     const existingItem = state.items[existingCartItemIndex];
  //     const updatedTotalAmount = state.totalAmount - existingItem.price;
  //     let updatedItems;
  //     if (existingItem.amount === 1) {
  //       updatedItems = state.items.filter(item => item.id !== action.id);
  //     } else {
  //       const updatedItem = {...existingItem, amount: existingItem.amount - 1};
  //       updatedItems = [...state.items];
  //       updatedItems[existingCartItemIndex] = updatedItem;
  //     }

  //     const updatedAllItems = {};

  //     return {
  //       items: updatedItems,
  //       totalAmount: updatedTotalAmount,
  //     };
  //   }

  //   return defaultCartState;
};

export {cartReducer, defaultCartState};
