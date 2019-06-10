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
    data: []
  },
  created() {
    client.request('get', null, function(err, response) {
      if(err) throw err;
      self.data = response.result;
      console.log(self.data);
    });
  },
  filters: {
    formateDate: function(value) {
      if (value) {
        return moment(String(value)).format('DD/MM/YYYY HH:mm');
        //return true
      }
    }
  },
  computed: {
  },
  methods: {



  }

});

