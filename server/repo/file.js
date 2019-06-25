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
    if (!path) return this.getFolderId({ id: userId }, '/');
    const rootFolder = await this.entities.Folder.findOne({
      where: {
        userId,
        parentFolderId: null
      }
    });
    const getFolderIdInternal = async (folderId, pathParts) => {
      if (pathParts.length === 0) return folderId;
      if (!folderId) return false;
      const nextFolder = await this.entities.Folder.findOne({
        where: {
          userId,
          parentFolderId: folderId,
          name: pathParts[0]
        }
      });
      if (!nextFolder) return false;
      return getFolderIdInternal(nextFolder.id, pathParts.slice(1));
    };
    return getFolderIdInternal(rootFolder.id, path.split('/').filter(it => it));
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
    return folders
      .map(folder => ({
        id: folder.id,
        name: folder.name,
        userId,
        parentFolderId
      }));
  }
}
