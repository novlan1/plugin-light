set -ex

echo $MANUAL_REVIEWER
echo $MANUAL_REVIEW_SUGGEST
echo $MANUAL_REVIEW_RESULT

if [[ $MANUAL_REVIEW_RESULT != 'PROCESS' ]]; then
  echo "[Error] Not Review"
  exit 1
fi;


pnpm install

git remote remove origin
git remote add origin git@git.woa.com:pmd-mobile/support/uni-plugin-light.git

npm run test  
npm run build
npx standard-version --release-as patch -a --no-verify
git push --follow-tags origin master 
npm publish 
npm run version:tip
