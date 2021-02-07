<template>
  <div class="div-body">
    <AdminNavbar/>
    <b-row class="custom-container">
      <b-col cols="12">
        <b-container style="margin-top: 40px;">
          <b-row class="custom-row">
            <b-col class="col-md-8 col-sm-11" style="margin: auto; padding: 0px !important">
              <div style="width: 100%; display: inline-block">
                <h3 style="float: left">
                  <b>System Chat</b>
                </h3>
                <h3 v-b-modal.modal-info class="info-button" style="cursor: pointer; float: right">
                  <font-awesome-icon style="color: var(--primary)" icon="info-circle" />
                </h3>
                <div style="margin-right: 20px; float: right; width: auto;" class="text-center">
                  <b-form-select required v-model="orgId" :options="optionsOrg"></b-form-select>
                </div>
                <b-modal id="modal-info" hide-footer>
                  <template v-slot:modal-title>
                    User Guide
                  </template>
                  <div class="d-block text-center">
                    <p class="text-left">Communicate with the system to create new goal, task, assign task, view tasks and goals, progress and more ... </p>
                  </div>
                  <b-button class="mt-3" block @click="$bvModal.hide('modal-info')">CLOSE</b-button>
                </b-modal>
                <!-- <b-modal id="modal-results" hide-footer>
                  <template v-slot:modal-title>
                    Related results from the search
                  </template>
                  <div class="d-block text-center">
                    <div v-for="(results, index) in this.searchResult" :key="results">
                      <p class="text-left">
                        <b>Result {{index + 1}}</b>
                        <br/>
                        {{results.item.text}}
                      </p>
                    </div>
                  </div>
                  <b-button class="mt-3" block @click="$bvModal.hide('modal-results')">CLOSE</b-button>
                </b-modal> -->
              </div>
              <div class="chatbox">
                <ul style="padding: 0px; margin: 0px; list-style: none">
                  <li v-for="chat in this.conversation" :key="chat">
                    <div  class="chat-right" v-if="chat.speaker == 'USER'">
                      <p class="text-right" style="width: 100%; float: right"><b style="font-weight: 900; font-size: 13px;">{{chat.speaker}}</b><br/>{{chat.speech}}</p>
                    </div>
                    <div  class="chat-left" v-if="chat.speaker != 'USER'" >
                      <p class="text-left" style="width: 100%; float: left">
                        <!-- <b-button style="float: right; width: 100px; font-size: 12px;" class="mt-3" block @click="$bvModal.show('modal-results')">All Results</b-button>
                        <b-button v-show="searchResult[0].item.reference" style="float: right; margin-right: 5px; width: 100px; font-size: 12px;" class="mt-3" block @click="$bvModal.show('modal-reference')">Reference</b-button> -->
                        <b style="font-weight: 900; font-size: 13px;">{{chat.speaker}}</b>
                        <br/>{{chat.speech}}
                      </p>
                    </div>
                    <br>
                    <br>
                  </li>
                </ul>
              </div>
              <div style="margin-top: 2%;">
                <div style="float: left; width: 80%;">
                  <b-form-input
                    @keyup.enter="search"
                    style="width: 100%"
                    v-model="searchText"
                    placeholder="Type your query and press 'Enter'"
                  ></b-form-input>
                </div>
                <div style="float: left; width: 20%; padding-left: 2%;">                  
                  <b-button  style="width: 100%;" variant="primary" @click="search()"><font-awesome-icon icon="paper-plane" /></b-button>
                </div>
              </div>
            </b-col>
          </b-row>
        </b-container>
      </b-col>
    </b-row>
  </div>
</template>

<script>
// @ is an alias to /src
import AdminNavbar from "@/components/AdminNavbar.vue";
import axios from "../axios_instance.js";

export default {
  name: "SystemChat",
  components: {
    AdminNavbar
  },
  data() {
    return {
      employee: [],
      taskList: [],
      orgId: null,
      optionsOrg: [{ value: null, text: 'Please select an organization' }],
      relatedAnswers: [],
      conversation: [],
      textarea: "Your answer will display here!",
      searchText: null,
      searchResult: [],
      goalList: [],
      communicationLevel: 0,
      isResultNotFound: false,
      vsr: null,
      userSpeech: null,
      speaker: null,
      notFoundMessage: [
        "Sorry, but I do not have enough information about that.",
        "I am afraid I do not have anything related to your query.",
        "Sorry, but I cannot help you with that.",
        "Well, I cannot answer that as I do not have much information about it.",
        "I am sorry but for now I do not have what you are looking for.",
        "I could not find enough information related to what you just asked.",
        "I am afraid I cannot help you with that as I do not have anything related to what you are looking for.",
      ],
      systemReply: "",
    };
  },
  async mounted() {
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.email = userInfo.email;
    await this.getOrganization();
  },
  methods: {
    async notFoundMessageFunc() {
      let randomNum = await Math.floor(Math.random() * 6);
      return await this.notFoundMessage[randomNum];
    },
    async getOrganization() {
      try {
        let response = await axios.get('/read/organizations/'+this.email);
        response.data.organization.forEach(org => {
          this.optionsOrg.push({ value: org.id, text: org.name });
        });
      } catch (error) {
        this.$bvModal.show('modal-failure');
      }
    },
    async search() {
      let response = null;
      this.systemReply = await this.notFoundMessageFunc();
      this.conversation.unshift(
        {
          speaker: 'USER',
          speech: this.searchText
        }
      );
      if(!this.orgId) {
        this.conversation.unshift(
          {
            speaker: 'SYSTEM',
            speech: "Please select an organization from top!"
          }
        );
        return;
      }
      if(this.communicationLevel == 0) {
        try {
          response = await axios.get("/read/search/" + this.searchText);
          this.searchResult = response.data;
          if (this.searchResult.length < 1) {
            this.conversation.unshift(
              {
                speaker: 'SYSTEM',
                speech: ""+ this.systemReply
              }
            );
          } else {
            if(this.searchResult.action && this.searchResult.element && this.communicationLevel == 0 && this.searchResult.action != 'search') {
              this.communicationLevel += 1;
              var msgSpeak = "";
              if(this.searchResult.element == 'employee') {
                msgSpeak = 'Please enter one employee name from one of the following - ';
                await this.getOrgEmployee();
                this.employee.forEach((emp, index) => {
                  msgSpeak = msgSpeak + " " + parseInt(index+1) + ". " + emp.username;
                });
              } else {
                msgSpeak = 'Please enter ' +this.searchResult.element+ ' name';
              }
              this.conversation.unshift(
                {
                  speaker: 'SYSTEM',
                  speech: msgSpeak
                }
              );
            } else {
              this.communicationLevel += 1;
              this.conversation.unshift(
                {
                  speaker: 'SYSTEM',
                  speech: "Are you looking for all "+this.searchResult.element+"s or you want specifics? (Reply with 'all' / 'few')"
                }
              );
            }
          }
        } catch (err) {
          this.conversation.unshift(
            {
              speaker: 'SYSTEM',
              speech: ""+ this.systemReply
            }
          );
          console.log("#ERROR: ", err);
        }
      } else if (this.communicationLevel == 1) {
        if(this.searchResult.action == 'search') {
          this.communicationLevel += 1;
          if(this.searchText.toLowerCase() == 'all') {
            try {
              let response = await axios.post('/read/filteredAll', {
                searchResult: this.searchResult,
                organizationId: this.orgId,
              });
              let mg = '';
              if(this.searchResult.element == 'goal') {
                response.data.forEach((element, index) => {
                  mg = mg + "#"+parseInt(index+1)+'. Goal Title: '+element.goal+ ', Priority: '+element.priority+' ';
                });
              } else if(this.searchResult.element == 'task') {
                response.data.forEach((element, index) => {
                  mg = mg + "#"+parseInt(index+1)+'. Task Title: '+element.task+ ', Progress: '+element.status+', Assigned To: '+element.empName+' ';
                });
              }
              this.conversation.unshift(
                  {
                    speaker: 'SYSTEM',
                    speech: mg
                  }
                );
              this.communicationLevel = 0;
              return;
            } catch (error) {
              
            }  
          } else {
            let msg = '';
            if(this.searchResult.element == 'task') {
              msg = "Select any one from the following - 1. Status 2. Employee (reply with 'status' or 'employee')";
            } else if(this.searchResult.element == 'employee') {
              msg = "Select any one from the following - 1. Employee Tasks 2. Health (reply with either 'Employee Tasks' or 'Health)";
            } else if(this.searchResult.element == 'goal') {
              msg = "Select any one from the following - 1. Total goals";
            }
            this.conversation.unshift(
              {
                speaker: 'SYSTEM',
                speech: msg
              }
            );
          }
        } else {
          this.communicationLevel += 1;
          if(this.searchResult.element == 'task') {
            this.searchResult.variables.push({value: this.searchText});
            this.systemReply = 'Please enter one goal name from one of the following to assign the task with that goal - ';
            await this.getOrgGoals();
            this.goalList.forEach((goal, index) => {
              this.systemReply = this.systemReply + " " + parseInt(index+1) + ". " + goal.goal;
            });
          } else if(this.searchResult.element == 'employee') {
            this.searchResult.variables.push({value: this.searchText});
            this.employee.forEach((emp, index) => {
              if(emp.username == this.searchText) {
                this.searchResult.variables.push({value: emp.email});
              }
            });
            this.systemReply = 'Please enter one task name from one of the following to assign the employee with that task - ';
            await this.getAllTasks();
            this.taskList.forEach((task, index) => {
              this.systemReply = this.systemReply + " " + parseInt(index+1) + ". " + task.task;
            });
          } else if(this.searchResult.element == 'goal') {
            this.searchResult.variables.push({value: this.searchText});
            this.systemReply = 'Describe your goal';          
          }
          this.conversation.unshift(
            {
              speaker: 'SYSTEM',
              speech: ""+ this.systemReply
            }
          );
        }
      } else if (this.communicationLevel == 2) {
        if(this.searchResult.action == 'search') {
          let msg = "";
          this.communicationLevel += 1;
          this.searchResult.variables.push({value: this.searchText});
          if(this.searchResult.element == 'task') {
            if(this.searchText.toLowerCase() == 'status') {
              msg = "Enter task status from any one of the following - 1. Completed, 2. In Progress, 3. In Review, 4. Not Started";
            }
          }
          this.conversation.unshift(
            {
              speaker: 'SYSTEM',
              speech: msg
            }
          );
        } else {
          if(this.searchResult.element == 'employee') {
            this.taskList.forEach((task, index) => {
              if(task.task == this.searchText) {
                this.searchResult.variables.push({value: task.id});
              }
            });
          } else if(this.searchResult.element == 'goal') {
            this.searchResult.variables.push({value: this.searchText});
            try {
              let response = await axios.post('/insert/goals', {
                email: this.email,
                goal: this.searchResult.variables[0].value,
                description: this.searchResult.variables[1].value,
                organizationId: this.orgId,
                priority: "Medium"
              });
            } catch (error) {
              
            }     
            this.conversation.unshift(
                {
                  speaker: 'SYSTEM',
                  speech: "Job done!"
                }
              );
            this.communicationLevel = 0;
            return;
          } else {
            this.goalList.forEach((goal, index) => {
              if(goal.goal == this.searchText) {
                this.searchText = goal.id;
                this.searchResult.variables.push({value: this.searchText});
                return;
              }
            });
            if(!this.searchResult.variables[1]) {
              console.log(this.searchResult);
              this.conversation.unshift(
                {
                  speaker: 'SYSTEM',
                  speech: "Please enter the goal name properly!"
                }
              );
              return;
            } else {
              this.communicationLevel = 0;
            }
          }
          this.communicationLevel = 0;
          try {
            let response = await axios.post('/update/fromQuery', {
              searchResult: this.searchResult,
              email: this.email,
              orgId: this.orgId
            });
            this.conversation.unshift(
              {
                speaker: 'SYSTEM',
                speech: "Job done!"
              }
            );
          } catch (error) {
            this.communicationLevel = 0;
            this.conversation.unshift(
              {
                speaker: 'SYSTEM',
                speech: "Something went wrong. Please try again!"
              }
            );
          }
        }
      } else if(this.communicationLevel == 3) {
        this.searchResult.variables.push({value: this.searchText});
        let filter = [];
        console.log(this.searchResult);
        if(this.searchResult.variables[0].value.toLowerCase() == 'status') {
          filter.push('status');
          if(this.searchResult.variables[1].value.toLowerCase() == 'completed') filter.push('Completed');
          if(this.searchResult.variables[1].value.toLowerCase() == 'in progress') filter.push('In Progress');
          if(this.searchResult.variables[1].value.toLowerCase() == 'not started') filter.push('Not Started');
          if(this.searchResult.variables[1].value.toLowerCase() == 'in review') filter.push('Need Review');
        } else if(this.searchResult.variables[0].value.toLowerCase() == 'employee') {
          filter.push('assignedTo');
        }
        try {
          let response = await axios.post('/read/filteredTasks', {
            filter: filter,
            searchResult: this.searchResult,
            organizationId: this.orgId,
          });
          let mg = '';
          response.data.forEach((element, index) => {
            mg = mg + "#"+parseInt(index+1)+'. Task Title: '+element.task+ ', Progress: '+element.status+', Assigned To: '+element.empName+' ';
          });
          this.conversation.unshift(
            {
              speaker: 'SYSTEM',
              speech: mg
            }
          );
          this.communicationLevel = 0;
          return;
        } catch (error) {
          this.communicationLevel = 0;
        }
      }
      this.searchText = "";
    },
    async getAllTasks() {
      try {
        let response = await axios.get('/read/allTasks/'+this.orgId);
        this.taskList = response.data;
      } catch (error) {
        // this.$bvModal.show('modal-failure');
      }
    },
    async getOrgEmployee() {
      try {
        let response = await axios.get('/read/employeeorganization/'+this.orgId);
        this.employee = response.data;
      } catch (error) {
        // this.$bvModal.show('modal-failure');
      }
    },
    async getOrgGoals() {
      try {
        let response = await axios.get('/read/goals/'+this.orgId);
        this.goalList = response.data.goals;
      } catch (error) {
        // this.$bvModal.show('modal-failure');
      }
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
.chatbox {
  background-color: white;
  border: 1px solid var(--primary);
  height: 45vh;
  overflow-y: scroll;
  padding: 10px;
}
.chat-right > p {
  background-color: rgb(247, 247, 247);
  padding: 5px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 10px;
}
.chat-left > p {
  background-color: rgb(226, 239, 255);
  padding: 5px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 10px;
}
.info-button:hover {
  color: var(--primary);
}
</style>
