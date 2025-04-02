const chatInitialState = {
    messages: [],
    isLoading: false,
    hasError: false,
    errorMessage: '',
};

const chatReducer = (state = storeInitialState, action) => {
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
                messages: action.payload.messages,
                isLoading: false,
                hasError: false,
            };
        default:
            return state;
    }
};

export { chatReducer, chatInitialState };