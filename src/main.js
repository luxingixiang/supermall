import Vue from 'vue'
import App from './App.vue'
//导入router
import router from './router'

Vue.config.productionTip = false
Vue.prototype.$bus = new Vue()

new Vue({
  render: h => h(App),
  //挂在router
  router,
}).$mount('#app')
