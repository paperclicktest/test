// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import Profile from "./components/Profile";
import Login from "./components/Login";
require("../node_modules/bootstrap/dist/css/bootstrap.css");
import "@/assets/css/main.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
Vue.config.productionTip = false;

/* eslint-disable no-new */
router.beforeEach((to, from, next) => {
  if (
    localStorage.getItem("access_token") === null &&
    to.name !== "Login" &&
    to.path !== "/login" &&
    to.path !== "/"
  ) {
    router.push("/");
  } else {
    next();
  }
});

new Vue({
  el: "#app",
  router,
  components: { App },

  template: "<App/>",
});
