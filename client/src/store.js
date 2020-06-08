import Vue from "vue";
import Vuex from "vuex";
import router from "./router";
import { defaultClient as apolloClient } from "./main";

import {
  GET_POSTS,
  SIGNIN_USER,
  SIGNUP_USER,
  GET_CURRENT_USER,
  ADD_POST,
} from "./queries";
import { ApolloClient } from "apollo-boost";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    posts: [],
    loading: false,
    error: null,
    authError: null,
  },
  mutations: {
    setUser: (state, payload) => {
      state.user = payload;
    },
    setPosts: (state, payload) => {
      state.posts = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    },
    clearUser: (state) => (state.user = null),
    setError: (state, payload) => {
      state.error = payload;
    },
    clearError: (state) => (state.error = null),
    setAuthError: (state, payload) => {
      state.authError = payload;
    },
  },
  actions: {
    getCurrentUser: ({ commit }) => {
      commit("setLoading", true);
      apolloClient
        .query({
          query: GET_CURRENT_USER,
        })
        .then(({ data }) => {
          commit("setLoading", false);
          // Add user data to state
          commit("setUser", data.getCurrentUser);
          console.log(data.getCurrentUser);
        })
        .catch((err) => {
          commit("setLoading", false);
          console.error(err);
        });
    },
    addPost: ({ commit }, payload) => {
      apolloClient
        .mutate({
          mutation: ADD_POST,
          variables: payload,
          update: (cache, { data: { addPost } }) => {
            // First read the query you want to update
            const data = cache.readQuery({ query: GET_POSTS });
            // Create updated data
            data.getPosts.unshift(addPost);
            // Write updated data back to query
            console.log(data);
            cache.writeQuery({
              query: GET_POSTS,
              data,
            });
          },
          // optimisticResponse garantit que les données sont ajoutées immédiatement comme nous l'avons spécifié pour la fonction de mise à jour
          optimisticResponse: {
            __typename: "Mutation",
            addPost: {
              __typename: "Post",
              _id: -1,
              ...payload,
            },
          },
        })
        .then(({ data }) => {
          commit("setLoading", false);
          console.log(data.addPost);
        })
        .catch((err) => {
          commit("setLoading", false);
          commit("setError", err);
          console.error(err);
        });
    },
    getPosts: ({ commit }, payload) => {
      commit("setLoading", true);
      apolloClient
        .query({
          query: GET_POSTS,
        })
        .then(({ data }) => {
          commit("setPosts", data.getPosts);
          commit("setLoading", false);
        })
        .catch((err) => {
          commit("setLoading", false);
          console.error(err);
        });
    },
    signinUser: ({ commit }, payload) => {
      commit("clearError");
      commit("setLoading", true);
      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload,
        })
        .then(({ data }) => {
          commit("setLoading", false);
          localStorage.setItem("token", data.singinUser.token);
          // to make sure created method is run in main.js (we run getCurrentUser), reload the page
          router.go();
          console.log(data.singinUser);
        })
        .catch((err) => {
          commit("setLoading", false);
          commit("setError", err);
          console.error(err);
        });
    },
    signupUser: ({ commit }, payload) => {
      commit("clearError");
      commit("setLoading", true);
      apolloClient
        .mutate({
          mutation: SIGNUP_USER,
          variables: payload,
        })
        .then(({ data }) => {
          commit("setLoading", false);
          localStorage.setItem("token", data.signupUser.token);
          // to make sure created method is run in main.js (we run getCurrentUser), reload the page
          router.go();
          console.log(data.singinUser);
        })
        .catch((err) => {
          commit("setLoading", false);
          commit("setError", err);
          console.error(err);
        });
    },
    signoutUser: async ({ commit }) => {
      // Clear user in state
      commit("clearUser");

      // Remove token in localStorage
      localStorage.setItem("token", "");

      // End session
      await apolloClient.resetStore();
      console.dir(apolloClient);

      //Redirect to home
      router.push("/");
    },
  },
  getters: {
    user: (state) => state.user,
    userFavorites: (state) => state.user && state.user.favorites,
    posts: (state) => state.posts,
    loading: (state) => state.loading,
    error: (state) => state.error,
    authError: (state) => state.authError,
  },
});
