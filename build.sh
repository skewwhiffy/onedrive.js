#!/bin/sh
echo Getting dependencies
npm install
cd frontend
npm install
cd ..

echo Building frontend
cd frontend
npm run build
cd ..

echo Copying to server
cp -r frontend/dist resources
