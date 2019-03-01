rm -rf build
rm -rf dist
tsc
sleep 1s
gulp writePkg
sleep 1s
npm run package:mac
sleep 3s
cp -rf node_modules ./build/note-darwin-x64/note.app/Contents/Resources/app/node_modules