import {RouteConfig} from "vue-router";
import IndexLayout from "@/views/layout/IndexLayout.vue";
import Login from "@/views/login/Login.vue";

export const loginRoute: RouteConfig = {
  name: '登陆',
  path: '/login',
  redirect: '',
  component: Login,
  meta: {
    title: '登陆'
  },
};
