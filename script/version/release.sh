set -ex

echo $MANUAL_REVIEWER
echo $MANUAL_REVIEW_SUGGEST
echo $MANUAL_REVIEW_RESULT

packageName=$1
echo $packageName

if [[ $MANUAL_REVIEW_RESULT != 'PROCESS' ]]; then
  echo "[Error] Not Review"
  exit 1
fi;

pnpm install

git remote remove origin
git remote add origin git@git@xxx.com:xxx/pmd-h5/plugin-light.git

# npm run build
# npx standard-version --release-as patch -a --no-verify
pnpm --filter="$packageName" install
pnpm --filter="./packages/plugin-light-shared" build
pnpm --filter="./packages/plugin-light-shared-vue2" build
pnpm --filter="./packages/plugin-light-*" build
pnpm --filter="./packages/webpack-loader-*" build
pnpm --filter="./packages/webpack-plugin-*" build
pnpm --filter="./packages/vite-plugin-*" build
pnpm --filter="./packages/postcss-*" build
pnpm --filter="./packages/uni-read-pages-vite" build
pnpm --filter="./packages/project-config-*" build

npm run test  

pnpm --filter="$packageName" release patch needVersionTip

# git push --follow-tags origin master 
# npm publish 
# npm run version:tip

