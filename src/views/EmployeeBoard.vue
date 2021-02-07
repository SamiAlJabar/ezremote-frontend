<template>
  <div class="div-body">
    <Navbar/>
    <b-row class="custom-container">
      <b-col cols="12">
        <b-container style="margin-top: 5vh;">
          <b-row class="custom-row">
            <b-col class="col-md-8 col-sm-11" style="margin: auto; padding: 0px !important">
              <div style="width: 100%; display: inline-block">
                <h3 style="float: left">
                  <b>My Tasks</b>
                </h3>
              </div>
              <b-form v-if="openFormTaskUpdate" @submit.prevent="submitFormTaskUpdate" style="margin-bottom: 10vh;">
                <div style="float: left; width: 100%;">
                  <b-form-select required v-model="taskProgress" :options="progressOptions"></b-form-select>
                </div>
                <br>
                <br>
                <div style="float: right; min-width: 15%;">
                  <b-button  style="width: 100%;" variant="primary" type="submit"><font-awesome-icon icon="check" /></b-button>
                </div>
                <div style="float: right; min-width: 15%; margin-right: 10px !important;">
                  <b-button  style="width: 100%;" type="button" @click="openFormTaskUpdate = false" >cancel</b-button>
                </div>
              </b-form>
              <table style="width: 100%; background-color: white !important;">
                <tr class="custom-header" style="border: 1px solid #ddd !important;">
                  <th>Task</th>
                  <th>Progress</th>
                  <th>Description</th>
                  <th>Goal</th>
                </tr>
                <tr @click="selectedTaskProgress(item)" v-for="(item) in taskList" v-bind:key="item">
                  <td style="display: none">{{item.id}}</td>
                  <td>{{item.task}}</td>
                  <td>{{item.status}}</td>
                  <td>{{item.description}}</td>
                  <td>{{item.goal}}</td>
                  <!-- <td>
                    <b-button @click="deleteEmployee(item.email, item.organizationId)" style="font-size: 13px;" variant="outline-danger">DELETE</b-button>
                  </td> -->
                </tr>
              </table>
            </b-col>
          </b-row>
          <b-row class="custom-row" style="margin-top: 3vh">
            <b-col class="col-md-8 col-sm-11" style="margin: auto; padding: 0px !important">
              <div style="width: 100%; display: inline-block">
                <h3 style="float: left">
                  <b>My Status</b>
                </h3>
              </div>
              <b-form @submit.prevent="submitFormStatus" style="margin-bottom: 10vh;">
                <div style="float: left; width: 100%;">
                  <label style="float: left"><b>Health Status</b></label>
                  <b-form-select required v-model="userHealthStatus" :options="healthStatusOptions"></b-form-select>
                </div>
                <br>
                <br>
                <div style="float: left; width: 100%; margin-top: 2vh;">
                  <label style="float: left"><b>Activity Status</b></label>
                  <b-form-select required v-model="userActivityStatus" :options="mainStatusOptions"></b-form-select>
                </div>
                <br>
                <br>
                <div style="margin-top: 2vh; float: right; min-width: 15%;">
                  <b-button  style="width: 100%;" variant="primary" type="submit">update</b-button>
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
        <p class="text-left">Task status has been updated!</p>
      </div>
      <b-button class="mt-3" block @click="$bvModal.hide('modal-success')">CLOSE</b-button>
    </b-modal>
    <b-modal id="modal-failure" hide-footer>
      <template v-slot:modal-title>
        FAILURE
      </template>
      <div class="d-block text-center">
        <p class="text-left">Something went wrong!</p>
      </div>
      <b-button class="mt-3" block @click="$bvModal.hide('modal-failure')">CLOSE</b-button>
    </b-modal>
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from "@/components/Navbar.vue";
import axios from "../axios_instance.js";

export default {
  name: "AdminOrganization",
  components: {
    Navbar
  },
  data() {
    return {
      username: null,
      taskProgress: null,
      taskList: [],
      openFormTaskUpdate: false,
      openForm: false,
      goalDescription: null,
      openFormEmployee: false,
      employeeEmail: null,
      selectdOrg: null,
      name: null,
      email: null,
      weblink: null,
      loadingActive: false,
      organization: [],
      employee: [],
      organizationId: null,
      userHealthStatus: null,
      userActivityStatus: null,
      priority: null,
      options: [{ value: null, text: 'Please select an organization' }],
      progressOptions: [
        { value: null, text: 'Please select progress' },
        { value: "Not Started", text: 'Not Started' },
        { value: "In Progress", text: 'In Progress' },
        { value: "Need Review", text: 'Need Review' }
      ],
      mainStatusOptions: [
        { value: null, text: 'Please select activity status' },
        { value: "active", text: 'active' },
        { value: "on leave", text: 'on leave' },
      ],
      healthStatusOptions: [
        { value: null, text: 'Please select health status' },
        { value: "Ok", text: 'Ok' },
        { value: "Ok and Vaccinated", text: 'Ok and Vaccinated' },
        { value: "Covid", text: 'Covid' },
        { value: "Need Mental Help", text: 'Need Mental Help' },
        { value: "Other Sickness", text: 'Other Sickness' }
      ],
    };
  },
  methods: {
    async submitFormStatus() {
      try {
        let response = await axios.post('/update/users', {
          email: this.email,
          status: this.userHealthStatus,
          leave_status: this.userActivityStatus,
        });      
        localStorage.setItem('userInfo', JSON.stringify({
          activityStatus: this.userActivityStatus,
          email: this.email,
          role: "employee",
          status: this.userHealthStatus,
          username: this.userActivityStatus
        }));
        this.$bvModal.show('modal-success');
      } catch (error) {
        this.$bvModal.show('modal-failure');
      }
    },
    selectedTaskProgress(item) {
      console.log(item);
      if(item.status == 'Completed') return;
      this.selectedTaskId = item.id;
      this.taskProgress = item.status;
      this.openFormTaskUpdate = true;
    },
    async submitFormTaskUpdate() {
      this.loadingActive = true;
      let empName = "";
      try {
        let response = await axios.post('/update/tasks', {
          id: this.selectedTaskId,
          assignedTo: this.email,
          empName: this.username,
          status: this.taskProgress,
        });
        this.openFormTaskUpdate = false;
        this.taskProgress = null;
        this.assignedTo = null;        
        await this.getGoalTasks();
        this.$bvModal.show('modal-success');
      } catch (error) {
        this.$bvModal.show('modal-failure');
      }
    },
    async getGoalTasks() {
      try {
        let response = await axios.get('/read/employeetasks/'+this.email);
        this.taskList = response.data;
        console.log("tasklist: ", this.taskList);
      } catch (error) {
        // this.$bvModal.show('modal-failure');
      }
    },
  },
  async mounted() {
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.email = userInfo.email;
    this.userHealthStatus = userInfo.status;
    this.userActivityStatus = userInfo.activityStatus;
    await this.getGoalTasks();
  },
};
</script>

<style scoped lang="scss">
.div-body {
  overflow-x: hidden !important;
}
.custom-row {
  padding-top: 7px;
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

.previewImg {
  max-width: 100%;
  max-height: 150px;
}

.sentence {
  text-align: left;
}
</style>
