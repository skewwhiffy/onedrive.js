'use strict';
import { expect } from 'chai';
import path from 'path';
import { promises as fs } from 'fs';
import ShaGenerator from './sha.generator';

describe('Sha generator', () => {
  let generator;

  beforeEach(() => {
    // TODO: Mock up using in memory file system
    generator = new ShaGenerator(fs);
  });

  it('generates sha correctly', async () => {
    const expectedSha = 'CE747B254B067BCAE364C85CB055F22F8792E526';
    const file = path.join(__dirname, '../../migrations/20190615.users.js');

    const result = await generator.hash(file);

    // If this fails, you might have changed a migration. Naughty.
    // Or: you've checked out the migration with Windows line endings. That might kill this test,
    // I don't know.
    expect(result).to.equal(expectedSha);
  });
});
