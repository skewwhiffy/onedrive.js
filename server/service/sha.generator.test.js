'use strict';
import { expect } from 'chai';
import Server from '../../test.utils/integration.setup';

describe('Sha generator', () => {
  let ioc;
  let fs;
  let generator;

  beforeEach(async () => {
    ({ ioc } = await Server.init());
    fs = await ioc.getFs();
    generator = await ioc.getShaGenerator();
  });

  it('generates sha correctly', async () => {
    const file = '/hello.txt';
    await fs.promises.writeFile(file, 'hello');
    const expectedSha = 'AAF4C61DDCC5E8A2DABEDE0F3B482CD9AEA9434D';

    const result = await generator.hash(file);

    expect(result).to.equal(expectedSha);
  });
});
