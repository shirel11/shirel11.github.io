import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from './plugins/font-awesome'
import { ToastPlugin } from "@syncfusion/ej2-vue-notifications";
import { registerLicense } from '@syncfusion/ej2-base';

// Registering Syncfusion license key
registerLicense('ORg4AjUWIQA/Gnt2VVhhQlFaclhJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxRdkNhXH9dcnNVQGVUUkw=');
createApp(App)
  .use(router)
  .use(store).use(ToastPlugin)
  .component("font-awesome-icon", FontAwesomeIcon).provide('$Pages', [])
  .mount("#app");
 