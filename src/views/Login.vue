<template>
  <div class="div-body">
    <b-row class="custom-container">
      <b-col cols="12">
        <b-container style="margin-top: 25vh;">
          <b-row class="custom-row">
            <b-col class="col-md-6 col-sm-11" style="margin: auto; padding: 0px !important">
              <div style="width: 100%; display: inline-block">
                <h3 style="float: left">
                  <b>Sign In</b>
                </h3>
              </div>
              <b-form @submit.prevent="submitForm">
                <div style="float: left; width: 100%;">
                  <input type="email" required v-model="email" class="form-control" placeholder="email">
                </div>
                <br>
                <br>
                <div style="float: left; width: 100%;">
                  <input type="password" required v-model="password" class="form-control" placeholder="Password">
                </div>
                <br>
                <br>
                <div style="float: left;">
                  <a href="/register"><u>Create an account</u></a>
                </div>
                <div style="float: right; width: 15%;">
                  <b-button  style="width: 100%;" variant="primary" type="submit"><font-awesome-icon icon="check" /></b-button>
                </div>
              </b-form>
            </b-col>
          </b-row>
        </b-container>
      </b-col>
    </b-row>
    <b-modal id="modal-success" hide-footer>
      <template v-slot:modal-title>
        SUCCESS
      </template>
      <div class="d-block text-center">
        <p class="text-left">Information has been stored successfully!</p>
      </div>
      <b-button class="mt-3" block @click="$bvModal.hide('modal-success')">CLOSE</b-button>
    </b-modal>
    <b-modal id="modal-failure" hide-footer>
      <template v-slot:modal-title>
        FAILURE
      </template>
      <div class="d-block text-center">
        <p class="text-left">Error!</p>
      </div>
      <b-button class="mt-3" block @click="$bvModal.hide('modal-failure')">CLOSE</b-button>
    </b-modal>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "../axios_instance.js";

export default {
  name: "Login",
  data() {
    return {
      email: null,
      password: null,
      loadingActive: false,
    };
  },
  methods: {
    async submitForm() {
      this.loadingActive = true;
      try {
        let response = await axios.post('/auth/signin', {
          email: this.email,
          password: this.password
        });
        localStorage.setItem('userInfo', JSON.stringify(response.data));
        if(response.data.role == "admin") {
          this.$router.push("/management");
        } else {
          this.$router.push("/board");
        }
      } catch (error) {
        this.$bvModal.show('modal-failure');
      }
    },
  },
  mounted() {
    // let obj = JSON.parse(localStorage.getItem('userInfo'));
  },
};
</script>

<style scoped lang="scss">
.div-body {
  overflow-x: hidden !important;
}
.custom-row {
  padding-top: 7px;
  padding-bottom: 7px;
}
table,
td,
th {
  border: 1px solid #ddd !important;
  text-align: left !important;
}

table {
  border-collapse: collapse !important;
  width: 100% !important;
}

th,
td {
  padding: 7px !important;
}

td:hover {
  background-color: #f0f0f0;
  cursor: pointer;
}
</style>
