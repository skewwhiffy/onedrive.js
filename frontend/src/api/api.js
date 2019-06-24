'use strict';
import axios from './axios.instance';

export default class {
  constructor(axiosInstance) {
    this.axios = axiosInstance || axios;
  }

  async getHealth() {
    const response = await this.axios.get('/api/health');
    return response.data;
  }

  async getSubfolders(userId, path) {
    if (path === undefined) return this.getSubfolders(userId, '');
    if (path.startsWith('/')) return this.getSubfolders(userId, path.substring(1));
    if (path.endsWith('/')) return this.getSubfolders(userId, path.substring(0, path.length - 1));
    const response = await this.axios.get(`/api/user/${userId}/folder/${path}`);
    return response.data;
  }

  async getUsers() {
    const response = await this.axios.get('/api/user');
    return response.data;
  }

  async getLoginUrl() {
    const response = await this.axios.put('/api/user');
    const { query, redirect } = response.data;
    const queryString = Object.keys(query)
      .map(key => ({ key, value: query[key] }))
      .map(({ key, value }) => ({ key: encodeURIComponent(key), value: encodeURIComponent(value) }))
      .map(({ key, value }) => `${key}=${value}`)
      .join('&');
    return `${redirect}?${queryString}`;
  }
}
