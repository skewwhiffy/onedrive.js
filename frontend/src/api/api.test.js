'use strict';
import safeId from 'generate-safe-id';
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
    const user = { email: `${safeId()}@test.com` };
    const users = await ioc.getUserRepo();
    await users.insert(user);

    const result = await api.getUsers();

    expect(result).to.have.length(1);
    expect(result[0].email).to.equal(user.email);
  });
});
