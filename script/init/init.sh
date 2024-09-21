pnpm install
pnpm --filter="./packages/plugin-light-shared" build
pnpm --filter="./packages/plugin-light-shared-vue2" build
pnpm --filter="./packages/plugin-light-*" build
pnpm --filter="./packages/webpack-loader-*" build
pnpm --filter="./packages/webpack-plugin-*" build
pnpm --filter="./packages/vite-plugin-*" build
pnpm --filter="./packages/postcss-*" build
pnpm --filter="./packages/uni-read-pages-vite" build
pnpm --filter="./packages/project-config-*" build
