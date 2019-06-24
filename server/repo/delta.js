'use strict';

const upsert = async (entity, where, values) => {
  const existing = await entity.findOne({ where });
  if (existing) {
    await existing.update(values);
  } else {
    await entity.create(values);
  }
};

export default class {
  constructor(logger, entities, fileRepo) {
    this.logger = logger;
    this.entities = entities;
    this.fileRepo = fileRepo;
  }

  async process({ user, delta }) {
    const items = delta.value;
    this.logger.info(`Processing delta with ${delta.value.length} items`);

    const folders = items
      .filter(it => it.folder)
      .map(it => ({
        userId: user.id,
        name: it.name,
        id: it.id,
        parentFolderId: it.parentReference.id.endsWith('!0') ? null : it.parentReference.id
      }));
    await this.fileRepo.upsertFolder(folders);
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      if (!item.folder) {
        const parentId = item.parentReference.id;
        const fileEntity = {
          userId: user.id,
          name: item.name,
          id: item.id,
          parentFolderId: parentId.endsWith('!0') ? null : parentId
        };
        /* eslint-disable no-await-in-loop */
        await upsert(this.entities.File, { id: item.id }, fileEntity);
        /* eslint-enable no-await-in-loop */
      }
    }
    const nextLink = delta['@odata.nextLink'];
    await upsert(this.entities.DeltaNext, { userId: user.id }, { userId: user.id, nextLink });
  }

  async getNextLink(user) {
    const existingDeltaNext = await this.entities.DeltaNext.findOne({ where: { userId: user.id } });
    return existingDeltaNext ? existingDeltaNext.nextLink : null;
  }
}
