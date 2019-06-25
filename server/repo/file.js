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
    if (folders.length === 1 && Array.isArray(folders[0])) {
      await this.upsertFolder(...folders[0]);
      return;
    }
    if (!folders || folders.length === 0) return;
    if (folders.length > 1) {
      // TODO: Parallelize if possible
      await this.upsertFolder(folders[0]);
      await this.upsertFolder(...folders.slice(1));
      return;
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

  async getFolderId({ id: userId }, path) {
    if (!path) return this.getFolders({ id: userId }, '/');
    let pathParts = path.split('/').filter(it => it);
    let folder = await this.entities.Folder.findOne({
      where: {
        userId,
        parentFolderId: null
      }
    });
    while (pathParts.length > 0) {
      folder = await this.entities.Folder.findOne({
        where: {
          userId,
          parentFolderId: folder.id,
          name: pathParts[0]
        }
      });
      pathParts = pathParts.slice(1);
    }
    return folder ? folder.id : false;
  }

  async getFolders({ id: userId }, path) {
    const parentFolderId = await this.getFolderId({ id: userId }, path);
    if (!parentFolderId) return [];
    const folders = await this.entities.Folder.findAll({
      where: {
        parentFolderId,
        userId
      }
    });
    return folders.map(folder => ({
      id: folder.id,
      name: folder.name,
      userId,
      parentFolderId
    }));
  }
}
