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

  async upsertFile(...files) {
    if (files.length === 1 && Array.isArray(files[0])) {
      await this.upsertFile(...files[0]);
      return;
    }
    if (!files || files.length === 0) return;
    if (files.length > 1) {
      // TODO: Parallelize if possible
      await this.upsertFile(files[0]);
      await this.upsertFile(...files.slice(1));
      return;
    }
    const file = files[0];
    const toInsert = {
      userId: file.userId,
      name: file.name,
      id: file.id,
      parentFolderId: file.parentFolderId
    };
    await upsert(this.entities.File, { id: file.id }, toInsert);
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

  async getFiles({ id: userId }, path) {
    const parentFolderId = await this.getFolderId({ id: userId }, path);
    const files = await this.entities.File.findAll({
      where: {
        parentFolderId,
        userId
      }
    });
    return files
      .map(file => ({
        id: file.id,
        name: file.name,
        userId,
        parentFolderId
      }));
  }
}
