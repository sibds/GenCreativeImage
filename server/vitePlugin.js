import { handleGenerate } from './generate.js';

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

export function localGenerateApiPlugin(env) {
  const handle = async (req, res, next) => {
    const url = req.url?.split('?')[0];
    if (url !== '/api/generate') {
      next();
      return;
    }

    if (req.method !== 'POST') {
      sendJson(res, 405, { success: false, error: 'Method not allowed' });
      return;
    }

    try {
      const body = await readJsonBody(req);
      const result = await handleGenerate({
        body,
        ip: req.socket?.remoteAddress || 'local',
        env
      });
      sendJson(res, result.status, result.body);
    } catch {
      sendJson(res, 400, { success: false, error: 'Некорректный JSON.' });
    }
  };

  return {
    name: 'local-generate-api',
    configureServer(server) {
      server.middlewares.use(handle);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handle);
    }
  };
}
