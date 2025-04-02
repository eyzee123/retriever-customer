const addonsInitialState = {
    addonsList: [],
    isLoading: false,
    hasError: false,
    errorMessage: '',
};


const variantInitialState = {
    variantList: [],
    isLoading: false,
    hasError: false,
    errorMessage: '',
};

const ingredientsInitialState = {
    ingredientsList: [],
    isLoading: false,
    hasError: false,
    errorMessage: '',
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
                addonsList: action.payload.addonsList,
                isLoading: false,
                hasError: false,
            };
        default:
            return state;
    }
};

const variantReducer = (state = variantInitialState, action) => {
    switch (action.type) {
        case 'PROCESSING':
            return {
                variantList: [],
                isLoading: true,
            };
        case 'FAILED':
            return {
                isLoading: false,
                hasError: true,
            };
        case 'SUCCESS':
            return {
                variantList: action.payload.variantList,
                isLoading: false,
                hasError: false,
            };
        default:
            return state;
    }
};

const ingredientsReducer = (state = ingredientsInitialState, action) => {
    switch (action.type) {
        case 'PROCESSING':
            return {
                ingredientsList: [],
                isLoading: true,
            };
        case 'FAILED':
            return {
                isLoading: false,
                hasError: true,
            };
        case 'SUCCESS':
            return {
                ingredientsList: action.payload.ingredientsList,
                isLoading: false,
                hasError: false,
            };
        default:
            return state;
    }
};

export {
    addonsReducer, addonsInitialState,
    variantReducer, variantInitialState,
    ingredientsReducer, ingredientsInitialState
};