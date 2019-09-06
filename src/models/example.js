
export default {

  namespace: 'public',

  state: {
    tableHeight: null,
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    * saveCompanies({payload}, {put}) {
      yield put({type: 'save', payload})
    },
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      yield put({ type: 'save' });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
