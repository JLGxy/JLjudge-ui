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
  ipcMain.handle('getProblemConfig', (event, contestPath, problem) => {
    try {
      const doc = yaml.load(fs.readFileSync(path.join(contestPath, "data", problem, "conf.yaml"), 'utf8'));
      return {
        probname: doc.name,
        probtype: doc.type,
        compilers: doc.compilers,
        use_file_input: doc.input_file !== '',
        input_file: doc.input_file,
        use_file_output: doc.output_file !== '',
        output_file: doc.output_file,
        checker: doc.checker,
        checker_compiler: doc.checker_compiler,
        interactor: doc?.interactor || '',
        interactor_compiler: doc?.interactor_compiler || '',
      };
    } catch (e) {
      console.error(e);
    }
  });
  ipcMain.handle('updateProblemConfig', (event, contestPath, problem, config) => {
    console.log("Updating problem config", contestPath, problem);
    try {
      fs.writeFileSync(path.join(contestPath, "data", problem, "conf.yaml"), yaml.dump({
        name: problem,
        type: config.probtype,
        compilers: config.compilers,
        input_file: config.use_file_input ? config.input_file : '',
        output_file: config.use_file_output ? config.output_file : '',
        checker: config.checker,
        checker_compiler: config.checker_compiler,
        interactor: config.probtype == "interactive"? config.interactor: undefined,
        interactor_compiler: config.probtype == "interactive"? config.interactor_compiler: undefined,
      }), 'utf8');
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  });
  ipcMain.handle('getContestConfig', (event, contestPath) => {
    try {
      const doc = yaml.load(fs.readFileSync(path.join(contestPath, "data", "contest.yaml"), 'utf8'));
      return {
        problems: doc.problems as string[],
        compilers: doc.compilers as {
          name: string,
          path: string,
          args: string[],
          suffixes: string[],
        }[],
      };
    } catch (e) {
      console.error(e);
    }
  });
  ipcMain.handle('chooseContest', () => {
    return chooseContest();
  });
  ipcMain.handle('getProblemList', (event, contestPath) => {
    const problemList: string[] = [];
    const items = fs.readdirSync(path.join(contestPath, "data"));
    items.forEach(item => {
      if (fs.statSync(path.join(contestPath, "data", item)).isDirectory() && fs.statSync(path.join(contestPath, "data", item, "conf.yaml"), { throwIfNoEntry: false })?.isFile()) {
        problemList.push(item);
      }
    });
    return problemList;
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
