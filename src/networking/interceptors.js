import Vue from 'vue';
import VueResource from 'vue-resource';
import store from '../store';
import router from '../router/router';

// HTTP Lib
Vue.use(VueResource)

var authenticationInterceptor = function (request) {
    var sameDomain = request.url.indexOf(process.env.VUE_APP_API_URL) >= 0
    // Setting the auth token if it's present
    if (store.getters['common/isAuthenticated'] && sameDomain) {
        request.headers.set('Authorization', 'Bearer ' + store.state.common.authToken)
    }
    
    // Redirect to auth if Token expires/Log errors
    return function (response) {
        console.log(response.status, response.body);

        if (response.status == 401 && response.body.msg == 'Token has expired') {
            store.commit('common/resetStore');
            if (router.currentRoute.route != '/login' && router.currentRoute.route != '/sign-up') {
                router.push('/login');
            }
        }

        if (response.status >= 400) {
            var message = response.body.status || response.body.msg || response.body.message || response.body.error;
            if (message != undefined) {
                store.commit('common/errorUpdate', { message: message, show: true })
            } else {
                store.commit('common/errorUpdate', { message: response.statusText, show: true })
            }
        }
    }
}

export default {
    addInterceptors () {
        Vue.http.interceptors.push(authenticationInterceptor)
    }
}
