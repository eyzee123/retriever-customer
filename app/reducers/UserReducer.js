const userInitialState = {
  user: {},
  isLoading: false,
  hasError: false,
  errorMessage: '',
  isLoggedIn: false,
};

const userReducer = (state = userInitialState, action) => {
  switch (action.type) {
    case 'PROCESSING':
      return {
        isLoading: true,
      };
    case 'FAILED':
      return {
        isLoading: false,
        hasError: true,
      };
    case 'SUCCESS':
      return {
        user: action.payload.user,
        isLoading: false,
        hasError: false,
      };
    case 'AUTH':
      return {
        isLoggedIn: action.payload.isLoggedIn,
        user: action.payload.user,
        isLoading: false,
        hasError: false,
      };
    default:
      return state;
  }
};

export {userReducer, userInitialState};
