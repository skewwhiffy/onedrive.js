'use strict';
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:38080' // TODO: 38080 should be picked up with config
});

export default instance;
