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
  constructor(entities) {
    this.entities = entities;
  }

  async upsertFolder(...folders) {
    if (!folders || folders.length === 0) return;
    if (folders.length > 1) {
      // TODO: Parallelize if possible
      await this.upsertFolder(folders[0]);
      await this.upsertFolder(...folders.slice(1));
    }
    const folder = folders[0];
    const toInsert = {
      userId: folder.userId,
      name: folder.name,
      id: folder.id
    };
    if (folder.parentFolderId) toInsert.parentFolderId = folder.parentFolderId;
    await upsert(this.entities.Folder, { id: folder.id }, toInsert);
  }

  async getFolders({ id: userId }, path) {
    let pathParts = path.split('/').filter(it => it);
    let parentFolderId = null;
    while (true) {
      const where = {
        userId,
        parentFolderId
      };
      if (pathParts.length === 0) {
        const response = await this.entities.Folder.findAll({ where });
        return JSON.parse(JSON.stringify(response));
      }
      where.name = pathParts[0];
      pathParts = pathParts.slice(1);
      const response = await this.entities.Folder.findAll({ where });
      if (response.length === 0) return [];
      if (response.length > 1) throw Error('Too many folders');
      parentFolderId = response[0].id;
    }
  }
}
