<template>
  <div class="div-body">
    <Navbar/>
    <b-row>
      <b-col cols="12">
        <b-container style="margin-top: 40px;">
          <b-row class="custom-row">
            <b-col class="col-md-8 col-sm-12" style="margin: auto;">
              <h3 class="text-left">
                <b>System Training</b>
                <div>
                  <b-button style="width: 100%; margin-top: 2%;" variant="primary" @click="loadKnowledgeGraph(); loadGraph = !loadGraph">{{(loadGraph ? 'Hide Network' : 'Show Network')}}</b-button>
                </div>
              </h3>
              <div v-show="!loadingActive">
                <div style="float: left; width: 100%;">
                  <input type="text" v-model="documentTitle" class="form-control" placeholder="Document Title ...">
                </div>
                <br>
                <br>
                <div style="float: left; width: 100%;">
                  <input type="text" v-model="documentVersion" class="form-control" placeholder="Document Version ...">
                </div>
                <br>
                <br>
                <div style="float: left; width: 100%;">
                  <input type="date" v-model="documentDate" class="form-control" placeholder="Release Date ...">
                </div>
                <!-- <div style="float: left; width: 100%;">
                  <input type="text" v-model="tempTitle" class="form-control" placeholder="Temp title">
                </div> -->
                <br>
                <br>
                <div style="float: left; width: 100%;">
                  <b-form-file
                    style="width: 100%;"
                    class="text-left"
                    id="fileReader"
                    ref="fileReader"
                    v-model="uploadedDocument"
                    placeholder="Choose a file or drop it here..."
                    drop-placeholder="Drop file here..."
                  ></b-form-file>
                </div>
                <div v-show="!documentTitle && documentSubmission" style="color: red"><b>Please enter document title!</b></div>
                <div v-show="!documentVersion && documentSubmission" style="color: red"><b>Please enter document version!</b></div>
                <div v-show="!documentDate && documentSubmission" style="color: red"><b>Please enter document date!</b></div>
                <div v-show="!uploadedDocument && documentSubmission" style="color: red"><b>Please upload a document!</b></div>
                <br>
                <br>
                <b-form-group class="text-left" style="width: 100%" label="">
                  <b-form-radio v-model="docType" value="regular">Regular Document</b-form-radio>
                  <b-form-radio v-model="docType" value="acronym">Acronym Document</b-form-radio>
                </b-form-group>
                <div style="float: right; width: 15%;">
                  <b-button  style="width: 100%;" variant="primary" @click="submitFile()"><font-awesome-icon icon="check" /></b-button>
                </div>
              </div>
            </b-col>
          </b-row>
          <b-row v-show="loadingActive" style="margin-top: 10vh">
            <b-col class="col-md-8 col-sm-12 text-center" style="margin: auto;">
              <h4>{{loadingText}}</h4>
              <div class="d-flex justify-content-center mb-3">
                <b-spinner variant="primary" class="text-center" style="width: 3rem; height: 3rem;" label="Large Spinner" type="grow"></b-spinner>
              </div>
            </b-col>
          </b-row>
          <b-row v-if="unknownTermFlag == 1" style="margin-top: 10vh; margin-bottom: 5vh;">
            <b-col class="col-md-8 col-sm-12 text-left" style="margin: auto;">
              <p style="width: 100%; color: red">{{errorMsg}}</p>
              <div style="display: flex; margin-top: 20px" v-for="term in unknownTerms" :key="term">
                <p v-if="term.display == 'yes'" style="width: 40%; float: left;"><i @click="loadModalData(term)" v-b-modal.modal-info style="cursor: pointer" class="fa fa-exclamation-circle"></i> {{term.term}}</p>
                <div v-if="term.display == 'yes'" style="float: right; width: 60%;">
                  <b-form-input
                    style="width: 100%"
                    v-model="term.meaning"
                    placeholder="Write the meaning here ..."
                  ></b-form-input>
                  <br>
                  <b-form-group style="width: 100%" label="">
                    <b-form-radio v-model="term.type" value="typo">Typo</b-form-radio>
                    <b-form-radio v-model="term.type" value="new word">New Word</b-form-radio>
                    <b-form-radio v-model="term.type" value="garbage">Garbage</b-form-radio>
                    <b-form-radio v-model="term.type" value="other">Other</b-form-radio>
                  </b-form-group>
                  <b v-if="term.type == 'new word'">Please select a class:</b> <b-form-select v-if="term.type == 'new word'" v-model="term.class" :options="getClasses"></b-form-select>
                </div>
                <br v-if="term.display == 'yes'">
              </div>
              <div class="text-right" style="float: right; width: 15%; margin-top: 20px">
                <b-button style="width: 90%" variant="primary" @click="saveInformation();">SAVE</b-button>
              </div>
            </b-col>
          </b-row>
          <b-row v-if="unknownTermFlag == 2" style="margin-top: 2vh; margin-bottom: 5vh;">
            <b-col class="col-md-8 col-sm-12 text-left" style="margin: auto;">
              <div class="text-right" style="float: right; width: 15%;">
                <b-button style="width: 90%" variant="primary" @click="saveInformation();">SAVE</b-button>
              </div>
            </b-col>
          </b-row>
          <!-- SEMANTIC NETWORK -->
          <b-row style="width: 100%; height: 300vh;" v-if="loadGraph">
            <b-col class="col-md-12" style="width: 100%; height: 100%;">
              <d3-network style="width: 100%; height: 100%;" ref='net' :net-nodes="nodes" :net-links="links" :options="options" />
            </b-col>
          </b-row>
          <b-modal id="modal-info" hide-footer>
            <template v-slot:modal-title>
              Unknown term '{{modalContent.term}}'
            </template>
            <div class="d-block text-center">
              <p class="text-left">{{modalContent.usedInSentence}}</p>
            </div>
            <b-button class="mt-3" block @click="$bvModal.hide('modal-info')">CLOSE</b-button>
          </b-modal>
          <b-modal id="modal-success" hide-footer>
            <template v-slot:modal-title>
              SUCCESS
            </template>
            <div class="d-block text-center">
              <p class="text-left">Information has been saved successfully!</p>
            </div>
            <b-button class="mt-3" block @click="$bvModal.hide('modal-success')">CLOSE</b-button>
          </b-modal>
        </b-container>
      </b-col>
    </b-row>
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from "@/components/Navbar.vue";
import axios from "../axios_instance.js";
import axios_py from "../axios_instance_python.js";
import D3Network from 'vue-d3-network'

export default {
  name: "ProcedureCreate",
  components: {
    Navbar,
    D3Network
  },
  data() {
    return {
      docType: 'regular',
      documentSubmission: false,
      documentTitle: null,
      tempTitle: null,
      documentVersion: null,
      documentDate: null,
      loadingActive: false,
      loadingText: '',
      unknownTerms: [],
      unknownTermFlag: null,
      uploadedDocument: null,
      pdfData: [],
      modalContent: {},
      errorMsg: null,
      nodes: [],
      links: [],
      loadGraph: false,
      graphData: null,
      classes: [],
    };
  },
  async mounted() {
    try {
      let response = await axios.get('/read/classes');
      this.classes = response.data;
    } catch (error) {
      this.$bvModal.show('modal-failure');
    }
  },
  computed:{
    options(){
      return{
        force: 1000,
        // size:{ w:1000, h:1200},
        nodeSize: 8,
        nodeLabels: true,
        linkLabels:true,
        canvas: false
      }
    },
    getClasses() {
      let temp = [];
      this.classes.forEach(element => {
        temp.push({ value: element.class, text: element.class });
      });
      return temp;
    }
  },
  methods: {
    async submitFile() {
      this.documentSubmission = true;
      if(!this.documentTitle || !this.documentVersion || !this.uploadedDocument || !this.documentDate) {
        return;
      }
      if(this.docType == 'acronym') {
        // await this.processAcronymDocument();
        try {
          this.loadingActive = true; 
          let file = this.uploadedDocument;
          let formData = new FormData();
          formData.append('file', file); 
          let acroResponse = await axios_py.post('/getAcronyms', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
          });
          console.log("acroResponse: ", acroResponse);
          let responseP = await axios.post("/insert/updateAcronyms", {
            acronyms: acroResponse.data
          });
          this.loadingActive = false; 
          this.documentSubmission = false;
          this.documentTitle = null;
          this.documentVersion = null;
          this.documentDate = null;
          this.uploadedDocument = null;
          this.unknownTermFlag = 0;
          this.$bvModal.show('modal-success');  
        } catch (err) {
          console.log("Server Error: ", err);
          this.loadingActive = false;  
          this.$bvModal.show('modal-failure');  
        }
      } else {
        this.loadingActive = true;
        this.loadingText = 'Please wait while the system process the document ...';
        let file = this.uploadedDocument;
        let formData = new FormData();
        formData.append('file', file);
        console.log('in');
        try {
          let responseLastId = await axios.get('/read/getLastId');
          if(!responseLastId.data[0].lastId) {
            formData.append('lastId', 0);
          }
          else {
            formData.append('lastId', responseLastId.data[0].lastId + 1);
          }
          let response = await axios_py.post('/getDoc', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
          });
          
          this.loadingText = 'Looking for unknown terms ...';
          let unkownTermCollection = await axios.get('/getUnknowTermCollection');
          // Adding more unknown terms found from document with the general list
          if(response.data.definitions.length > 0) {
            for(let m in response.data.definitions) {
              unkownTermCollection.data.push(JSON.parse(response.data.definitions[m]));
            }
          }
          
          let pr = [];
          let unknownTermCounter = 0;
          let unknownTermResolved = 0;
          for(let i in response.data.document) {
            pr[i] = await JSON.parse(response.data.document[i]);
            if(pr[i].unknownWords.length > 0) {
              for(let j in pr[i].unknownWords) {
                this.unknownTerms[unknownTermCounter] = {
                  term: pr[i].unknownWords[j],
                  meaning: '',
                  type: 'garbage',
                  class: '',
                  usedInSentence: pr[i].text,
                  display: 'yes'
                }
                for(let k in unkownTermCollection.data) {
                  if(unkownTermCollection.data[k].term == pr[i].unknownWords[j]) {
                    this.unknownTerms[unknownTermCounter].meaning = unkownTermCollection.data[k].meaning;
                    this.unknownTerms[unknownTermCounter].display = 'no';
                    unknownTermResolved += 1;
                  }
                }
                unknownTermCounter += 1;
              }
              if(unknownTermResolved != unknownTermCounter) this.errorMsg = "Few unknown terms has been identified from the document. Please define these terms before saving the information into the system.";            
            }

            if(unknownTermResolved != unknownTermCounter) this.unknownTermFlag = 1;
            else this.unknownTermFlag = 2;
          }
          this.pdfData = await pr;
          this.pdfData.forEach(element => {
            if(element.dataType == 'table' || element.dataType == 'acronym') {
              element.text = JSON.stringify(element.text);
            }
          });
          console.log("this.pdfData: ", this.pdfData);
          this.unknownTerms = await this.unknownTerms.reduce((acc, current) => {
            const x = acc.find(item => item.term === current.term);
            if (!x) {
              return acc.concat([current]);
            } else {
              return acc;
            }
          }, []);
          this.loadingActive = false;
        } catch (err) {
          console.log("Server Error: ", err);
          this.loadingActive = false;  
        }
      }
    },
    loadModalData(term) {
      this.modalContent = term;
    },
    async processAcronymDocument() {
      try {
        this.loadingActive = true; 
        let file = this.uploadedDocument;
        let formData = new FormData();
        formData.append('file', file); 
        let acroResponse = await axios_py.post('/getAcronyms', formData, {
          headers: {
              'Content-Type': 'multipart/form-data'
          }
        });
        console.log("acroResponse: ", acroResponse);
        this.loadingActive = false;  
      } catch (err) {
        console.log("Server Error: ", err);
        this.loadingActive = false;  
      }
    },
    async saveInformation() {
      // console.log("Unknown: ", this.unknownTerms);
      for(let i in this.unknownTerms) {
        if(this.unknownTerms[i].display == 'yes' && this.unknownTerms[i].type == 'garbage') {
          this.unknownTerms[i].meaning == 'meaningless';
        } else {
          if(this.unknownTerms[i].display == 'yes' && this.unknownTerms[i].meaning == '') {
            this.errorMsg = await "Please define the unknown terms properly!";
            return;
          } else if(this.unknownTerms[i].display == 'yes' && this.unknownTerms[i].type == '') {
            this.errorMsg = await "Please select the type for one or more unknown words!";
            return;
          } else if(this.unknownTerms[i].display == 'yes' && this.unknownTerms[i].type == 'new word' && this.unknownTerms[i].class == '') {
            this.errorMsg = await "Please define class for one or more unknown words!";
            return; 
          } else {
            this.errorMsg = "";
          }
        }
      }
      this.loadingText = 'Saving information ...';
      let tempUnknownTerms = this.unknownTerms;
      this.unknownTerms = [];
      try {
        this.loadingActive = true;
        let onto = await axios.get('/read/onto');
        let docDelete = await axios.post('/delete/documentsbytitle', { title: this.documentTitle });
        let response = await axios.post("/saveInfo", {
          pdfData: this.pdfData,
          unknownTerms: tempUnknownTerms,
          onto: onto.data,
          document: {
            documentTitle: this.documentTitle,
            tempTitle: this.tempTitle,
            documentVersion: this.documentVersion,
            documentDate: this.documentDate
          }
        });
        // await this.this.loadKnowledgeGraph(response.data);
        this.graphData = await response.data;
        this.documentSubmission = false;
        this.documentTitle = null;
        this.documentVersion = null;
        this.documentDate = null;
        this.uploadedDocument = null;
        this.unknownTermFlag = 0;
        this.$bvModal.show('modal-success');
      } catch (err) {
        console.log("err: ", err);
      }
      this.loadingActive = false;
    },
    async loadKnowledgeGraph() {
      if(this.loadGraph) return;
      try {
        this.loadingActive = true;
        let response = await axios.get("/getSemanticNetwork");
        let pr = response.data;
        this.nodes = [];
        this.links = [];
        let levelOne = [];
        let levelTwo = [];
        let levelThree = [];
        let levelFour = [];
        let color = '';
        let tagCounter = 20000;
        for(let i in pr) {
          // Creating network
          if(pr[i].level == 1) {
            levelOne.push(pr[i]);
            color = '#ff0000';
          }
          else if(pr[i].level == 2) {
            levelTwo.push(pr[i]);
            color = '#ff9600';
          }
          else if(pr[i].level == 3) {
            levelThree.push(pr[i]);
            color = '#fff600';
          }
          else {
            levelFour.push(pr[i]);
            color = '#ffde9e';
          }
          // if(pr[i].level == 1) {
          //   levelOne.push(pr[i]);
          //   color = 'orange';
          // }
          // else if(pr[i].level == 2) {
          //   levelTwo.push(pr[i]);
          //   color = '#41fdfe';
          // }
          // else if(pr[i].level == 3) {
          //   levelThree.push(pr[i]);
          //   color = 'grey';
          // }
          // else {
          //   levelFour.push(pr[i]);
          //   color = 'red';
          // }
          this.nodes.push({
            id: pr[i].id,
            name: pr[i].text,
            _color: color
          });
          
          // Linking Tags
          if(pr[i].tags.length > 0) {
            for(let tag in pr[i].tags) {
              this.nodes.push({
                id: tagCounter,
                name: pr[i].tags[tag],
                _color: 'white'
              });
              this.links.push({
                sid: pr[i].id,
                tid: tagCounter
              });
              tagCounter = tagCounter + 1;
            }
          }
        }

        for(let i in levelOne) {
          for(let j in levelTwo) {
            if(levelOne[i].id == levelTwo[j].parent) {
              this.links.push({
                sid: levelOne[i].id,
                tid: levelTwo[j].id
              });
            }
          }
        }
        for(let i in levelTwo) {
          for(let j in levelThree) {
            if(levelTwo[i].id == levelThree[j].parent) {
              this.links.push({
                sid: levelTwo[i].id,
                tid: levelThree[j].id
              });
            }
          }
        }
        for(let i in levelOne) {
          for(let j in levelFour) {
            if(levelOne[i].id == levelFour[j].parent) {
              this.links.push({
                sid: levelOne[i].id,
                tid: levelFour[j].id
              });
            }
          }
        }
        for(let i in levelTwo) {
          for(let j in levelFour) {
            if(levelTwo[i].id == levelFour[j].parent) {
              this.links.push({
                sid: levelTwo[i].id,
                tid: levelFour[j].id
              });
            }
          }
        }
        for(let i in levelThree) {
          for(let j in levelFour) {
            if(levelThree[i].id == levelFour[j].parent) {
              this.links.push({
                sid: levelThree[i].id,
                tid: levelFour[j].id
              });
            }
          }
        }

        this.nodes.push({
          id: 0,
          name: 'System Knowledge',
          _color: 'blue'
        });
        if(levelOne.length == 0) {
          for(let i in levelTwo) {
            this.links.push({
              sid: 0,
              tid: levelTwo[i].id
            });
          }
        } else {
          for(let i in levelOne) {
            this.links.push({
              sid: 0,
              tid: levelOne[i].id
            });
          }
        }
      } catch (err) {
        console.log("err: ", err);
      }
      this.loadingActive = false;
    }
  }
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
<style src="vue-d3-network/dist/vue-d3-network.css"></style>
