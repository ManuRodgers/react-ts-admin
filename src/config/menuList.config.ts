export const menuList = [
  {
    title: 'Home', // 菜单标题名称
    key: '/admin/home', // 对应的path
    icon: 'home', // 图标名称
    isPublic: true, // 公开的
  },
  {
    title: 'products',
    key: '/admin/products',
    icon: 'appstore',
    children: [
      // 子菜单列表
      {
        title: 'category',
        key: '/admin/category',
        icon: 'bars',
      },
      {
        title: 'product',
        key: '/admin/product',
        icon: 'tool',
      },
    ],
  },

  {
    title: 'user',
    key: '/admin/user',
    icon: 'user',
  },
  {
    title: 'role',
    key: '/admin/role',
    icon: 'safety',
  },

  {
    title: 'charts',
    key: '/admin/charts',
    icon: 'area-chart',
    children: [
      {
        title: 'bar',
        key: '/admin/charts/bar',
        icon: 'bar-chart',
      },
      {
        title: 'line',
        key: '/admin/charts/line',
        icon: 'line-chart',
      },
      {
        title: 'pie',
        key: '/admin/charts/pie',
        icon: 'pie-chart',
      },
    ],
  },
  // {
  //   title: 'orders',
  //   key: '/order',
  //   icon: 'windows',
  // },
];

export type MenuList = typeof menuList;
