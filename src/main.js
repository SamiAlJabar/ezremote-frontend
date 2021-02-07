import Vue from "vue";
import Moment from "vue-moment";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import BootstrapVue from "bootstrap-vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus, faPlay, faInfoCircle, faStop, faPaperPlane, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import vueXlsxTable from "vue-xlsx-table";
import "./custom.scss";

library.add(faPlus, faPlay, faInfoCircle, faStop, faPaperPlane, faCheck);

Vue.use(BootstrapVue);
Vue.use(Moment);
Vue.use(vueXlsxTable, { rABS: false });

Vue.config.productionTip = false;

Vue.filter("amount", function(value) {
  if (!value) return "";
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
});

Vue.mixin({
  methods: {
    errorAlerts(error) {
      if (error.response) {
        return error.response.data.message;
      } else {
        return error.message;
      }
    },
    async jsonToFormData(data) {
      const formData = new FormData();
      await this.buildFormData(formData, data);
      return formData;
    },
    buildFormData(formData, data, parentKey) {
      if (
        data &&
        typeof data === "object" &&
        !(data instanceof Date) &&
        !(data instanceof File)
      ) {
        Object.keys(data).forEach(key => {
          this.buildFormData(
            formData,
            data[key],
            parentKey ? `${parentKey}[${key}]` : key
          );
        });
      } else {
        const value = data == null ? "" : data;
        formData.append(parentKey, value);
      }
    }
    // readPDF(file) {
    //   let dataBuffer = fs.readFileSync(file);
    //   pdf(dataBuffer).then(function(data) {
    //     // number of pages
    //     console.log(data.numpages);
    //     // number of rendered pages
    //     console.log(data.numrender);
    //     // PDF info
    //     console.log(data.info);
    //     // PDF metadata
    //     console.log(data.metadata);
    //     // PDF.js version
    //     // check https://mozilla.github.io/pdf.js/getting_started/
    //     console.log(data.version);
    //     // PDF text
    //     console.log(data.text);
    //   });
    // }
  }
});

Vue.component('font-awesome-icon', FontAwesomeIcon);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
