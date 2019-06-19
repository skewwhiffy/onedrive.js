'use strict';
import shortId from 'shortid';
import { expect } from 'chai';
import FakeAxios from '../../../test.utils/fake.axios';
import Api from './api';

describe('api', () => {
  let ioc;
  let axios;
  let api;

  beforeEach(async () => {
    ({ axios, ioc } = await FakeAxios.init());
    api = new Api(axios);
  });

  it('fetches health information', async () => {
    const result = await api.getHealth();

    expect(result).to.have.keys(['db']);
  });

  it('fetches users', async () => {
    const user = {
      onedriveId: shortId(),
      displayName: shortId(),
      refreshToken: shortId()
    };
    const users = await ioc.getUserRepo();
    await users.insert(user);

    const result = await api.getUsers();

    expect(result).to.have.length(1);
    user.id = result[0].id;
    expect(result[0]).to.eql(user);
  });

  it('fetches redirect URL', async () => {
    const result = await api.getLoginUrl();

    expect(result).not.to.be.undefined();
  });
});
