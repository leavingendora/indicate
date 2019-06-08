// Modules to control application life and create native browser window
const {app, BrowserWindow, Tray} = require('electron');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let tray = null;





/* =========================================================================== */



//console.log(client);


// client.request('updateStatus', {id: '8r7yxef2jwmjjwz9', status: 'closed'}, function(err, response) {
//   if(err) throw err;
//   console.log(response.result);
// });

// client.request('addProject', { name: 'indic8', icon: 'none', color: {r: 128, g: 0, b: 0}}, function(err, response) {
//   if(err) throw err;
//   console.log(response.result);
// });

 //client.request('updateTime', id, 10);


// client.request('updateTime', {id: '8r7yxef2jwmjjwz9', time: 10}, function(err, response) {
//   if(err) throw err;
//   console.log(response.result);
// });

// client.request('get', null, function(err, response) {
//   if(err) throw err;
//   console.log(response.result);
//   id = response.result[0].id;
// });




function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 600,
    height: 600,
    frame: true,
    webPreferences: {
      nodeIntegration: true
    }
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
app.on('ready', createWindow);

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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
