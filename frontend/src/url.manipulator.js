'use strict';

export default class {
  get tab() {
    return global
      .window
      .location
      .pathname
      .split('/')
      .filter(it => it)[0];
  }

  set tab(tab) {
    const url = `/${tab}`;
    global.history.pushState({ id: tab }, tab, url);
  }

  get folderPath() {
    return global
      .window
      .location
      .pathname
      .split('/')
      .filter(it => it)
      .slice(1)
      .join('/');
  }

  set folderPath(path) {
    let trimmedPath = path;
    if (trimmedPath === undefined) trimmedPath = '';
    if (trimmedPath.endsWith('/')) trimmedPath = trimmedPath.substring(0, trimmedPath.length - 1);
    if (trimmedPath.startsWith('/')) trimmedPath = trimmedPath.substring(1);
    const url = `/file/${trimmedPath}`;
    global.history.pushState({ id: trimmedPath }, trimmedPath, url);
  }
}
