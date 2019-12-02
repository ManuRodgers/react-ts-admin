import { IConfig } from 'umi-types';
// ref: https://umijs.org/config/
const config: IConfig = {
  treeShaking: true,
  routes: [
    {
      path: '/',
      component: '../layouts/BasicLayout',
      routes: [
        {
          path: '/admin',
          component: '../pages/Admin/Admin',
          routes: [
            { path: '/admin', redirect: '/admin/home' },
            { path: '/admin/home', component: '../pages/Home/Home' },
            { path: '/admin/category', component: '../pages/Category/Category' },
            {
              path: '/admin/product',
              component: '../pages/ProductHome/ProductHome',
            },
            {
              path: '/admin/product/detail',
              component: '../pages/ProductDetail/ProductDetail',
            },
            {
              path: '/admin/product/addupdate',
              component: '../pages/ProductAddUpdate/ProductAddUpdate',
            },
            {
              path: '/admin/product/*',
              redirect: '/admin/product',
            },
            { path: '/admin/role', component: '../pages/Role/Role' },
            { path: '/admin/user', component: '../pages/User/User' },
            { path: '/admin/charts/bar', component: '../pages/Charts/Bar' },
            { path: '/admin/charts/pie', component: '../pages/Charts/Pie' },
            { path: '/admin/charts/line', component: '../pages/Charts/Line' },
          ],
        },
        { path: '/login', component: '../pages/Login/Login' },
        { path: '*', redirect: '/admin' },
      ],
    },
  ],
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: false,
        title: 'react-ts-admin',
        dll: true,
        routes: {
          exclude: [
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//,
          ],
        },
      },
    ],
  ],
  theme: {
    '@primary-color': '#1DA57A',
  },
  proxy: {
    '/api': {
      target: 'http://localhost:5000/',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  disableRedirectHoist: true,
};

export default config;
