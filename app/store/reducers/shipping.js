import { SET_SHIPPING } from '../actions/shipping';

const initialState = {
  methods: [],
  lastUpdated: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_SHIPPING: {
      return {
        ...state,
        methods: action.methods,
        lastUpdated: action.lastUpdated,
      };
    }
  }

  return state;
};
