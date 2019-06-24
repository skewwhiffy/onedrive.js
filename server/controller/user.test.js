'use strict';
import { expect } from 'chai';
import sinon from 'sinon';
import shortId from 'shortid';
import Server from '../../test.utils/integration.setup';

describe('GET /api/user', () => {
  let axios;
  let ioc;
  let userRepo;
  let server;

  beforeEach(async () => {
    axios = {
      get: sinon.stub(),
      post: sinon.stub()
    };
    ({ ioc, server } = await Server.init({ axios }));
    userRepo = await ioc.getUserRepo();
  });

  it('gets users', async () => {
    const user = await Server.insertUser(ioc);

    const result = await server.get('/api/user');

    expect(result.status).to.equal(200);
    const users = result.body;
    expect(users).to.have.length(1);
    expect(users[0].email).to.equal(user.email);
  });

  it('returns login URL', async () => {
    const result = await server.put('/api/user');

    expect(result.status).to.equal(200);
    const { redirect, query } = result.body;
    expect(redirect).to.include('login.live.com');
    expect(query).to.have.keys('client_id', 'scope', 'redirect_uri', 'response_type');
  });

  it('puts code into database', async () => {
    const onedriveUser = {
      id: shortId(),
      displayName: shortId()
    };
    const refreshToken = shortId();
    axios.post.resolves({
      data: {
        access_token: shortId(),
        expires_in: shortId(),
        refresh_token: refreshToken
      }
    });
    axios.get.resolves({ data: { owner: { user: onedriveUser } } });
    const code = shortId();
    const result = await server.get(`/api/user/code/${code}`);
    const users = await userRepo.get();

    expect(result.status).to.equal(302);
    expect(result.headers.location).to.equal('/');
    expect(users).to.have.length(1);
    const dbUser = users[0];
    expect(dbUser).to.eql({
      id: dbUser.id,
      onedriveId: onedriveUser.id,
      displayName: onedriveUser.displayName,
      refreshToken
    });
  });
});
