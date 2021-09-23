import Vue from 'vue'
import VueRouter from 'vue-router'
//懒加载
const Home = () => import('../views/home/Home')
const Category = () => import('../views/category/Category')
const Cart = () => import('../views/cart/Cart')
const Profile = () => import('../views/profile/Profile')


//1 安装插件
Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect: '/home',
    meta: {
      title: '首页'
    }
  },
  {
    path: '/home',
    component: Home,
    meta: {
      title: '首页'
    }
  },
  {
    path: '/category',
    component: Category,
    meta: {
      title: '商品分类'
    }
  },
  {
    path: '/cart',
    component: Cart,
    meta: {
      title: '购物车'
    }
  },
  {
    path: '/profile',
    component: Profile,
    meta: {
      title: '我的'
    }
  }
]

//2 创建router
const router = new VueRouter({
  routes,
  mode: 'history',
})

router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title
  next();
})

//3 导出
export default router