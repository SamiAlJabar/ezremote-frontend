<template>
  <div class="div-body">
    <Navbar/>
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
                <b-modal id="modal-info" hide-footer>
                  <template v-slot:modal-title>
                    IERS User Manual
                  </template>
                  <div class="d-block text-center">
                    <p class="text-left">Say "Hey Iris" to wake the system. Wait for it to reply back. After it replies back, ask your question clearly and wait for its reply.</p>
                    <p class="text-left">Always wake the system by saying "Hey Iris" and then ask your question. Otherwise it won't reply.</p>
                    <p class="text-left">If you find the system is not replying, reload the web page.</p>
                  </div>
                  <b-button class="mt-3" block @click="$bvModal.hide('modal-info')">CLOSE</b-button>
                </b-modal>
                <b-modal id="modal-results" hide-footer>
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
                </b-modal>
                <b-modal id="modal-reference" hide-footer>
                  <template v-slot:modal-title>
                    Reference of the answer
                  </template>
                  <div class="d-block text-center">
                    <div v-for="(results, index) in this.searchResult" :key="results">
                      <p v-if="index == 0" class="text-left">
                        <b>Reference</b>
                        <br/>
                        {{results.item.reference}}
                      </p>
                    </div>
                  </div>
                  <b-button class="mt-3" block @click="$bvModal.hide('modal-reference')">CLOSE</b-button>
                </b-modal>
              </div>
              <div class="chatbox">
                <ul style="padding: 0px; margin: 0px; list-style: none">
                  <li v-for="chat in this.conversation" :key="chat">
                    <div  class="chat-right" v-if="chat.speaker == 'USER'">
                      <p class="text-right" style="width: 100%; float: right"><b style="font-weight: 900; font-size: 13px;">{{chat.speaker}}</b><br/>{{chat.speech}}</p>
                    </div>
                    <div  class="chat-left" v-if="chat.speaker != 'USER'" >
                      <p class="text-left" style="width: 100%; float: left">
                        <b-button style="float: right; width: 100px; font-size: 12px;" class="mt-3" block @click="$bvModal.show('modal-results')">All Results</b-button>
                        <b-button v-show="searchResult[0].item.reference" style="float: right; margin-right: 5px; width: 100px; font-size: 12px;" class="mt-3" block @click="$bvModal.show('modal-reference')">Reference</b-button>
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
                <div style="float: left; width: 75%;">
                  <b-form-input
                    @keyup.enter="search"
                    style="width: 100%"
                    v-model="searchText"
                    placeholder="Type your query and press 'Enter'"
                  ></b-form-input>
                </div>
                <div style="float: left; width: 25%;">                  
                  <b-button  style="width: 55%; margin-left: 5%;" variant="primary" @click="search()"><font-awesome-icon icon="paper-plane" /></b-button>
                  <b-button  style="width: 35%; margin-left: 5%;" variant="danger" @click="stopTalking()"><font-awesome-icon icon="stop" /></b-button>
                  <!-- <b-button  style="width: 90%; margin-left: 10%;" variant="primary" @click="search()"><i class="fa fa-send"></i></b-button> -->
                </div>
                <!-- <b-button  style="width: 90%; margin-left: 10%;" variant="primary" @click="python()">PYTHON</b-button> -->
              </div>
            </b-col>
          </b-row>
          <!-- <b-row class="custom-row">
            <div class="recorder">
              <SpeechToText class="app__stt-button" @speech="onSpeechReceived($event)"/>
            </div>
          </b-row> -->


          <!-- <b-row class="custom-row" style="margin-top: 40px; margin-bottom: 40px;">
            <label
              v-if="searchResult.length > 0"
              style="color: grey"
            >About {{searchResult.length}} result(s) found. Click on each to view details.</label>
            <label v-if="isResultNotFound && searchResult.length < 1" style="color: red">
              Could not find any information related to your search -
              <b>"{{searchText}}"</b>
            </label>
            <div style="width: 100%; margin-top: 5px;">
              <b-card no-body class="mb-1" v-for="(item, index) in searchResult" :key="index">
                <b-card-header header-tag="header" class="p-1" role="tab">
                  <b-button
                    style="text-align: left"
                    block
                    v-b-toggle="''+index"
                    variant="info"
                  >{{item.item.title}}</b-button>
                </b-card-header>
                <b-collapse
                  style="text-align: left"
                  :id="''+index"
                  accordion="my-accordion"
                  role="tabpanel"
                >
                  <b-card-body>
                    <b-card-text>
                      <h5>
                        <b>{{item.item.title}}</b>
                      </h5>
                      <div v-if="item.item.type == 'instructions'">
                        <label
                          v-if="item.item.state == 'Generic'"
                        >Instructions/steps for general cases are as follows:</label>
                        <label
                          v-if="item.item.state != 'Generic'"
                        >Instructions/steps for rare/special cases are as follows:</label>
                        <ul v-if="item.item.state">
                          <li
                            v-for="(step, index) in item.item.stepList"
                            :key="index"
                          >{{step.stepType}} - {{step.stepText}}</li>
                        </ul>
                      </div>
                      <div v-if="item.item.type == 'fromFile'">
                        <p v-if="!item.item.state">{{item.item.stepList}}</p>
                      </div>
                    </b-card-text>
                  </b-card-body>
                </b-collapse>
              </b-card>
            </div>
          </b-row> -->
        </b-container>
      </b-col>
    </b-row>
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from "@/components/Navbar.vue";
import SpeechToText from "./lib/components/SpeechToText.vue";
import axios from "../axios_instance.js";
// https://github.com/krzaku281/voice-speech-recognition/blob/master/src/voice-speech-recognition.js
var speechRecognizer = new webkitSpeechRecognition();
speechRecognizer.continuous = true;
speechRecognizer.interimResults = true;
speechRecognizer.lang = "en-US";

export default {
  name: "SystemChat",
  components: {
    Navbar,
    SpeechToText
  },
  data() {
    return {
      relatedAnswers: [],
      conversation: [],
      textarea: "Your answer will display here!",
      searchText: null,
      searchResult: [],
      isResultNotFound: false,
      vsr: null,
      userSpeech: null,
      iersActive: false,
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
  watch: {
    searchText: function(val) {
      this.isResultNotFound = false;
    },
    userSpeech: function(val) {
      this.searchText = this.userSpeech;
      this.search(this.searchText);
    }
  },
  async mounted() {
    // start talking
    this.speaker = new SpeechSynthesisUtterance();
    speechRecognizer.abort();

    var results = "";
    var timeoutSet = false;
    var speechStarted = true;
    var systemCalled = 0;
    // this.speakLoud("Hi, this is Iris. Call my name to wake me up.");
    setTimeout(() => {
      // speechRecognizer.start();
      speechStarted = false;
    }, 2000);
    setInterval(() => {
      speechRecognizer.continuous = true;
      if (speechSynthesis.speaking) {
        console.log("Still speaking results: " + results);
        if (results == "Iris" || results == "hey Iris" || results == "hi Iris") {
          speechSynthesis.speaking = false;
        } else {
          if (results == "Stop" || results == "stop") {
            alert("Stop");
          }
          // console.log("Got here: " + results);
          results = "";
        }
        return;
      } else if (!speechStarted) {
        speechRecognizer.abort();
        try {
          speechRecognizer.start();
          speechStarted = true;
        } catch (error) {
          speechRecognizer.abort();
          speechStarted = false;
        }
      }
      speechRecognizer.onend = function() {
        // console.log("On End:", results);
        if (systemCalled == 1) {
          results = "";
          systemCalled = 2;
          speechRecognizer.start();
          speechStarted = true;
        } else {
          // console.log("results: ", results);
          speechRecognizer.start();
          speechStarted = true;
        }
      };
      speechRecognizer.onresult = function(event) {
        var final_transcript = "";
        for (var i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final_transcript += event.results[i][0].transcript;
            results = final_transcript;
            speechRecognizer.abort();
            speechStarted = false;
          }
        }
      };
      // COMMANDS
      if (results == "Iris" || results == "hey Iris" || results == "hi Iris") {
        this.conversation.push(
          {
            speaker: 'USER',
            speech: results
          }
        );
        results = "";
        systemCalled = 1;
        this.conversation.push(
          {
            speaker: 'IERS',
            speech: 'Listening ...'
          }
        );
        this.speakLoud("Listening.");
      } else if (results.length > 0 && systemCalled == 2) {
        // console.log("RESULTS: ", results);
        // console.log("systemCalled: ", systemCalled);
        systemCalled = 0;
        this.userSpeech = results;
      }
    }, 1500);
  },
  methods: {
    async speakLoud(msg) {
      // var msg = new SpeechSynthesisUtterance();
      // var voices = await window.speechSynthesis.getVoices();
      // this.speaker.voice = voices[10];
      // this.speaker.voiceURI = "native";
      // this.speaker.volume = 1;
      // this.speaker.rate = 1;
      // this.speaker.pitch = 1.5;
      // this.speaker.lang = "en-US";
      this.speaker.text = msg;
      speechSynthesis.speak(this.speaker);
      this.searchText = '';
      // speechRecognizer.abort();
    },
    onSpeechReceived(speech) {
      console.log("Reveived", speech);
      this.searchText = speech;
      this.search(this.searchText);
    },
    // async python() {
    //   let response = await axios_py.get("/getData");
    //   alert(JSON.stringify(response.data.value));
    // },
    stopTalking() {
      window.speechSynthesis.cancel();
    },
    async search() {
      this.conversation = [];
      let response = null;
      this.systemReply = await this.notFoundMessageFunc();
      this.conversation.push(
        {
          speaker: 'USER',
          speech: this.searchText
        }
      );
      try {
        response = await axios.get(
          "/searchQuery?searchText=" + this.searchText
        );
        console.log("FROM IN: ", response);
        this.searchResult = response.data;
        if (this.searchResult.length < 1) {
          this.isResultNotFound = true;
          this.conversation.push(
            {
              speaker: 'IERS',
              speech: ""+ this.systemReply
            }
          );
          this.speakLoud(
            ""+ this.systemReply
          );
          // var msg = new SpeechSynthesisUtterance();
          // var voices = window.speechSynthesis.getVoices();
          // msg.voice = voices[10];
          // msg.voiceURI = "native";
          // msg.volume = 1;
          // msg.rate = 1;
          // msg.pitch = 1.5;
          // msg.text =
          //   "Sorry, but I do not have enough information about that.";
          // msg.lang = "en-US";
          // speechSynthesis.speak(msg);
        } else {
          console.log(this.searchResult[0]);
          console.log("All results: ", this.searchResult);
          var msgSpeak =
            '' +
            this.searchResult[0].item.text;
          this.conversation.push(
            {
              speaker: 'IERS',
              speech: msgSpeak
            }
          );
          this.speakLoud(msgSpeak);
          this.isResultNotFound = false;
        }
        // console.log(this.searchResult);
      } catch (err) {
        this.conversation.push(
          {
            speaker: 'IERS',
            speech: ""+ this.systemReply
          }
        );
        this.speakLoud(
          ""+ this.systemReply
        );
        console.log("#ERROR: ", err);
      }
    },
    async notFoundMessageFunc() {
      let randomNum = await Math.floor(Math.random() * 6);
      return await this.notFoundMessage[randomNum];
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
