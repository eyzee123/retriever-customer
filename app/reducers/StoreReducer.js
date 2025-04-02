const storeInitialState = {
  storeList: [],
  newStoreList: [],
  storiesList: [],
  isLoading: false,
  hasError: false,
  errorMessage: '',
};

const productInitialState = {
  productList: [],
  isLoading: false,
  hasError: false,
  errorMessage: '',
};

const categoryInitialState = {
  categoryList: [],
  isLoading: false,
  hasError: false,
  errorMessage: '',
};

const scheduleInitialState = {
  scheduleList: [],
  isLoading: false,
  hasError: false,
  errorMessage: '',
};

const addonsInitialState = {
  addonsList: [],
  isLoading: false,
  hasError: false,
  errorMessage: '',
};

const recommendProductsInitialState = {
  recommendProductsList: [],
  isLoading: false,
  hasError: false,
  errorMessage: '',
};

const topSellableProductsInitialState = {
  topSellableProductsList: {},
  isLoading: false,
  hasError: false,
  errorMessage: '',
};

const storeReducer = (state = storeInitialState, action) => {
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
        storeList: action.payload.store,
        newStoreList: action.payload.newStores,
        storiesList: action.payload.storeStories,
        isLoading: false,
        hasError: false,
      };
    default:
      return state;
  }
};

const productReducer = (state = productInitialState, action) => {
  switch (action.type) {
    case 'PROCESSING':
      return {
        productList: [],
        isLoading: true,
      };
    case 'FAILED':
      return {
        isLoading: false,
        hasError: true,
      };
    case 'SUCCESS':
      return {
        productList: action.payload.productList,
        isLoading: false,
        hasError: false,
      };
    default:
      return state;
  }
};

const categoryReducer = (state = categoryInitialState, action) => {
  switch (action.type) {
    case 'PROCESSING':
      return {
        categoryList: [],
        isLoading: true,
      };
    case 'FAILED':
      return {
        isLoading: false,
        hasError: true,
      };
    case 'SUCCESS':
      return {
        categoryList: action.payload.categoryList,
        isLoading: false,
        hasError: false,
      };
    default:
      return state;
  }
};

const scheduleReducer = (state = scheduleInitialState, action) => {
  switch (action.type) {
    case 'PROCESSING':
      return {
        scheduleList: [],
        isLoading: true,
      };
    case 'FAILED':
      return {
        isLoading: false,
        hasError: true,
      };
    case 'SUCCESS':
      return {
        scheduleList: action.payload.scheduleList,
        isLoading: false,
        hasError: false,
      };
    default:
      return state;
  }
};

const recommendProductsReducer = (
  state = recommendProductsInitialState,
  action,
) => {
  switch (action.type) {
    case 'PROCESSING':
      return {
        recommendProductsList: [],
        isLoading: true,
      };
    case 'FAILED':
      return {
        isLoading: false,
        hasError: true,
      };
    case 'SUCCESS':
      return {
        recommendProductsList: action.payload.recommendProductsList,
        isLoading: false,
        hasError: false,
      };
    default:
      return state;
  }
};

const topSellableProductReducer = (
  state = topSellableProductsInitialState,
  action,
) => {
  switch (action.type) {
    case 'PROCESSING':
      return {
        topSellableProductsList: [],
        isLoading: true,
      };
    case 'FAILED':
      return {
        isLoading: false,
        hasError: true,
      };
    case 'SUCCESS':
      return {
        topSellableProductsList: action.payload.topSellableProductsList,
        isLoading: false,
        hasError: false,
      };
    default:
      return state;
  }
};

const addonsReducer = (state = addonsInitialState, action) => {
  switch (action.type) {
    case 'PROCESSING':
      return {
        addonsList: [],
        isLoading: true,
      };
    case 'FAILED':
      return {
        isLoading: false,
        hasError: true,
      };
    case 'SUCCESS':
      return {
        addonsList: action.payload.addons,
        isLoading: false,
        hasError: false,
      };
    default:
      return state;
  }
};

export {
  storeReducer,
  storeInitialState,
  productReducer,
  productInitialState,
  categoryReducer,
  categoryInitialState,
  scheduleReducer,
  scheduleInitialState,
  recommendProductsReducer,
  recommendProductsInitialState,
  topSellableProductReducer,
  topSellableProductsInitialState,
};
