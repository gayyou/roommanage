// 模块项的定义
export interface ModuleItem {
  // 模块的id，这个是区别不同的模块，方便选择列表样式的修改
  id?: number;
  // 模块的基础url,也就是这个模块的基础路径
  url: string;
  // 模块名称，左侧选择栏使用的
  disable?: boolean;
  name: string;
  // 图标的url
  iconUrl?: string;
  activeIconUrl?: string;
  children?: ModuleItem[]
}

let uid = 1;
/**
 * @description 为底层模块加上id，方便到时候进行修改左边侧边栏的样式
 */
const makeRouteConfigMap = (routeConfig: ModuleItem[]) => {
  let map = new Map();
  for (let i = 0; i < routeConfig.length; i++) {
    routeConfig[i].id = uid;
    uid++;
    map.set(routeConfig[i].url, routeConfig[i]);
    // @ts-ignore
    if (routeConfig[i].children && routeConfig[i].children.length) {
      let baseUrl = routeConfig[i].url;
      // @ts-ignore
      let childrenList: ModuleItem[] = routeConfig[i].children;

      childrenList.forEach(item => {
        item.url = baseUrl+ '/' + item.url;
        map.set(item.url, item);
        item.id = uid;
        uid++;
      })
    }
    // 处理完子项后再将父的url设置为空
    if (routeConfig[i].disable == true) {
      routeConfig[i].url = '';
    }
  }

  return map;
};

const routeConfig: ModuleItem[] = [
  {
    name: '综合管理',
    url: '/index/integratemanage',
    disable: true,
    iconUrl: require('@assets/images/icons/main_manage.png'),
    activeIconUrl: require('@assets/images/icons/main_manage.png'),
    children: [
      {
        name: '门店管理',
        url: 'shopmanage',
        iconUrl: '',
        activeIconUrl: ''
      },
      {
        name: '自习室管理',
        url: 'studyroommanage',
        iconUrl: '',
        activeIconUrl: ''
      }
    ]
  },
  {
    name: '订单管理',
    url: '/index/ordermanage',
    disable: true,
    iconUrl: require('@assets/images/icons/order_manage.png'),
    activeIconUrl: require('@assets/images/icons/order_manage.png'),
    children: [
      {
        name: '充值订单',
        url: 'rechargeorder',
        iconUrl: '',
        activeIconUrl: ''
      },
      {
        name: '预约订单',
        url: 'reservationorder',
        iconUrl: '',
        activeIconUrl: ''
      },
      {
        name: '套餐订单',
        url: 'packageorder',
        iconUrl: '',
        activeIconUrl: ''
      }
    ]
  },
  {
    name: '预约情况',
    url: '/index/reservationmanage',
    iconUrl: require('@assets/images/icons/pre_order.png'),
    activeIconUrl: require('@assets/images/icons/pre_order.png'),
  },
  {
    name: '套餐管理',
    url: '/index/packagemanage',
    iconUrl: require('@assets/images/icons/package_manage.png'),
    activeIconUrl: require('@assets/images/icons/package_manage.png')
  },
  {
    name: '用户管理',
    url: '/index/usermanage',
    iconUrl: require('@assets/images/icons/user_manage.png'),
    activeIconUrl: require('@assets/images/icons/user_manage.png'),
    children: [
      {
        name: '用户信息',
        url: 'userinfo',
        iconUrl: '',
        activeIconUrl: ''
      },
      {
        name: '用户黑名单',
        url: 'blacklist',
        iconUrl: '',
        activeIconUrl: ''
      }
    ]
  },
  {
    name: '退款管理',
    url: '/index/refundmanage',
    iconUrl: require('@assets/images/icons/refund_manage.png'),
    activeIconUrl: require('@assets/images/icons/refund_manage.png')
  }
];

export const routeMap = makeRouteConfigMap(routeConfig);

export { routeConfig };
