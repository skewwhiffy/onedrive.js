'use strict';
import shortId from 'shortid';
import { expect } from 'chai';
import Server from '../../test.utils/integration.setup';

describe('Sync status repository', () => {
  let ioc;
  let user;
  let syncStatusRepo;

  beforeEach(async () => {
    ({ ioc } = await Server.init());
    user = await Server.insertUser(ioc);
    syncStatusRepo = await ioc.getSyncStatusRepo();
  });

  it('returns unknown status when there is no status', async () => {
    const expected = { status: 'unknown' };

    const status = await syncStatusRepo.get(user);

    expect(status).to.eql(expected);
  });

  it('returns onedrive sync status when it is set', async () => {
    const expected = { status: 'onedriveSync' };

    await syncStatusRepo.setOnedriveSync(user);
    const status = await syncStatusRepo.get(user);

    expect(status).to.eql(expected);
  });

  it('returns local sync status when it is set', async () => {
    const expected = { status: 'localSync' };

    await syncStatusRepo.setLocalSync(user);
    const status = await syncStatusRepo.get(user);

    expect(status).to.eql(expected);
  });

  it('returns next link when it is set', async () => {
    const nextLink = shortId();
    const expected = { status: 'onedriveSync', nextLink };

    await syncStatusRepo.setNextLink(user, nextLink);
    const status = await syncStatusRepo.get(user);

    expect(status).to.eql(expected);
  });

  it('status is not changed when next link is set', async () => {
    const nextLink = shortId();
    const expected = { status: 'localSync', nextLink };

    await syncStatusRepo.setLocalSync(user);
    await syncStatusRepo.setNextLink(user, nextLink);
    const status = await syncStatusRepo.get(user);

    expect(status).to.eql(expected);
  });
});
