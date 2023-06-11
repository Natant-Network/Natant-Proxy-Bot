import express, { Request, Response } from 'express';
import axios from 'axios';
var client: any;

const app = express();

export default (_client: any) => {
  client = _client;
  app.listen(process.env.PORT || 8080);
  return app;
}

const REDIRECT_URL: string = process.env.REDIRECT_URL || '';

app.set('trust proxy', true);

app.get('/', (req: Request, res: Response) => {
  res.end(req.ip);
  //res.end(`<html><head><style>*{font-family:system-ui;}</style></head><body><h1>You are using <b>replit-alive-server</b> and you IP is ${req.ip}.<br>Head over to a site like <a href=\"https://up.coding398.dev/\" target=\"_blank\">up.coding398.dev</a> to keep your repl alive with this webserver.</h1><p>Thanks for using me!</p></body></html>`)
});

app.get('/up', (req, res) => res.end('true'));

app.get('/linked-role', (req: Request, res: Response) => {
  res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${client.user?.id}&redirect_uri=${encodeURIComponent(REDIRECT_URL)}&response_type=code&scope=role_connections.write identify`)
});

app.get('/linked-role/cb', async (req: Request, res: Response) => {
  // @ts-ignore We deal with that code can be undefined later
  const code: string = req.query.code;
  const data = await exchangeCode(code, REDIRECT_URL);
  if (data.error) return res.send('Bad Request');
  const role = await axios({
    method: 'PUT',
    url: `https://discord.com/api/v10/users/@me/applications/${client.user?.id}/role-connection`,
    data: {
      platform_name: 'Link Master',
      metadata: {
        used: 1,
        uses: 3
      }
    },
    headers: {
      Authorization: `${data.token.token_type} ${data.token.access_token}`,
      'Content-Type': 'application/json'
    }
  })
  res.json({
    done: true,
    data: data.user
  });
});

async function exchangeCode(code: string, redirect_uri: string): Promise<any> {
  if (!code) return { error: true };
  var token, user;
  try {
    token = await axios({
      method: 'POST',
      url: 'https://discord.com/api/v10/oauth2/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        client_id: client.user.id,
        client_secret: process.env.CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri
      }
    });
  } catch (error) {
    return { error };
  }
  if (!token.data) return { error: true };
  try {
    user = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        authorization: `${token.data.token_type} ${token.data.access_token}`
      }
    });
  } catch (error) {
    return { error };
  }
  return {
    token: token.data,
    user: user.data
  }
}