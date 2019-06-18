'use strict';
export default class {
  constructor() {
    const clientSecret = 'gcyhkJZK73!$:zqHNBE243}'
    const scopes = [ 'files.readwrite', 'offline_access' ];
    this.loginUrl = 'https://login.live.com/oauth20_authorize.srf';
    this.loginQuery = {
      client_id: '21133f26-e5d8-486b-8b27-0801db6496a9',
      scope: scopes.join(' '),
      redirect_uri: 'http://localhost:38080', // TODO: Config
      response_type: 'code'
    };
  }
}
