rm -rf build
rm -rf dist
tsc
sleep 1s
cp -rf node_modules ./dist/node_modules
sleep 1s
gulp copyHtml
sleep 1s
gulp writePkg
sleep 1s
npm run package:mac
sleep 1s
python ./quickpkg ./build/racoon-darwin-x64/racoon.app --output ./build/racoon-darwin-x64/racoon.pkg
