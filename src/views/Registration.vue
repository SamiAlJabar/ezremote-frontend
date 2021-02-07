<template>
  <div class="div-body">
    <b-row class="custom-container">
      <b-col cols="12">
        <b-container style="margin-top: 20vh;">
          <b-row class="custom-row">
            <b-col class="col-md-6 col-sm-11" style="margin: auto; padding: 0px !important">
              <div style="width: 100%; display: inline-block">
                <h3 style="float: left">
                  <b>Sign Up</b>
                </h3>
              </div>
              <b-form @submit.prevent="submitForm" v-show="!loadingActive">
                <div style="float: left; width: 100%;">
                  <input type="text" required v-model="username" class="form-control" placeholder="Full Name">
                </div>
                <br>
                <br>
                <div style="float: left; width: 100%;">
                  <input type="password" required v-model="password" class="form-control" placeholder="Password">
                </div>
                <br>
                <br>
                <div style="float: left; width: 100%;">
                  <input type="email" required v-model="email" class="form-control" placeholder="Email">
                </div>
                <br>
                <br>
                <div style="float: left; width: 100%;">
                  <b-form-select required v-model="role"  :options="options"></b-form-select>
                </div>
                <br>
                <br>
                <div style="float: left;">
                  <a href="/"><u>Sign In</u></a>
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
        <p class="text-left">Your account has been created successfully!</p>
      </div>
      <b-button color="primary" class="mt-3" block @click="$bvModal.hide('modal-success')">CLOSE</b-button>
    </b-modal>
    <b-modal id="modal-failure" hide-footer>
      <template v-slot:modal-title>
        FAILURE
      </template>
      <div class="d-block text-center">
        <p class="text-left">Something went wrong!</p>
      </div>
      <b-button color="primary" class="mt-3" block @click="$bvModal.hide('modal-failure')">CLOSE</b-button>
    </b-modal>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "../axios_instance.js";
import { setTimeout } from 'timers';

export default {
  name: "Registration",
  data() {
    return {
      username: null,
      password: null,
      role: null,
      email: null,
      loadingActive: false,
      options: [
        { value: null, text: 'Please select a role' },
        { value: 'employee', text: 'Employee' },
        { value: 'admin', text: 'Boss' },
      ]
    };
  },
  methods: {
    async submitForm() {
      try {
        let response = await axios.post('/insert/users', {
          username: this.username,
          password: this.password,
          email: this.email,
          role: this.role,
        });
        this.$bvModal.show('modal-success');
        setTimeout(() => {
          this.$router.push("/");
        }, 2000);
      } catch (error) {
        this.$bvModal.show('modal-failure');
      }
      this.username = null;
      this.password = null;
      this.email = null;
      this.role = null;
    },
  }
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
