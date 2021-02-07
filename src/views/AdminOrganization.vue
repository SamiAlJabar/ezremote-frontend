<template>
  <div class="div-body">
    <AdminNavbar/>
    <b-row class="custom-container">
      <b-col cols="12">
        <b-container style="margin-top: 5vh;">
          <b-row class="custom-row">
            <b-col class="col-md-8 col-sm-11" style="margin: auto; padding: 0px !important">
              <div style="width: 100%; display: inline-block">
                <h3 style="float: left">
                  <b>List of organization</b>
                </h3>
                <b-button  style="float: right" variant="primary" @click="openForm = true" type="button"><font-awesome-icon icon="plus" /></b-button>
              </div>
              <b-form v-if="openForm" @submit.prevent="submitForm" style="margin-bottom: 10vh;">
                <div style="float: left; width: 100%;">
                  <input type="text" required v-model="name" class="form-control" placeholder="Organization Name">
                </div>
                <br>
                <br>
                <div style="float: left; width: 100%;">
                  <input type="text" required v-model="weblink" class="form-control" placeholder="Website Url / Link">
                </div>
                <br>
                <br>
                <div style="float: right; min-width: 15%;">
                  <b-button  style="width: 100%;" variant="primary" type="submit"><font-awesome-icon icon="check" /></b-button>
                </div>
                <div style="float: right; min-width: 15%; margin-right: 10px !important;">
                  <b-button  style="width: 100%;" type="button" @click="openForm = false" >cancel</b-button>
                </div>
              </b-form>
            </b-col>
          </b-row>
          <b-row class="custom-row">
            <b-col class="col-md-8 col-sm-11" style="margin: auto; padding: 0px !important">
              <table style="width: 100%; background-color: white !important;">
                <tr class="custom-header" style="border: 1px solid #ddd !important;">
                  <th>Organization Name</th>
                  <th>Total Employee</th>
                  <!-- <th>Total Projects</th> -->
                </tr>
                <tr @click="getSelectedOrg(item)" v-for="(item) in organization" v-bind:key="item">
                  <td>{{item.name}}</td>
                  <td>{{item.totalEmployee || 0}}</td>
                  <!-- <td>{{item.totalProjects || 0}}</td> -->
                  <!-- <td>
                    <b-button @click="deleteDocument(item.id)" style="font-size: 13px;" variant="outline-danger">DELETE</b-button>
                  </td> -->
                </tr>
              </table>
            </b-col>
          </b-row>
          <b-row v-if="selectdOrg" style="margin-top: 5vh !important;">
            <b-col class="col-md-8 col-sm-12 text-center" style="margin: auto;">
              <ul class="nav nav-tabs justify-content-center">
                <li class="nav-item">
                  <a class="nav-link" @click="tabOptions = 'goal'" href="#">Goal</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#" @click="tabOptions = 'employee'">Employee</a>
                </li>
              </ul>
            </b-col>
          </b-row>
          <b-row v-if="tabOptions == 'employee' && selectdOrg" class="custom-row" style="margin-top: 3vh !important;">
            <b-col class="col-md-8 col-sm-11" style="margin: auto; padding: 0px !important">
              <div style="width: 100%; display: inline-block">
                <h3 style="float: left">
                  <b>Employee of {{selectdOrg.name}}</b>
                </h3>
                <b-button  style="float: right" variant="primary" @click="openFormEmployee = true" type="button"><font-awesome-icon icon="plus" /></b-button>
              </div>
              <b-form v-if="openFormEmployee" @submit.prevent="submitFormEmployee" style="margin-bottom: 10vh;">
                <div style="float: left; width: 100%;">
                  <input type="email" required v-model="employeeEmail" class="form-control" placeholder="Employee Email">
                </div>
                <br>
                <br>
                <div style="float: right; min-width: 15%;">
                  <b-button  style="width: 100%;" variant="primary" type="submit"><font-awesome-icon icon="check" /></b-button>
                </div>
                <div style="float: right; min-width: 15%; margin-right: 10px !important;">
                  <b-button  style="width: 100%;" type="button" @click="openFormEmployee = false" >cancel</b-button>
                </div>
              </b-form>
              <table style="width: 100%; background-color: white !important;">
                <tr class="custom-header" style="border: 1px solid #ddd !important;">
                  <th>Name</th>
                  <th>Health</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Organization Name</th>
                  <th>Action</th>
                </tr>
                <tr v-for="(item) in employee" v-bind:key="item">
                  <td>{{item.username}}</td>
                  <td>{{item.status}}</td>
                  <td>{{item.email}}</td>
                  <td>{{item.leave_status}}</td>
                  <td>{{item.organizationName}}</td>
                  <td>
                    <b-button @click="deleteEmployee(item.email, item.organizationId)" style="font-size: 13px;" variant="outline-danger">DELETE</b-button>
                  </td>
                </tr>
              </table>
            </b-col>
          </b-row>
          <b-row class="custom-row" v-if="tabOptions == 'goal' && selectdOrg"  style="margin-top: 3vh !important;">
            <b-col class="col-md-8 col-sm-11" style="margin: auto; padding: 0px !important">
              <div style="width: 100%; display: inline-block">
                <h3 style="float: left">
                  <b>Goals of {{selectdOrg.name}}</b>
                </h3>
                <b-button  style="float: right" variant="primary" @click="openFormGoal = true" type="button"><font-awesome-icon icon="plus" /></b-button>
              </div>
              <b-form v-if="openFormGoal" @submit.prevent="submitFormGoal" style="margin-bottom: 10vh;">
                <div style="float: left; width: 100%;">
                  <input type="text" required v-model="nameGoal" class="form-control" placeholder="Goal Title">
                </div>
                <br>
                <br>
                <div style="float: left; width: 100%;">
                  <input type="text" required v-model="goalDescription" class="form-control" placeholder="Goal Description">
                </div>
                <br>
                <br>
                <div style="float: left; width: 100%;">
                  <b-form-select required v-model="organizationId" :options="options"></b-form-select>
                </div>
                <br>
                <br>
                <div style="float: left; width: 100%;">
                  <b-form-select required v-model="priority" :options="priorityOptions"></b-form-select>
                </div>
                <br>
                <br>
                <div style="float: right; min-width: 15%;">
                  <b-button  style="width: 100%;" variant="primary" type="submit"><font-awesome-icon icon="check" /></b-button>
                </div>
                <div style="float: right; min-width: 15%; margin-right: 10px !important;">
                  <b-button  style="width: 100%;" type="button" @click="openFormGoal = false" >cancel</b-button>
                </div>
              </b-form>
              <table style="width: 100%; background-color: white !important;">
                <tr class="custom-header" style="border: 1px solid #ddd !important;">
                  <th>Title</th>
                  <th>Description</th>
                  <th>Priority</th>
                  <th>Tasks Completed</th>
                </tr>
                <!-- {{goalList}} -->
                <tr @click="getSelectedGoal(item)" v-for="(item) in goalList" v-bind:key="item">
                  <td>{{item.goal}}</td>
                  <td>{{item.description}}</td>
                  <td>{{item.priority}}</td>
                  <td>{{item.taskCompleted || 0}} / {{item.totalTasks || 0}}</td>
                  <!-- <td>
                    <b-button @click="deleteEmployee(item.email, item.organizationId)" style="font-size: 13px;" variant="outline-danger">DELETE</b-button>
                  </td> -->
                </tr>
              </table>
            </b-col>
          </b-row>
          <b-row class="custom-row" v-if="tabOptions == 'goal' && selectedGoal"  style="margin-top: 3vh !important;">
            <b-col class="col-md-8 col-sm-11" style="margin: auto; padding: 0px !important">
              <div style="width: 100%; display: inline-block">
                <h3 style="float: left">
                  <b>List of Tasks under "{{selectedGoal.goal}}"</b>
                </h3>
                <b-button  style="float: right" variant="primary" @click="openFormTask = true; openFormTaskUpdate = false;" type="button"><font-awesome-icon icon="plus" /></b-button>
              </div>
              <b-form v-if="openFormTask" @submit.prevent="submitFormTask" style="margin-bottom: 10vh;">
                <div style="float: left; width: 100%;">
                  <input type="text" required v-model="task" class="form-control" placeholder="Task Title">
                </div>
                <br>
                <br>
                <div style="float: left; width: 100%;">
                  <input type="text" required v-model="taskDescription" class="form-control" placeholder="Task Description">
                </div>
                <br>
                <br>
                <div style="float: left; width: 100%;">
                  <b-form-select required v-model="assignedTo" :options="taskEmpOptions"></b-form-select>
                </div>
                <br>
                <br>
                <div style="float: right; min-width: 15%;">
                  <b-button  style="width: 100%;" variant="primary" type="submit"><font-awesome-icon icon="check" /></b-button>
                </div>
                <div style="float: right; min-width: 15%; margin-right: 10px !important;">
                  <b-button  style="width: 100%;" type="button" @click="openFormTask = false" >cancel</b-button>
                </div>
              </b-form>
              <!-- samisami -->
              <b-form v-if="openFormTaskUpdate" @submit.prevent="submitFormTaskUpdate" style="margin-bottom: 10vh;">
                <div style="float: left; width: 100%;">
                  <b-form-select required v-model="taskProgress" :options="progressOptions"></b-form-select>
                </div>
                <br>
                <br>
                <div style="float: left; width: 100%;">
                  <b-form-select required v-model="assignedTo" :options="taskEmpOptions"></b-form-select>
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
                  <th>Assigned</th>
                </tr>
                <tr @click="selectedTaskProgress(item)" v-for="(item) in taskList" v-bind:key="item">
                  <td style="display: none">{{item.id}}</td>
                  <td>{{item.task}}</td>
                  <td>{{item.status}}</td>
                  <td>{{item.empName}}</td>
                  <!-- <td>
                    <b-button @click="deleteEmployee(item.email, item.organizationId)" style="font-size: 13px;" variant="outline-danger">DELETE</b-button>
                  </td> -->
                </tr>
              </table>
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
        <p class="text-left">Organization has been created successfully!</p>
      </div>
      <b-button class="mt-3" block @click="$bvModal.hide('modal-success')">CLOSE</b-button>
    </b-modal>
    <b-modal id="modal-success-goal" hide-footer>
      <template v-slot:modal-title>
        SUCCESS
      </template>
      <div class="d-block text-center">
        <p class="text-left">New goal has been created successfully!</p>
      </div>
      <b-button class="mt-3" block @click="$bvModal.hide('modal-success')">CLOSE</b-button>
    </b-modal>
    <b-modal id="modal-success-task-update" hide-footer>
      <template v-slot:modal-title>
        SUCCESS
      </template>
      <div class="d-block text-center">
        <p class="text-left">Task has been updated successfully!</p>
      </div>
      <b-button class="mt-3" block @click="$bvModal.hide('modal-success-task-update')">CLOSE</b-button>
    </b-modal>
    <b-modal id="modal-success-task" hide-footer>
      <template v-slot:modal-title>
        SUCCESS
      </template>
      <div class="d-block text-center">
        <p class="text-left">New task has been created successfully!</p>
      </div>
      <b-button class="mt-3" block @click="$bvModal.hide('modal-success-task')">CLOSE</b-button>
    </b-modal>
    <b-modal id="modal-success-2" hide-footer>
      <template v-slot:modal-title>
        SUCCESS
      </template>
      <div class="d-block text-center">
        <p class="text-left">Employee has been added successfully!</p>
      </div>
      <b-button class="mt-3" block @click="$bvModal.hide('modal-success-2')">CLOSE</b-button>
    </b-modal>
    <b-modal id="modal-success-delete" hide-footer>
      <template v-slot:modal-title>
        SUCCESS
      </template>
      <div class="d-block text-center">
        <p class="text-left">Employee has been deleted successfully!</p>
      </div>
      <b-button class="mt-3" block @click="$bvModal.hide('modal-success-delete')">CLOSE</b-button>
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
import AdminNavbar from "@/components/AdminNavbar.vue";
import axios from "../axios_instance.js";

export default {
  name: "AdminOrganization",
  components: {
    AdminNavbar
  },
  data() {
    return {     
      taskProgress: null, 
      selectedTaskId: null,
      task: null,
      taskDescription: null,
      openFormTask: false,
      openFormTaskUpdate: false,
      tabOptions: "goal",
      openFormGoal: false,
      openForm: false,
      openFormEmployee: false,
      employeeEmail: null,
      selectdOrg: null,
      selectedGoal: null,
      name: null,
      email: null,
      weblink: null,
      loadingActive: false,
      organization: [],
      employee: [],
      goalList: [],
      taskList: [],
      assignedTo: null,
      progressOptions: [
        { value: null, text: 'Please select progress' },
        { value: "Not Started", text: 'Not Started' },
        { value: "In Progress", text: 'In Progress' },
        { value: "Need Review", text: 'Need Review' },
        { value: "Completed", text: 'Completed' }
      ],
      options: [{ value: null, text: 'Please select an organization' }],
      taskEmpOptions: [{ value: null, text: 'Please assign an employee for this task' }],
      priorityOptions: [
        { value: null, text: 'Please select priority' },
        { value: "High", text: 'High' },
        { value: "Medium", text: 'Medium' },
        { value: "Low", text: 'Low' }
      ],
      organizationId: null,
      priority: null,
      goalDescription: null,
      nameGoal: null,
    };
  },
  methods: {
    selectedTaskProgress(item) {
      this.employee.forEach(emp => {
        if(emp.username == item.empName) {
          this.assignedTo = emp.email;
        }
      });
      this.selectedTaskId = item.id;
      this.taskProgress = item.status;
      this.openFormTaskUpdate = true;
      this.openFormTask = false;
    },
    async submitFormTaskUpdate() {
      this.loadingActive = true;
      let empName = "";
      this.employee.forEach(emp => {
        if(this.assignedTo == emp.email) {
          empName = emp.username;
        }
      });
      try {
        let response = await axios.post('/update/tasks', {
          id: this.selectedTaskId,
          assignedTo: this.assignedTo,
          empName: empName,
          status: this.taskProgress,
        });
        this.openFormTaskUpdate = false;
        this.selectedGoal = false;
        this.taskProgress = null;
        this.assignedTo = null;        
        await this.getOrgGoals();
        this.$bvModal.show('modal-success-task-update');
      } catch (error) {
        this.$bvModal.show('modal-failure');
      }
    },
    async getSelectedOrg(org) {
      this.selectdOrg = org;
      await this.getOrgEmployee();
      await this.getOrgGoals();
    },
    async getSelectedGoal(org) {
      this.selectedGoal = org;
      await this.getOrgGoals();
      await this.getGoalTasks();
    },
    async submitForm() {
      this.loadingActive = true;
      try {
        let response = await axios.post('/insert/organizations', {
          email: this.email,
          name: this.name,
          weblink: this.weblink
        });
        this.openForm = false;
        this.name = null;
        this.weblink = null;
        await this.getOrganization();
        this.$bvModal.show('modal-success');
      } catch (error) {
        this.$bvModal.show('modal-failure');
      }
    },
    async submitFormTask() {
      this.loadingActive = true;
      let empName = "";
      this.employee.forEach(emp => {
        if(this.assignedTo == emp.email) {
          empName = emp.username;
        }
      });
      try {
        let response = await axios.post('/insert/tasks', {
          creatorEmail: this.email,
          task: this.task,
          description: this.taskDescription,
          organizationId: this.selectedGoal.organizationId,
          goalId: this.selectedGoal.id,
          assignedTo: this.assignedTo,
          empName: empName
        });
        this.openFormTask = false;
        this.selectedGoal = null;
        this.taskDescription = null;
        this.task = null;
        this.assignedTo = null;
        await this.getOrgGoals();
        this.$bvModal.show('modal-success-task');
      } catch (error) {
        this.$bvModal.show('modal-failure');
      }
    },
    async submitFormGoal() {
      this.loadingActive = true;
      try {
        let response = await axios.post('/insert/goals', {
          email: this.email,
          goal: this.nameGoal,
          description: this.goalDescription,
          organizationId: this.organizationId,
          priority: this.priority
        });
        this.openFormGoal = false;
        this.selectdOrg = null;
        this.nameGoal = null;
        this.goalDescription = null;
        this.organizationId = null;
        this.priority = null;
        await this.getOrganization();
        this.$bvModal.show('modal-success-goal');
      } catch (error) {
        this.$bvModal.show('modal-failure');
      }
    },
    async submitFormEmployee() {
      this.loadingActive = true;
      try {
        let response = await axios.post('/insert/employeeorganization', {
          organizationHead: this.email,
          userEmail: this.employeeEmail,
          organizationId: this.selectdOrg.id,
          organizationName: this.selectdOrg.name
        });
        this.openFormEmployee = false;
        this.employeeEmail = null;
        this.selectdOrg = null;
        await this.getOrganization();
        this.$bvModal.show('modal-success-2');
      } catch (error) {
        this.$bvModal.show('modal-failure');
      }
    },
    async deleteEmployee(email, orgId) {
      try {
        let response = await axios.post('/delete/employeeorganization', {
          userEmail: email,
          organizationId: orgId,
        });
        this.selectdOrg = null;
        await this.getOrganization();
        this.$bvModal.show('modal-success-delete');
      } catch (error) {
        this.$bvModal.show('modal-failure');
      }
    },
    async getGoalTasks() {
      try {
        let response = await axios.get('/read/tasks/'+this.selectedGoal.id);
        this.taskList = response.data;
        console.log("tasklist: ", this.taskList);
        console.log("employee: ", this.employee);
      } catch (error) {
        // this.$bvModal.show('modal-failure');
      }
    },
    async getOrgGoals() {
      try {
        let response = await axios.get('/read/goals/'+this.selectdOrg.id);
        this.goalList = response.data.goals;
        this.goalList.forEach(goal => {
          goal.totalTasks = 0;
          goal.taskCompleted = 0;
          response.data.tasks.forEach(task => {
            if(task.goalId == goal.id) {
              goal.totalTasks += 1;
              if(task.status == "Completed") {
                goal.taskCompleted += 1;
              }
            }
          }); 
        });
        console.log("response.data: ", response.data);
      } catch (error) {
        // this.$bvModal.show('modal-failure');
      }
    },
    async getOrgEmployee() {
      try {
        let response = await axios.get('/read/employeeorganization/'+this.selectdOrg.id);
        this.employee = response.data;
        this.employee.forEach(emp => {
          this.taskEmpOptions.push({ value: emp.email, text: emp.username });
        });
        console.log("response.data: ", response.data);
      } catch (error) {
        // this.$bvModal.show('modal-failure');
      }
    },
    async getOrganization() {
      try {
        let response = await axios.get('/read/organizations/'+this.email);
        console.log("response: ", response);
        response.data.organization.forEach(org => {
          org.totalEmployee = 0;
          this.options.push({ value: org.id, text: org.name });
          response.data.employee.forEach(emp => {
            if(emp.organizationId == org.id) {
              org.totalEmployee += 1;
            }
          }); 
        });
        this.organization = response.data.organization;
      } catch (error) {
        this.$bvModal.show('modal-failure');
      }
    },
  },
  async mounted() {
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.email = userInfo.email;
    await this.getOrganization();
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
