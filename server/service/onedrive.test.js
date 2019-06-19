'use strict';
import querystring from 'querystring';
import sinon from 'sinon';
import shortId from 'shortid';
import _ from 'lodash';
import { expect } from 'chai';
import Logger from '../utils/logger';
import Onedrive from './onedrive';

describe('OneDrive service', () => {
  let axios;
  let onedrive;

  beforeEach(() => {
    axios = { post: sinon.stub() };
    onedrive = new Onedrive(axios, new Logger(() => {}));
  });

  it('constructs call to get oauth token', async () => {
    const code = shortId();
    const oauthToken = {
      refresh_token: shortId(),
      access_token: shortId(),
      expires_in: _.random(100)
    };
    const expected = {
      refreshToken: oauthToken.refresh_token,
      accessToken: oauthToken.access_token,
      expiresIn: oauthToken.expires_in
    };
    axios.post.resolves({ data: oauthToken });

    const result = await onedrive.getOauthToken(code);

    expect(result).to.eql(expected);
    sinon.assert.calledOnce(axios.post);
    const [url, rawPayload, options] = axios.post.getCall(0).args;
    expect(url).to.include('oauth20_token.srf');
    const payload = querystring.parse(rawPayload);
    expect(payload.code).to.equal(code);
    expect(payload.grant_type).to.equal('authorization_code');
    expect(payload).to.include.keys(['client_id', 'redirect_uri', 'client_secret']);
    expect(options.headers).to.eql({ 'Content-Type': 'application/x-www-form-urlencoded' });
  });
});
