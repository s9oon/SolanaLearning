const { app, BrowserWindow } = require('electron');
const path = require('path');

app.disableHardwareAcceleration();

async function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'Solana',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => app.quit());
