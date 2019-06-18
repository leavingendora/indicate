const {clipboard} = require('electron');
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
    title: 'indicate',
    tab: 'projects',
    data: [],
    loading: true,
    project_name: "",
    project_color: "#FF0000",
    project_icon: "fa-star",
    project_state: "",
    selected_project: null
  },
  created() {
    this.getProjectDataFromServer();
    setInterval(this.updateTime, 7000);
  },
  methods: {
    updateTime() {
      if (this.selected_project !== null) {
        console.log("updateTime");
        client.request('updateTime', {id: this.selected_project, time: 1}, (err, response) => {
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
      client.request('addProject', {name: this.project_name, icon: this.project_icon, color: this.project_color}, (err, response) => {
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
        device.pulse(item.color, {stay: true, duration: 500});
      }
      this.selected_project = item.id;
    },
    unsetProject() {
      this.selected_project = null;
      if (device) {
        device.setColor(0,0,0);
      }
    },
    hexToRgb(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }


  }
});

