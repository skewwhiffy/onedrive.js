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
  constructor(logger, entities) {
    this.entities = entities;
    this.logger = logger;
  }

  async process({ user, delta }) {
    const items = delta.value;
    this.logger.info(`Processing delta with ${delta.value.length} items`);
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      if (item.folder) {
        const parentId = item.parentReference.id;
        const folderEntity = {
          userId: user.id,
          name: item.name,
          id: item.id,
          parentFolderId: parentId.endsWith('!0') ? null : parentId
        };
        console.log('Folder:', item.name);
        // TODO: Optimize and parallelize this
        /* eslint-disable no-await-in-loop */
        await upsert(this.entities.Folder, { id: item.id }, folderEntity);
        /* eslint-enable no-await-in-loop */
      } else {
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
