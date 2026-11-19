import { compute } from '@prisma/composer-prisma-cloud';
import nodeBuild from '@prisma/composer/node';

// The app's service: a Node static file server. `dir` and `entry` resolve
// against this file's directory; `dependencies: 'external'` has the deploy
// trace dist/server.mjs and stage the packages it imports (@prisma/*).
export default compute({
  name: 'web',
  deps: {},
  build: nodeBuild({
    module: import.meta.url,
    dir: './dist',
    entry: './server.mjs',
    dependencies: 'external',
  }),
});
