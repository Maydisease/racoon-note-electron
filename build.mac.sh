rm -rf build
rm -rf dist
tsc
sleep 1s
cp -rf node_modules ./dist/node_modules
sleep 1s
gulp copyHTML
sleep 1s
gulp writePkg
sleep 1s
npm run package:mac
sleep 1s
# cp -rf node_modules ./build/note-darwin-x64/note.app/Contents/Resources/app/node_modules