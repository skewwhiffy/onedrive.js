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
    await this.fileRepo.upsertFile(files);
    const notAccountedFor = items
      .filter(it => !it.file)
      .filter(it => !it.folder);
    if (notAccountedFor.length > 0) throw Error('I don\'t understand');
    const nextLink = delta['@odata.nextLink'] || delta['@odata.deltaLink'];
    await upsert(this.entities.DeltaNext, { userId: user.id }, { userId: user.id, nextLink });
  }

  async getNextLink(user) {
    const existingDeltaNext = await this.entities.DeltaNext.findOne({ where: { userId: user.id } });
    return existingDeltaNext ? existingDeltaNext.nextLink : null;
  }
}
