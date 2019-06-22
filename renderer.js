const Vue = require('vue/dist/vue.js');
const jayson = require("jayson");
const blinkstick = require('blinkstick');

const ipc = require('electron').ipcRenderer

const client = jayson.client.http({
  port: 3000
});


let device = blinkstick.findFirst();


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
        console.log(this.data);
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
      ipc.send('meditation-window', {type: 'meditation', timeOut: 10, title: 'Take a deep breath'});
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

