import { BrowserWindow, ipcMain, shell } from 'electron';
import { createServer, Server } from 'http';
import { IPC } from './shared-with-frontend/ipc-events.const';
import { log } from 'electron-log/main';

const LOOPBACK_HOST = '127.0.0.1';
const OAUTH_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

let loopbackServer: Server | null = null;
let oauthTimeoutId: ReturnType<typeof setTimeout> | null = null;

const cleanupServer = (): void => {
  if (oauthTimeoutId) {
    clearTimeout(oauthTimeoutId);
    oauthTimeoutId = null;
  }
  if (loopbackServer) {
    loopbackServer.close();
    loopbackServer = null;
  }
};

// Success page shown in the user's browser after completing OAuth
const SUCCESS_HTML = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>KaironTask</title>
<style>body{font-family:system-ui,sans-serif;display:flex;align-items:center;
justify-content:center;height:100vh;margin:0;background:#0b0d12;color:#e2e6f0}
.card{text-align:center;padding:2rem;background:#161a23;border:1px solid rgba(124,58,237,0.3);border-radius:10px;
box-shadow:0 8px 32px rgba(0,0,0,.45)}h2{color:#f1f3f9}p{color:rgba(226,230,240,0.7)}</style></head>
<body><div class="card"><h2>Authentication complete</h2>
<p>You can close this tab and return to KaironTask.</p></div></body></html>`;

export const initPluginOAuth = (mainWin: BrowserWindow): void => {
  // Prepare: start a loopback HTTP server and return the port.
  // Google Desktop OAuth requires http://127.0.0.1:<port> redirect URIs
  // and blocks embedded webviews, so we open the system browser instead.
  ipcMain.handle(IPC.PLUGIN_OAUTH_PREPARE, async (): Promise<{ port: number }> => {
    cleanupServer();

    return new Promise<{ port: number }>((resolve, reject) => {
      let handled = false;

      const server = createServer((req, res) => {
        if (handled) {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(SUCCESS_HTML);
          return;
        }
        handled = true;

        const url = new URL(req.url!, `http://${LOOPBACK_HOST}`);
        const code = url.searchParams.get('code');
        const error = url.searchParams.get('error');
        const state = url.searchParams.get('state');

        // eslint-disable-next-line @typescript-eslint/naming-convention
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(SUCCESS_HTML);

        mainWin.webContents.send(IPC.PLUGIN_OAUTH_CB, { code, error, state });

        // Re-focus the main window after auth completes
        if (!mainWin.isDestroyed()) {
          mainWin.show();
          mainWin.focus();
        }

        cleanupServer();
      });

      server.listen(0, LOOPBACK_HOST, () => {
        const addr = server.address();
        if (addr && typeof addr !== 'string') {
          loopbackServer = server;
          oauthTimeoutId = setTimeout(() => {
            log('Plugin OAuth: Timeout – closing abandoned loopback server');
            cleanupServer();
          }, OAUTH_TIMEOUT_MS);
          log(`Plugin OAuth: Loopback server listening on port ${addr.port}`);
          resolve({ port: addr.port });
        } else {
          server.close();
          reject(new Error('Failed to start OAuth loopback server'));
        }
      });

      server.on('error', (err) => {
        reject(err);
      });
    });
  });

  // Open the auth URL in the system browser (not an embedded webview).
  // Google blocks OAuth in embedded browsers (Electron BrowserWindow).
  ipcMain.on(IPC.PLUGIN_OAUTH_START, (_ev: unknown, { url }: { url: string }) => {
    log('Plugin OAuth: Opening system browser for auth');

    // Validate URL protocol before opening to prevent file:// or javascript: abuse
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== 'https:') {
        log('Plugin OAuth: Rejected non-https auth URL:', parsed.protocol);
        mainWin.webContents.send(IPC.PLUGIN_OAUTH_CB, {
          error: 'invalid_auth_url',
        });
        cleanupServer();
        return;
      }
    } catch {
      mainWin.webContents.send(IPC.PLUGIN_OAUTH_CB, {
        error: 'invalid_auth_url',
      });
      cleanupServer();
      return;
    }

    shell.openExternal(url).catch((err: unknown) => {
      log('Plugin OAuth: Failed to open system browser:', err);
      mainWin.webContents.send(IPC.PLUGIN_OAUTH_CB, {
        error: 'failed_to_open_browser',
      });
      cleanupServer();
    });
  });
};
