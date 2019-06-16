'use strict';
import axios from 'axios';

export default class {
  constructor(axiosInstance) {
    this.axios = axiosInstance || axios;
  }

  async getHealth() {
    const response = await this.axios.get('/api/health');
    return response.data;
  }
}
