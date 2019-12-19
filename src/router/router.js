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

// Active Team Modifier
router.beforeEach((to, from, next) => {
    if (to.params.teamId !== undefined) {
        // Updating the active team in store if the route has a teamId param
        store.commit('common/updateActiveTeam', to.params.teamId);
        var apiUrl = process.env.VUE_APP_API_URL + '/team/'+to.params.teamId+'/assignees';
        Vue.http.get(apiUrl).then(response => {
            store.commit('common/updateActiveTeamUsers', response.body);
        })
    }
    
    next();
});

export default router;
