import Index from '../components/Index';
import Login from '../components/Login';
import Signup from '../components/Signup';
import Dashboard from '../components/Dashboard';
import TeamsDetail from '../components/TeamsDetail';

const routes = [
  { path: '/', component: Index },
  { path: '/login', component: Login },
  { path: '/sign-up', component: Signup },
  { path: '/dashboard', component: Dashboard },
  { path: '/teams/:teamId', component: TeamsDetail }
]

export default routes
