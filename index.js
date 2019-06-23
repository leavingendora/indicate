// Modules to control application life and create native browser window
const {app, BrowserWindow, Tray, ipcMain, remote} = require('electron');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let meditationWindow;
let tray = null;
let meditationWindowSender = null;

let spaceKeyDown = false;

function main () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 600,
    height: 600,
    frame: true,
    webPreferences: {
      nodeIntegration: true
    }
  });

  meditationWindow = new BrowserWindow({
    width: 800,
    height: 370,
    frame: false,
    transparent:true,
    webPreferences: {
      nodeIntegration: true
    },
    parent: mainWindow
  });

  //mainWindow.hide();

//   tray = new Tray('./icon/paperclip.png');
//   tray.on('click', () => {
//     mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
//   });

  mainWindow.on('show', () => {
    tray.setHighlightMode('always');
    const bounds = tray.getBounds();
    let y = 0;
    let x = bounds.x + 100;
    if (process.platform !== 'darwin') {
      const size = mainWindow.getSize();
      const windowWidth = size[0];
      const windowHeight = size[1];
      if (bounds.y === 0) { // windows taskbar top
        y = bounds.height;
      } else { // windows taskbar bottom
        y = bounds.y - windowHeight;
      }
    }
    mainWindow.setPosition(x, y);

  });
  
//   mainWindow.on('hide', () => {
//     tray.setHighlightMode('never');
//   });

  // and load the index.html of the app.
  mainWindow.loadFile('index.html');
  meditationWindow.loadFile('meditation.html');
  meditationWindow.setResizable(true);
  meditationWindow.hide();

  meditationWindow.webContents.on('before-input-event', (event, input) => {
    if (input.code === 'Space') {
      if (input.type === 'keyDown') {
        if (!spaceKeyDown) {
          setTimeout(() => {
            if (spaceKeyDown) {
              meditationWindow.hide();
            }
          }, 500);
          spaceKeyDown = true;
        }
      } else {
        spaceKeyDown = false;
      }
      //console.log(input);
    }
  });
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', main);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

ipcMain.on('meditate-ready', (event, args) => {
  meditationWindowSender = event.sender;
});
 
ipcMain.on('meditation-window', (event, args) => {
  if (meditationWindow) {
    meditationWindow.show();
    if (meditationWindowSender) {
      meditationWindowSender.send('meditate-data', args);
    }
  }
});

ipcMain.on('meditate-window-hide', () => {
  if (meditationWindow) {
    meditationWindow.hide();
  }
});

