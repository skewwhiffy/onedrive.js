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

  async getFolders({ id: userId }, path) {
    if (!path) return this.getFolders({ id: userId }, '/');
    const getFoldersInternal = async (pathParts, parentFolderId) => {
      const where = {
        userId,
        parentFolderId
      };
      if (pathParts.length === 0) {
        const response = await this.entities.Folder.findAll({ where });
        return response
          .map(folder => ({
            id: folder.id,
            name: folder.name,
            userId: folder.userId,
            parentFolderId: folder.parentFolderId || undefined
          }));
      }
      [where.name] = pathParts;
      const response = await this.entities.Folder.findAll({ where });
      if (response.length === 0) return [];
      if (response.length > 1) throw Error('Too many folders');
      return getFoldersInternal(pathParts.slice(1), response[0].id);
    };
    return getFoldersInternal(path.split('/').filter(it => it), null);
  }
}
