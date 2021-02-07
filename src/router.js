import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login.vue";
import Registration from "./views/Registration.vue";
import EmployeeBoard from "./views/EmployeeBoard.vue";
import AdminOrganization from "./views/AdminOrganization.vue";
import SystemChat from "./views/SystemChat.vue";


Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "Login",
      component: Login
    },
    {
      path: "/register",
      name: "Registration",
      component: Registration
    },
    {
      path: "/board",
      name: "EmployeeBoard",
      component: EmployeeBoard
    },
    {
      path: "/management",
      name: "AdminOrganization",
      component: AdminOrganization
    },
    {
      path: "/chat",
      name: "SystemChat",
      component: SystemChat
    },
  ]
});
