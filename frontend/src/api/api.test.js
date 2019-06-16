'use strict';
import { expect } from 'chai';
import FakeAxios from '../../../test.utils/fake.axios';
import Api from './api';

describe('api', () => {
  let axios;
  let api;

  beforeEach(async () => {
    ({ axios } = await FakeAxios.init());
    api = new Api(axios);
  });

  it('fetches health information', async () => {
    const result = await api.getHealth();

    expect(result).to.have.keys(['db']);
  });
});
