import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './assets/styles/index.less'

Vue.config.productionTip = false
var a
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
