/**
 * The Composer app: one web service that serves the static homepage.
 * Deploys to the "chatgpt-homepage" project on Prisma Cloud.
 */
import { module } from '@prisma/composer';
import web from './service.mjs';

export default module('chatgpt-homepage', ({ provision }) => {
  provision(web);
});
