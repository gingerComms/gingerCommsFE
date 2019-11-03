// Contains the store variable which implements all of the defaults/mutations

const defaults = {
  authToken: '',
  user: {},
  isLoading: false,
  activeAccount: {},
  snackbarError: {
    message: '',
    show: false
  }
}

// Global module loaded on first app load.
export default {
  namespaced: true,

  state: Object.assign({}, defaults),

  mutations: {
    toggleLoading (state) {
      state.isLoading = !state.isLoading;
    },
    // eslint-disable-next-line
    resetStore (state) {
      state = Object.assign(state, defaults);
    },
    // Update User
    updateUser (state, { authToken, userObj }) {
      state.authToken = authToken;
      state.user = userObj;
    },
    // Updates the active account
    updateActiveAccount (state, activeAccount) {
      state.activeAccount = activeAccount;
    },
    errorUpdate (state, { message, show }) {
      state.snackbarError = {
        message: message,
        show: show
      }
      console.log('Updated snackbar', state.snackbarError)
    }
  },

  getters: {
    isAuthenticated: state => {
      return state.authToken != '';
    }
  }
}
