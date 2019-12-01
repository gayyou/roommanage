import Vue from 'vue';
import Router, {RouteConfig} from 'vue-router';
import {indexRouter} from "@/router/config/Index";
import {loginRoute} from "@/router/config/Login";

Vue.use(Router);

export const constantRoutes: RouteConfig[] = [
  indexRouter,
  loginRoute
];

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: constantRoutes
});
