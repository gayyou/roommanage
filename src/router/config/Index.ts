import {RouteConfig} from "vue-router";
import IndexLayout from "@/views/layout/IndexLayout.vue";

export const indexRouter: RouteConfig = {
  name: '主页',
  path: '/index',
  redirect: '/index/integratemanage',
  component: IndexLayout,
  meta: {
    title: '主页'
  },
  children: [
    {
      name: '综合管理',
      path: 'integratemanage',
      redirect: '/index/integratemanage/shopmanage',
      meta: {
        title: '综合管理'
      },
      component: () => import('@/views/integratManage/IntegratManage.vue')
    },
    {
      name: '门店管理',
      path: 'integratemanage/shopmanage',
      meta: {
        title: '门店管理'
      },
      component: () => import('@/views/integratManage/shopManage/ShopManage.vue')
    },
    {
      name: '房间管理',
      path: 'integratemanage/shopmanage/:storeId',
      meta: {
        title: '房间管理'
      },
      component: () => import('@/views/integratManage/shopManage/roomManage/RoomManage.vue')
    },
    {
      name: '座位管理',
      path: 'integratemanage/shopmanage/:storeId/:roomId:roomType',
      meta: {
        title: '座位管理'
      },
      component: () => import('@/views/integratManage/shopManage/roomManage/sitManage/SitManage.vue')
    },
    {
      name: '自习室管理',
      path: 'integratemanage/studyroommanage',
      meta: {
        title: '自习室管理'
      },
      component: () => import('@/views/integratManage/studyRoomManage/StudyRoomManage.vue')
    },
    {
      name: '订单管理',
      path: 'ordermanage',
      redirect: '/index/ordermanage/rechargeorder',
      meta: {
        title: '订单管理'
      },
      component: () => import('@/views/orderManage/OrderManage.vue')
    },
    {
      name: '充值订单',
      path: 'ordermanage/rechargeorder',
      meta: {
        title: '充值订单'
      },
      component: () => import('@/views/orderManage/rechargeOrder/RechargeOrder.vue')
    },
    {
      name: '套餐订单',
      path: 'ordermanage/packageorder',
      meta: {
        title: '套餐订单'
      },
      component: () => import('@/views/orderManage/packageOrder/PackageOrder.vue')
    },
    {
      name: '预约订单',
      path: 'ordermanage/reservationorder',
      meta: {
        title: '预约订单'
      },
      component: () => import('@/views/orderManage/reservationOrder/ReservationOrder.vue')
    },
    {
      name: '预约情况',
      path: 'reservationmanage',
      meta: {
        title: '预约情况'
      },
      component: () => import('@/views/reservationManage/ReservationManage.vue')
    },
    {
      name: '套餐管理',
      path: 'packagemanage',
      meta: {
        title: '套餐管理'
      },
      component: () => import('@/views/packageManage/PackageManage.vue')
    },
    {
      name: '用户管理',
      path: 'usermanage',
      redirect: '/index/usermanage/userinfo',
      meta: {
        title: '用户管理'
      },
      component: () => import('@/views/userManage/UserManage.vue')
    },
    {
      name: '用户信息',
      path: 'usermanage/userinfo',
      meta: {
        title: '用户信息'
      },
      component: () => import('@/views/userManage/userInfo/UserInfo.vue')
    },
    {
      name: '用户黑名单',
      path: 'usermanage/blacklist',
      meta: {
        title: '用户黑名单'
      },
      component: () => import('@/views/userManage/blackList/BlackList.vue')
    },
    {
      name: '退款管理',
      path: 'refundmanage',
      meta: {
        title: '退款管理'
      },
      component: () => import('@/views/refundManage/RefundManage.vue')
    }
  ]
};
