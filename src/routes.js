import Home from './components/Home.vue'
import Login from './components/auth/Login.vue'
import Logout from './components/auth/Logout.vue'
import Activities from './components/activities/Activities.vue'
import ActivitiesIndex from './components/activities/Index.vue'
import ActivitiesList from './components/activities/List.vue'
import ActivitiesDetail from './components/activities/Detail.vue'
import Tools from './components/tools/Tools.vue'
import Resources from './components/resources/Resources.vue'
import Setup from './components/setup/Setup.vue'
import Help from './components/help/Help.vue'
import Test from './components/test/Test.vue'
import NotFound from './components/NotFound.vue'

export const routes = [
  {path: '', name: 'home', component: Home, meta: {title: "Home"}},
  {path: '/login', name: 'login', component: Login,  meta: {title: "Login"}},
  {path: '/logout', name: 'logout', component: Logout, meta: {title: "Logout"}},

  {
    // don't name parent route if has children
    path: '/activities', component: Activities,
    children: [
      {path: '', name: 'activitiesIndex', component: ActivitiesIndex, meta: {title: "Activities - Overview"}},
      {path: 'list', name: 'activitiesList', component: ActivitiesList, meta: {title: "Activities - List"}},
      {path: ':id', name: 'activitiesDetail', component: ActivitiesDetail, props: true, meta: {title: "Activity Detail"}},
    ]
  },

  {path: '/tools', name: 'tools', component: Tools, meta: {title: "Tools"}},
  {path: '/resources', name: 'resources', component: Resources, auth: true, meta: {title: "Resource Library"}},
  {path: '/setup', name: 'setup', component: Setup, meta: {title: "Setup"}},
  {path: '/help', name: 'help', component: Help, meta: {title: "Help"}},

  // Test page
  {path: '/test', name: 'test', component: Test, meta: {title: "Test"}},

  // catch-all
  //{path: '*', redirect: '/'}
  {path: '*', component: NotFound}
]