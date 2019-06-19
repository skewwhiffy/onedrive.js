'use strict';
import querystring from 'querystring';
import url from 'url';

const authUrl = 'https://login.live.com';
// const graphUrl = "https://graph.microsoft.com";
const redirectUrl = 'http://localhost:38080'; // TODO: Config
const clientId = '21133f26-e5d8-486b-8b27-0801db6496a9';
const clientSecret = 'gcyhkJZK73!$:zqHNBE243}';

export default class {
  constructor(axios, logger) {
    const scopes = ['files.readwrite', 'offline_access'];
    this.loginUrl = 'https://login.live.com/oauth20_authorize.srf';
    this.loginQuery = {
      client_id: clientId,
      scope: scopes.join(' '),
      redirect_uri: redirectUrl,
      response_type: 'code'
    };
    this.logger = logger;
    this.axios = axios;
  }

  async getOauthToken(code) {
    const oauthUrl = url.resolve(authUrl, 'oauth20_token.srf');
    const request = {
      client_id: clientId,
      redirect_uri: redirectUrl,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      code
    };

    this.logger.info('Getting OAuth token');
    this.logger.info(oauthUrl);
    const result = await this.axios.post(
      oauthUrl,
      querystring.stringify(request),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    const { data } = result;
    this.logger.info('Got OAuth token');

    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in,
      refreshToken: data.refresh_token
    };
  }
}
