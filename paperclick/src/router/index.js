import Vue from "vue";
import Router from "vue-router";
import Login from "@/components/Login";
import Profile from "@/components/Profile";

Vue.use(Router);
const token = localStorage.getItem("access_token");
console.log(token);
let userLoggedIn = false;

if (token) {
  userLoggedIn = true;
}
export default new Router({
  routes: [
    {
      path: "/",
      name: "Login",

      component: Login,
    },
    {
      path: "/profile",
      name: "Profile",
      component: Profile,
    },
  ],
});
