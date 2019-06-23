const Vue = require('vue/dist/vue.js');
const ipc = require('electron').ipcRenderer;

var Meditate = new Vue({
  el: '#meditate',
  data: {
    timeOut: 10,
    title: 'Just Relax take it Easy',
    type: 'Meditation',
    timeRemaining: 10,
    animationScaler: 100,
    timer: null
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
        this.timeRemaining = data.timeOut;
        clearInterval(this.timer);
        this.timer = setInterval(this.timerHandling, 1000);
      });
      ipc.send('meditate-ready');
    },
    timerHandling() {
      this.timeRemaining -= 1;
      if (this.timeRemaining <= 0) {
        this.hide();
      }
    },
    hide() {
      clearInterval(this.timer);
      ipc.send('meditate-window-hide');
    }
  }
});

