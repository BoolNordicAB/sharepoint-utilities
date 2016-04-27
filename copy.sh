#!/usr/bin/env sh

DIR=`pwd`

cd ../sharepoint-utilities
npm run build

cd $DIR

cp -R ../sharepoint-utilities/dist .
cp -R ../sharepoint-utilities/doc .
cp -R ../sharepoint-utilities/coverage .
