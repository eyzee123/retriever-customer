const addressInitialState = {
  address: {},
  isLoading: false,
  hasError: false,
  errorMessage: '',
};

const getAddressInitialState = {
  addressList: [],
  loadingAddress: false,
  hasError: false,
  errorMessage: '',
};

const addressReducer = (state = userInitialState, action) => {
  switch (action.type) {
    case 'ADDRESS_PROCESSING':
      return {
        isLoading: true,
      };
    case 'ADDRESS_SUCCESS':
      return {
        address: action.payload.address,
        isLoading: false,
        hasError: false,
      };
    case 'ADDRESS_FAILED':
      return {
        errorMessage: action.payload.errorMessage,
        isLoading: false,
        hasError: true,
      };

    default:
      return state;
  }
};

const getAddressReducer = (state = getAddressInitialState, action) => {
  switch (action.type) {
    case 'GET_ADDRESS_PROCESSING':
      return {
        loadingAddress: true,
      };
    case 'GET_ADDRESS_SUCCESS':
      return {
        addressList: action.payload.addressList,
        loadingAddress: false,
        hasError: false,
      };
    case 'GET_ADDRESS_FAILED':
      return {
        errorMessage: action.payload.errorMessage,
        loadingAddress: false,
        hasError: true,
      };

    case 'CLEAR_ADDRESS':
      return {
        loadingAddress: false,
        addressList: [],
      };

    default:
      return state;
  }
};

export { addressReducer, getAddressReducer, addressInitialState, getAddressInitialState };
