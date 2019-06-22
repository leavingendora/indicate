const Vue = require('vue/dist/vue.js');
const ipc = require('electron').ipcRenderer


var Meditate = new Vue({
  el: '#meditate',
  data: {
    timeOut: 10,
    title: 'test',
    type: 'meditation'
  },
  created() {
    this.setupIPC();
  },
  methods: {
    setupIPC() {
      console.log("setup");
      ipc.on('meditate-data', (event, data) => {
        this.timeOut = data.timeOut;
        this.title = data.title;
        this.type = data.type;
      });
      ipc.send('meditate-ready');
    }
  }
});

