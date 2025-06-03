import { app, BrowserWindow, ipcMain, dialog } from "electron";
import registerListeners from "./helpers/ipc/listeners-register";
// "electron-squirrel-startup" seems broken when packaging with vite
//import started from "electron-squirrel-startup";
import path from "path";
import {
  installExtension,
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";

import fs from "fs";
import yaml from "js-yaml";

const inDevelopment = process.env.NODE_ENV === "development";

function createWindow() {
  const preload = path.join(__dirname, "preload.js");
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      devTools: inDevelopment,
      contextIsolation: true,
      nodeIntegration: true,
      nodeIntegrationInSubFrames: false,

      preload: preload,
    },
    titleBarStyle: "hidden",
  });
  registerListeners(mainWindow);

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }
}

async function installExtensions() {
  try {
    const result = await installExtension(REACT_DEVELOPER_TOOLS);
    console.log(`Extensions installed successfully: ${result.name}`);
  } catch {
    console.error("Failed to install extensions");
  }
}


function isContest(pth: string) {
  try {
    const stats = fs.statSync(path.join(pth, "data", "contest.yaml"));
    return stats.isFile();
  } catch {
    return false;
  }
}

function chooseContest() {
  const result = dialog.showOpenDialogSync({
    properties: ['openDirectory'],
  });
  if (result === undefined) return undefined;
  console.log(result);
  if (result.length != 1 || !isContest(result[0])) return undefined;
  console.log(result);
  return result[0];
  // dialog.showOpenDialog({
  //   properties: ['openDirectory'],
  // }).then(result => {
  //   if (!result.canceled) {
  //     console.log(result.filePaths);
  //   }
  // }).catch(err => {
  //   console.log(err);
  // })
}

app.whenReady().then(() => {
  ipcMain.handle('getProblemConfig', (event, filePath) => {
    try {
      const doc = yaml.load(fs.readFileSync(filePath, 'utf8'));
      return doc;
    } catch (e) {
      console.error(e);
    }
  });
  ipcMain.handle('chooseContest', () => {
    return chooseContest();
  });
  createWindow();
}).then(installExtensions);

//osX only
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
//osX only ends
