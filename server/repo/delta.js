'use strict';

export default class {
  constructor(logger, syncStatusRepo, fileRepo) {
    this.logger = logger;
    this.syncStatusRepo = syncStatusRepo;
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
        parentFolderId: it.parentReference.id.endsWith('!0') ? null : it.parentReference.id,
        onedriveStatus: it.deleted ? 'deleted' : 'exists',
        localStatus: 'unknown'
      }));
    this.logger.info(`Processing ${folders.length} folders`);
    await this.fileRepo.upsertFolder(folders);

    const files = items
      .filter(it => it.file)
      .map(it => ({
        userId: user.id,
        name: it.name,
        id: it.id,
        parentFolderId: it.parentReference.id,
        onedriveStatus: it.deleted ? 'deleted' : it.file.hashes.sha1Hash,
        localStatus: 'unknown'
      }));
    this.logger.info(`Processing ${files.length} files`);
    await this.fileRepo.upsertFile(files);
    const notAccountedFor = items
      .filter(it => !it.file)
      .filter(it => !it.folder);
    if (notAccountedFor.length > 0) throw Error('I don\'t understand');
    const nextLink = delta['@odata.nextLink'] || delta['@odata.deltaLink'];
    await this.syncStatusRepo.setNextLink(user, nextLink);
    if (items.length === 0) await this.syncStatusRepo.setLocalSync(user);
    else await this.syncStatusRepo.setOnedriveSync(user);
  }

  async getNextLink({ id }) {
    const { nextLink } = await this.syncStatusRepo.get({ id });
    return nextLink;
  }
}
