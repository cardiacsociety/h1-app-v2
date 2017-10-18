#!/bin/bash

DIST=$GOPATH/src/github.com/cardiacsociety/h1-app-dist

echo "Building..."
npm run build

echo "Copy ./dist/* to" $DIST
cp -fr ./dist/* $DIST/dist/

echo "Running git commands with -C" $DIST
git -C $DIST add .
git -C $DIST commit -m 'Update dist'
git -C $DIST push heroku master
