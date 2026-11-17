import { module } from '@prisma/composer';
import service from './service.mjs';

export default module('chatgpt-homepage', ({ provision }) => {
  provision(service);
});
