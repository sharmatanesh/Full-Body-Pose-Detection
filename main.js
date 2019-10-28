// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
const {ipcMain} = require('electron');
const { powerSaveBlocker } = require('electron')

powerSaveBlocker.start('prevent-app-suspension');
powerSaveBlocker.start('prevent-display-sleep')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    useContentSize:true,
    resizable:false,
    // alwaysOnTop:true,
    webPreferences: {
      backgroundThrottling:false,
      pageVisibility: true,
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    }
  })

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
app.commandLine.appendSwitch('disable-renderer-backgrounding');

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') 
  app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

var floating = false;
var oldSize;

ipcMain.on('resize', function (e, x, y) {
  oldSize = [x,y];
  mainWindow.setContentSize(x, y);
})

ipcMain.on('float',function(){
  if (!floating){
    mainWindow.setAlwaysOnTop(true);
    mainWindow.setVisibleOnAllWorkspaces(true);
    mainWindow.setPosition(0,0);
    mainWindow.setContentSize(1,1);
  }else{

    mainWindow.setAlwaysOnTop(false);
    mainWindow.setVisibleOnAllWorkspaces(false);
    mainWindow.setContentSize(oldSize[0],oldSize[1]);
  }
  floating = !floating;
})

