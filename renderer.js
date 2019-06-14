const {clipboard} = require('electron');
const Vue = require('vue/dist/vue.js');
const jayson = require("jayson");

const client = jayson.client.http({
  port: 3000
});




// https://stackoverflow.com/questions/49745497/how-to-display-async-data-in-vue-template



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
    project_state: ""
  },
  created() {
    this.getProjectDataFromServer()
  },
  methods: {
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
    }


  }
});

