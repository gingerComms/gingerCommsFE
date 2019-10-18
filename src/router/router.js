import routes from './routes';
import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';

Vue.use(VueRouter);

const router = new VueRouter({
	routes
});

// Auth Navigation Guard
router.beforeEach((to, from, next) => {
    // Pass if this leads to an authentication/index route
    if (to.path == '/login' || to.path == '/sign-up' || to.path == '/') {
        next()
    } else {
        // Redirect to /login if user isn't authenticated
        if (!store.getters['common/isAuthenticated']) {
            next('/login')
        } else {
            next()
        }
    }
});

export default router;
