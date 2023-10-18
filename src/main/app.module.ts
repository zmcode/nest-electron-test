import { join } from 'node:path'
import { Module } from '@nestjs/common'
import { ElectronModule } from '@doubleshot/nest-electron'
import { BrowserWindow, app } from 'electron'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [ElectronModule.registerAsync({
    useFactory: async () => {
      const isDev = !app.isPackaged
      const win = new BrowserWindow({
        width: 1024,
        height: 768,
        autoHideMenuBar: true,
        webPreferences: {
          contextIsolation: true,
          preload: join(__dirname, '../preload/index.js'),
        },
      })

      win.on('closed', () => {
        win.destroy()
      })

      win.loadURL(process.env['ELECTRON_RENDERER_URL']);
      win.on('ready-to-show', () => {
        win.show();
      });
      return { win }
    },
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
