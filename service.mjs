/**
 * The app's service declaration. The server entry (`server.mjs`) imports it at
 * run time for the reserved port, so the build ships a copy of this file; the
 * deploy also bundles it to boot the service process.
 */
import { compute } from '@prisma/composer-prisma-cloud';
import node from '@prisma/composer/node';

export default compute({
  name: 'web',
  deps: {},
  build: node({
    module: import.meta.url,
    dir: './dist',
    entry: './server.mjs',
    // The build output keeps its package imports; deploy traces and stages
    // the installed packages the entry imports.
    dependencies: 'external',
  }),
});
