const Vue = require('vue/dist/vue.js');
const jayson = require("jayson");
const blinkstick = require('blinkstick');

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
      icon: "fa-star",
      state: "",
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
    this.getProjectDataFromServer();
    setInterval(this.updateTime, 7000);
  },
  methods: {
    updateTime() {
      if (this.selectedProject.id !== null) {
        console.log("updateTime");
        client.request('updateTime', {id: this.selectedProject.id, time: 1}, (err, response) => {
          if(err) throw err;
          this.getProjectDataFromServer();
        });
      }
    },
    getProjectDataFromServer() {
      client.request('get', null, (err, response) => {
        if(err) throw err;
        this.data = response.result;
        this.loading = false;
        console.log(this.data);
      });
    },
    removeFromDB(item) {
      if (item.status === 'open') {
        client.request('delProject', item, (err, response) => {
          if(err) throw err;
        });
      } else {
        throw "Project not closed";
      }

    },
    addProjectToDB() {
      client.request('addProject', {name: this.newProject.name, icon: this.newProject.icon, color: this.newProject.color}, (err, response) => {
        if(err) throw err;
        console.log(response.result);
        this.getProjectDataFromServer();
      });
    },
    star(item) {
      console.log("star it");
    },
    setProject(item) {
      if (device) {
        device.pulse(item.color, {stay: true, duration: 200});
      }
      this.selectedProject.id = item.id;
      this.selectedProject.name = item.name;
      this.selectedProject.color = item.color;
    },
    unsetProject() {
      this.selectedProject.id = null;
      this.selectedProject.name = "";
      this.selectedProject.dnd = false;
      
      if (device) {
        device.setColor(0,0,0);
      }
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

