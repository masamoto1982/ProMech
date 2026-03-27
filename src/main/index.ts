import path from 'node:path';
import fs from 'node:fs';
import { app, BrowserWindow, ipcMain } from 'electron';
import { initDatabase, resolveDatabasePath } from './db/database';

let mainWindow: BrowserWindow | null = null;

const createMainWindow = (): void => {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    show: false,
    webPreferences: {
      contextIsolation: true,
      sandbox: true
    }
  });

  mainWindow.once('ready-to-show', () => mainWindow?.show());

  const entry = path.join(__dirname, '..', 'renderer', 'index.html');
  mainWindow.loadFile(entry);
};

app.whenReady().then(() => {
  initDatabase();
  createMainWindow();

  ipcMain.handle('prescription:printPdf', async (_event, htmlYear: string) => {
    if (!mainWindow) throw new Error('Window is not ready');

    const pdfBytes = await mainWindow.webContents.printToPDF({
      printBackground: true,
      pageSize: 'A4'
    });

    const outputDir = path.join(app.getPath('documents'), 'ProMech', htmlYear);
    fs.mkdirSync(outputDir, { recursive: true });

    const filePath = path.join(outputDir, `prescription-${Date.now()}.pdf`);
    fs.writeFileSync(filePath, pdfBytes);
    return filePath;
  });

  ipcMain.handle('backup:copyDatabase', async (_event, backupDir: string) => {
    const dbPath = resolveDatabasePath();
    fs.mkdirSync(backupDir, { recursive: true });
    const outPath = path.join(backupDir, `promech_db-${Date.now()}.sqlite`);
    fs.copyFileSync(dbPath, outPath);
    return outPath;
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
