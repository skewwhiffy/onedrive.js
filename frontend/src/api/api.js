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

  async getUsers() {
    const response = await this.axios.get('/api/user');
    return response.data;
  }
}
