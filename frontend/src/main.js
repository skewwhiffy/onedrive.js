import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import App from './app.vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFolderOpen, faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

library.add(faFile, faFolderOpen);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.config.productionTip = false;
Vue.use(BootstrapVue);

new Vue({
  render: h => h(App),
}).$mount('#app');
