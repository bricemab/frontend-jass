import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import i18n from '@/locales/i18n';
import config from '@/config/config';

library.add(fas);

const app = createApp(App).use(i18n);
app.use(store).use(router).mount('#app');
app.component('font-awesome-icon', FontAwesomeIcon);
