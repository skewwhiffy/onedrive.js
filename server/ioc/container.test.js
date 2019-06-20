'use strict';
import Container, { init } from './container';
import shortId from 'shortid';
import { expect } from 'chai';

describe('IOC container', () => {
  const getNewContainer = toInject => {
    const requiredInjections = {
      app: {},
      config: {}
    };
    if (toInject) Object.assign(requiredInjections, toInject);
    init(requiredInjections);
    return new Container();
  };

  it('instantiates simple class', async () => {
    const container = getNewContainer();
    const marker = shortId();
    class Dummy {
      get marker() { return marker; }
    }

    const result = await container.instantiate(Dummy);

    expect(result.marker).to.equal(marker);
  });

  it('instantiates class with dependencies', async () => {
    const markerValue = shortId();
    const container = getNewContainer({ marker: markerValue });
    class Dummy {
      constructor(marker) {
        this.marker = marker;
      }
    }

    const result = await container.instantiate(Dummy);

    expect(result.marker).to.equal(markerValue);
  });
});
