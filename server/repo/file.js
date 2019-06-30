'use strict';
import _ from 'lodash';
import { Op } from 'sequelize';

// TODO: Split this repo
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

    const existingFoldersInDb = await this.entities.Folder.findAll({
      where: {
        id: {
          [Op.in]: folders.map(it => it.id)
        }
      }
    });
    const existingFoldersInDbById = _.keyBy(existingFoldersInDb, it => it.id);
    const newFolders = folders.filter(it => !Object.keys(existingFoldersInDbById).includes(it.id));
    const existingFoldersById = _.keyBy(folders, it => it.id);
    const updates = Object
      .keys(existingFoldersInDbById)
      .map(id => ({ db: existingFoldersInDbById[id], update: existingFoldersById[id] }));
    await Promise.all(updates.map(({ db, update }) => db.update(update)));
    await this.entities.Folder.bulkCreate(newFolders);
  }

  async upsertFile(...files) {
    if (files.length === 1 && Array.isArray(files[0])) {
      await this.upsertFile(...files[0]);
      return;
    }
    if (!files || files.length === 0) return;

    const folders = files.filter(it => it.onedriveStatus === 'exists');
    if (folders.length > 0) throw Error(`You're inserting folder ${folders[0].name} into files`);

    const existingFilesInDb = await this.entities.File.findAll({
      where: {
        id: {
          [Op.in]: files.map(it => it.id)
        }
      }
    });
    const existingFilesInDbById = _.keyBy(existingFilesInDb, it => it.id);
    const newFiles = files.filter(it => !Object.keys(existingFilesInDbById).includes(it.id));
    const existingFilesById = _.keyBy(files, it => it.id);
    const updates = Object
      .keys(existingFilesInDbById)
      .map(id => ({ db: existingFilesInDbById[id], update: existingFilesById[id] }));
    await Promise.all(updates.map(({ db, update }) => db.update(update)));
    await this.entities.File.bulkCreate(newFiles);
  }

  async getFolderId({ id: userId }, path) {
    if (!path) return this.getFolderId({ id: userId }, '/');
    const rootFolder = await this.entities.Folder.findOne({
      where: {
        userId,
        parentFolderId: null
      }
    });
    if (!rootFolder) return false;
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
        parentFolderId,
        onedriveStatus: folder.onedriveStatus,
        localStatus: folder.localStatus
      }));
  }

  async getPath(item) {
    const getAllParents = async (soFar) => {
      if (!soFar[0].parentFolderId) return soFar;
      const parent = await this.entities.Folder.findOne({
        where: { id: soFar[0].parentFolderId }
      });
      return getAllParents([parent, ...soFar]);
    };
    const parents = await getAllParents([item]);
    return parents.slice(1).map(it => it.name).join('/');
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
        parentFolderId,
        onedriveStatus: file.onedriveStatus,
        localStatus: file.localStatus
      }));
  }

  async setLocalExistsFolders(...folders) {
    if (folders.length === 1 && Array.isArray(folders[0])) {
      await this.setLocalExistsFolders(...folders[0]);
      return;
    }
    if (!folders || folders.length === 0) return;
    const dbFolders = await this.entities.Folder.findAll({
      where: {
        id: {
          [Op.in]: folders.map(it => it.id)
        }
      }
    });
    await Promise.all(dbFolders.map(it => it.update({ localStatus: 'exists' })));
  }

  // TODO: TEST
  async setLocalShaForFile({ id }, shaSum) {
    const fileFromDb = await this.entities.File.findAll({ where: { id } });
    if (fileFromDb.length === 0) throw Error(`File with ${id} does not exist in DB`);
    await fileFromDb[0].update({ localStatus: shaSum });
  }

  async getLocalUnknownFolders({ id: userId }, limit) {
    if (!limit) return this.getLocalUnknownFolders({ id: userId }, 1000);
    const folders = await this.entities.Folder.findAll({
      limit,
      where: {
        userId,
        localStatus: 'unknown',
        parentFolderId: { [Op.ne]: null }
      }
    });
    return folders
      .map(folder => ({
        id: folder.id,
        name: folder.name,
        userId,
        parentFolderId: folder.parentFolderId,
        onedriveStatus: folder.onedriveStatus,
        localStatus: folder.localStatus
      }));
  }

  async getLocalUnknownFiles({ id: userId }, limit) {
    if (!limit) return this.getLocalUnknownFiles({ id: userId }, 1000);
    const files = await this.entities.File.findAll({
      limit,
      where: {
        userId,
        localStatus: 'unknown'
      }
    });

    return files
      .map(file => ({
        id: file.id,
        name: file.name,
        userId,
        parentFolderId: file.parentFolderId,
        onedriveStatus: file.onedriveStatus,
        localStatus: file.onedriveStatus
      }));
  }
}
