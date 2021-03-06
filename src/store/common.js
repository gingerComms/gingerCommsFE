// Contains the store variable which implements all of the defaults/mutations

const defaults = {
  authToken: '',
  user: {},
  isLoading: false,
  activeAccount: {},
  snackbarError: {
    message: '',
    show: false
  },
  activeTeamId: '',
  userAccounts: [],
  activeTeamUsers: []
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
    },
    updateActiveTeam (state, activeTeamId) {
      state.activeTeamId = activeTeamId;
    },
    updateActiveTeamUsers (state, activeTeamUsers) {
      // Updates the users array with the users assigned to the active team
      state.activeTeamUsers = activeTeamUsers;
    },
    updateUserAccounts (state, userAccounts) {
      state.userAccounts = userAccounts;
    },
    userAccountCreated (state, account) {
      state.userAccounts.push(account);
    },
    accountChanged (state, changedAccount) {
      var index = state.userAccounts.indexOf(
        state.userAccounts.filter(ac => ac.id == changedAccount.id)[0])
      state.userAccounts[index].title = changedAccount.title;
      state.userAccounts[index].avatarLink = changedAccount.avatarLink;
    }
  },

  getters: {
    isAuthenticated: state => {
      return state.authToken != '';
    }
  }
}
