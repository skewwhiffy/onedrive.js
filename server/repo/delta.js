'use strict';

export default class {
  constructor(entities) {
    this.entities = entities;
  }

  async process({ user, delta }) {
    const items = delta.value;
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
        /* eslint-disable no-await-in-loop */
        await this.entities.Folder.create(folderEntity);
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
        await this.entities.File.create(fileEntity);
        /* eslint-enable no-await-in-loop */
      }
    }
  }
}
