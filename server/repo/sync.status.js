'use strict';

const setStatus = async (entities, { id }, status) => {
  const update = { userId: id, status };
  const existing = await entities.SyncStatus.findOne({
    where: { userId: id }
  });
  if (existing) {
    await existing.update(update);
  } else {
    await entities.SyncStatus.create(update);
  }
};

export default class {
  constructor(entities) {
    this.entities = entities;
  }

  async get({ id }) {
    const existing = await this.entities.SyncStatus.findOne({
      where: { userId: id }
    });
    if (!existing) return { status: 'unknown' };
    const { status, nextLink } = existing;
    const result = { status };
    if (nextLink) result.nextLink = nextLink;
    return result;
  }

  async setOnedriveSync({ id }) {
    await setStatus(this.entities, { id }, 'onedriveSync');
  }

  async setLocalSync({ id }) {
    await setStatus(this.entities, { id }, 'localSync');
  }

  async setNextLink({ id }, nextLink) {
    const existing = await this.entities.SyncStatus.findOne({
      where: { userId: id }
    });
    if (existing) {
      await existing.update({ nextLink });
    } else {
      await this.entities.SyncStatus.create({
        userId: id,
        status: 'onedriveSync',
        nextLink
      });
    }
  }
}
