import Index from '../components/Index';
import Login from '../components/Login';
import Signup from '../components/Signup';
import Dashboard from '../components/Dashboard';
import TeamsDetail from '../components/TeamsDetail';
import TemplatesDetail from '../components/TemplatesDetail';
import NodesDetail from '../components/NodesDetail';
import AccountsList from '../components/AccountsList';
import AccountDetail from '../components/AccountDetail';

const routes = [
  { path: '/', component: Index },
  { path: '/login', component: Login },
  { path: '/sign-up', component: Signup },
  { path: '/dashboard', component: Dashboard },
  { path: '/accounts', component: AccountsList },
  { path: '/accounts/:accountId', component: AccountDetail },
  { path: '/teams/:teamId', component: TeamsDetail },
  { path: '/teams/:teamId/templates/:templateId', component: TemplatesDetail },
  { path: '/teams/:teamId/:nodeId', component: NodesDetail }
]

export default routes
