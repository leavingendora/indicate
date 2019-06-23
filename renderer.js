const Vue = require('vue/dist/vue.js');
const jayson = require("jayson");
const blinkstick = require('blinkstick');
const ipc = require('electron').ipcRenderer;
const jsonfile = require('jsonfile');


const client = jayson.client.http({
  port: 3000
});

const meditationFile = 'meditation-config.json';

let device = blinkstick.findFirst();


Vue.component('meditate-comp-element', {
  props: ['data'],
  template: `
  <div>
  <div class="field">
    <input v-bind:id="'switch'+data.title" type="checkbox" v-bind:name="'switch'+data.title" class="switch is-rounded is-success is-small" v-model="data.switch">
    <label v-bind:for="'switch'+data.title" class="switch-title">{{data.title}}</label>
  </div>
  <div v-if="data.switch">
    <div class="field">
      <label class="label">Title</label>
        <div class="control">
          <input class="input is-tiny" type="text" placeholder="Title" v-model="data.text" />
        </div>
    </div>
    <div class="field">
      <label class="label">Duration</label>
      <div class="control">
        <input class="slider is-fullwidth is-small" step="1" min="3" max="60" v-model="data.duration" type="range">
      </div>
      <p class="help">Window will be visible for <strong>{{data.duration}}</strong> seconds.</p>
    </div>
    <div class="field">
      <label class="label">Timeout</label>
      <div class="control">
        <input class="slider is-fullwidth is-small" step="1" min="3" max="90" v-model="data.time" type="range">
      </div>
      <p class="help">Window will appear every <strong>{{data.time}}</strong> minutes.</p>
    </div>

  </div>
  </div>`
});

Vue.component('meditate-comp', {
  props: ['work'],
  data: function() {
    return {
      data: {
        meditate: {
          title: "Mediation",
          switch: true,
          text: "It's time to calm down.",
          time: 30, //timeout in mins
          duration: 30 //duration of window presence in secs
        },
        stretch: {
          title: "Stretch",
          switch: true,
          text: "Stretch!",
          time: 20,
          duration: 15
        },
        alarm: {
          title: "Alarm",
          switch: false,
          text: "Alarm",
          time: 10, 
          duration: 60
        }
      },
      fileAccess: false
   }
  },
  watch: {
    data: {
      handler(val) {
        console.log("save ");
        if (this.fileAccess == false) {
          this.saveSettings();
        }
        
      },
      deep: true
    },
  },
  mounted: function() {
    this.readSettings();
  },
  methods: {
    saveSettings() {
      jsonfile.writeFile(meditationFile, this.data, (err)=> {
        if (err) console.error(err);
      })
    },
    readSettings() {
      this.fileAccess = true;
      jsonfile.readFile(meditationFile, (err, data) => {
        if (err) console.error(err);
        this.data = data;
        this.fileAccess = false;
      });
    }
    
  },
  template: `
    <div>
      <meditate-comp-element v-bind:data="data.meditate"></meditate-comp-element>
      <hr>
      <meditate-comp-element v-bind:data="data.stretch"></meditate-comp-element>
      <hr>
      <meditate-comp-element v-bind:data="data.alarm"></meditate-comp-element>
      <hr>
      <button v-on:click="readSettings()">test</button>
    </div>
    `
});



// template: `
// <div>
//   <div class="field">
//     <input id="switchMeditate" type="checkbox" name="switchMeditate" class="switch is-rounded is-success is-small" v-model="switchMeditate">
//     <label for="switchMeditate">Meditation</label>
//   </div>
//   <div class="field" v-if="switchMeditate">
    
//   </div>
//   <div class="field">
//     <input id="switchStretch" type="checkbox" name="switchStretch" class="switch is-rounded is-success is-small" v-model="switchStretch">
//     <label for="switchStretch">Stretch</label>
//   </div>
//   <div class="field" v-if="switchStretch">
//     test
//   </div>
//   <div class="field">
//     <input id="switchAlarm" type="checkbox" name="switchAlarm" class="switch is-rounded is-success is-small" v-model="switchAlarm">
//     <label for="switchAlarm">Alarm</label>
//   </div>
//   <div class="field" v-if="switchAlarm">
//     test
//   </div>
//   <p>{{work}}</p>
//   </div>
//   `



var App = new Vue({
  el: '#app',
  data: {
    tab: 'projects',
    data: [],
    loading: true,
    newProject: {
      name: "",
      color: "#FF0000",
      icon: "fas fa-icons",
      state: "",
      delete: ""
    },
    selectedProject: {
      id: null,
      name: "",
      color: "#4a4a4a",
      dnd: false,
    },
    device: device
  },
  created() {
    this.projectGetData();
    setInterval(this.projectUpdateTime, 7000);
  },
  methods: {
    projectUpdateTime() {
      if (this.selectedProject.id !== null) {
        console.log("projectUpdateTime");
        client.request('projectUpdateTime', {id: this.selectedProject.id, time: 1}, (err, response) => {
          if(err) throw err;
          this.projectGetData();
        });
      }
    },
    projectGetData() {
      client.request('get', null, (err, response) => {
        if(err) throw err;
        this.data = response.result;
        this.loading = false;
      });
    },
    projectRemove(item) {
      if (item.status === 'open' && this.newProject.delete === "DELETE") {
        client.request('delProject', item, (err, response) => {
          if(err) throw err;
          this.projectGetData();
        });
      } else {
        throw "Project not closed";
      }

    },
    projectAdd() {
      client.request('addProject', {name: this.newProject.name, icon: this.newProject.icon, color: this.newProject.color}, (err, response) => {
        if(err) throw err;
        console.log(response.result);
        this.projectGetData();
      });
    },
    star(item) {
      console.log("star it");
    },
    projectSet(item) {
      if (device) {
        device.pulse(item.color, {stay: true, duration: 200});
      }
      this.selectedProject.id = item.id;
      this.selectedProject.name = item.name;
      this.selectedProject.color = item.color;
    },
    projectUnset() {
      if (device) {
        device.setColor(0,0,0);
      }
      this.selectedProject.id = null;
      this.selectedProject.name = "";
      this.selectedProject.dnd = false;
    },
    meditate() {
      ipc.send('meditation-window', {type: 'Meditation', timeOut: 30, title: 'Take a deep breath'});
    },
    dnd() {
      if (device) {
        if (this.selectedProject.dnd == false) {
          device.pulse("#EE0000", {stay: true, duration: 200});
          this.selectedProject.dnd = true;
       } else {
          device.pulse(this.selectedProject.color, {stay: true, duration: 200});
          this.selectedProject.dnd = false;
       }
      }

    }


  }
});




