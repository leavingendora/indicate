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
      ipc.on('meditate-data', (event, type, timeout, text) => {
        this.timeOut = timeout;
        this.title = text;
        this.type = type;
        this.timeRemaining =  this.timeOut;
        clearInterval(this.timer);
        this.timer = setInterval(this.timerHandling, 1000);


      });
      ipc.send('meditate-window-ready');
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

