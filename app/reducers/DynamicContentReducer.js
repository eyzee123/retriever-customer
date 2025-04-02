const dynamicContentFoodInitialState = {
  bannerFoodList: [],
  isLoading: false,
  hasError: false,
  errorMessage: '',
};

const dynamicContentHomeInitialState = {
  bannerHomeList: {},
  isLoading: false,
  hasError: false,
  errorMessage: '',
};

const dynamicContentFoodReducer = (
  state = dynamicContentFoodInitialState,
  action,
) => {
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
        bannerFoodList: action.payload.bannerFoodList,
        isLoading: false,
        hasError: false,
      };
    default:
      return state;
  }
};

const dynamicContentHomeReducer = (
  state = dynamicContentHomeInitialState,
  action,
) => {
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
        bannerHomeList: action.payload.bannerHomeList,
        isLoading: false,
        hasError: false,
      };
    default:
      return state;
  }
};

export {
  dynamicContentFoodReducer,
  dynamicContentFoodInitialState,
  dynamicContentHomeReducer,
  dynamicContentHomeInitialState,
};
