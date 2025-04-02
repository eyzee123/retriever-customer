const ratingInitialState = {
  ratings: [],
  averageRatings: 0,
  totalRatingsCount: 0,
  isLoading: false,
};

const ratingReducer = (state = ratingInitialState, action) => {
  switch (action.type) {
    case 'PROCESSING':
      return {
        isLoading: true,
      };
    case 'SUCCESS':
      return {
        isLoading: false,
      };
    case 'ERROR':
      return {
        isLoading: false,
      };
    case 'GET_RATINGS':
      return {
        ratings: action.payload.ratings,
        averageRatings: action.payload.averageRatings,
        totalRatingsCount: action.payload.totalRatingsCount,
        isLoading: false,
      };
    default:
      return state;
  }
};

export {ratingReducer, ratingInitialState};
