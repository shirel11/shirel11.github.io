import { createWebHistory, createRouter } from "vue-router";
import Home from "./components/Home.vue";
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
// lazy-loaded
const Profile = () => import("./components/Profile.vue")
const NotFound = () => import("./components/NotFound.vue")
const BoardModerator = () => import("./components/BoardModerator.vue")
const Display = () => import("./components/Display.vue")

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/home",
    component: Home,
  },
  {
    path: "/login",
    name:'login',
    component: Login,
  },
  {
    path: "/login/:Msg",
    name:'loginParams',
    component: Login,
  },
  {
    path: "/register",
    name:'register',
    component: Register,
  },
  {
    path: "/profile",
    name: "profile",
    // lazy-loaded
    component: Profile,
  },
  {
    path: "/NotFound/:message",
    name: "NotFound",
    component: NotFound,
  },
  {
    path: "/NotFound",
    name: "NotFound",
    component: NotFound,
  },
  {
    path: "/mod",
    name: "moderator",
    // lazy-loaded
    component: BoardModerator,
  },
  {
    path: "/display/:guid",
    name: "display",
    // lazy-loaded
    component: Display,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
const Pages=[];
router.beforeEach((to, from, next) => {
  const publicPages = ['login', 'register','display','NotFound'];
  const authRequired = !publicPages.includes(to.name);
  const loggedIn = localStorage.getItem('user');
  // trying to access a restricted page + not logged in
  // redirect to login page
  if (authRequired && !loggedIn) {
    //Routing to request page after login
    Pages.push(to.name);
    next('/login');
  } else {
    if(loggedIn){//Routing to request page after login
      var page =Pages.pop();
      if(page){
       console.log("page",page);
       next('/'+page);
      }
     else
     next();
    }else
    next();
  }
});

export default router  ;