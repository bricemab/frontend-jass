import { createStore } from 'vuex';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import JwtDecode from 'jwt-decode';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import createPersistedState from 'vuex-persistedstate';
import { ApplicationDecryptedToken, UserRoles, UserType } from '@/Types/GlobalType';
import moment from 'moment';
import Utils from '@/utils/Utils';
import Global from '@/utils/Global';

const axios = Global.instanceAxios;
const initialState: {
  errorMessage: string;
  status: string;
  token?: string;
  user?: UserType;
  userRole?: UserRoles;
} = {
  errorMessage: '',
  status: '',
  token: localStorage.getItem('token') || '',
  user: undefined,
  userRole: undefined
};

const persistedStateStorage = JSON.parse(localStorage.getItem('vuex-persisted-state') || JSON.stringify(initialState));

const store = createStore({
  state: {
    ...persistedStateStorage
  },
  getters: {
    user: (state) => state.user,
    userRole: (state) => state.userRole,
    isLoggedIn: (state) => !!state.userRole,
    authStatus: (state) => state.status,
    getRole: (state) => state.userRole
  },
  // plugins: [createPersistedState()],
  mutations: {
    auth_request (state) {
      state.status = 'loading';
    },
    auth_success (state, data) {
      state.status = 'success';
      state.token = data.token;
      state.user = data.user;
      state.userRole = data.role || 'USER_LOGGED';
    },
    auth_error (state) {
      state.status = 'error';
      state.token = '';
      state.user = undefined;
      state.userRole = undefined;
    },
    logout (state) {
      state.status = '';
      state.token = '';
      state.user = undefined;
      state.userRole = undefined;
    },
    updateProfilePicture (state, location) {
      state.user.profilePath = location;
    },
    updateUser (state, user) {
      state.user = user;
    }
  },
  actions: {
    updateUser ({ commit }, user) {
      commit('updateUser', user);
    },
    updateProfilePicture ({ commit }, location) {
      commit('updateProfilePicture', location);
    },
    login ({ commit }, user) {
      return new Promise(function (resolve, reject) {
        commit('auth_request');
        Utils.postEncodedToBackend('/users/authentication', user)
          .then(function (response) {
            if (!response.success) {
              resolve(response);
            }
            const { data } = response;
            const { token, role, user } = data;

            if (data && token) {
              const tokenDecoded: ApplicationDecryptedToken =
                JwtDecode(token) || {};

              if (tokenDecoded.currentUser) {
                tokenDecoded.currentUser.role = role;
                axios.defaults.headers.common['x-user-token'] = token;
                axios.defaults.headers.get['x-user-token'] = token;
                sessionStorage.setItem('token', token);
                sessionStorage.setItem('first-login', 'true');
                sessionStorage.setItem('logout-time', moment().add(8, 'hours').format('YYYY-MM-DD HH:mm:ss'));
                commit('auth_success', {
                  token,
                  user: tokenDecoded.currentUser,
                  role: tokenDecoded.currentUser.role
                });
                resolve(response);
              } else {
                commit('auth_error');
                sessionStorage.removeItem('token');
                resolve(response);
              }
            } else {
              commit('auth_error');
              sessionStorage.removeItem('token');
              resolve(response);
            }
          })
          .catch(function (e) {
            commit('auth_error');
            sessionStorage.removeItem('token');
            reject(e);
          });
      });
    },
    register ({ commit }, user) {
      return new Promise(function (resolve, reject) {
        commit('auth_request');
        Utils.postEncodedToBackend('/users/register', user)
          .then(function (response) {
            if (!response.success) {
              resolve(response);
            }
            const { data } = response;
            const { token, role, user } = data;

            if (data && token) {
              const tokenDecoded: ApplicationDecryptedToken =
                JwtDecode(token) || {};

              if (tokenDecoded.currentUser) {
                tokenDecoded.currentUser.role = role;
                axios.defaults.headers.common['x-user-token'] = token;
                axios.defaults.headers.get['x-user-token'] = token;
                sessionStorage.setItem('token', token);
                sessionStorage.setItem('first-login', 'true');
                commit('auth_success', {
                  token,
                  user: tokenDecoded.currentUser,
                  role: tokenDecoded.currentUser.role
                });
                resolve(response);
              } else {
                commit('auth_error');
                sessionStorage.removeItem('token');
                resolve(response);
              }
            } else {
              commit('auth_error');
              sessionStorage.removeItem('token');
              resolve(response);
            }
          })
          .catch(function (e) {
            commit('auth_error');
            sessionStorage.removeItem('token');
            reject(e);
          });
      });
    },
    logout ({ commit }) {
      return new Promise(function (resolve) {
        commit('logout');
        sessionStorage.clear();
        delete axios.defaults.headers.common['x-user-token'];
        resolve(true);
      });
    }
  },
  modules: {
  }
});

const persistedState = createPersistedState({
  storage: window.localStorage,
  key: 'vuex-persisted-state'
});

store.subscribe(function (mutation, state) {
  localStorage.setItem('vuex-persisted-state', JSON.stringify(state));
});

export default store;
