#!/bin/sh
echo Building frontend
cd frontend
npm install
npm run build
cd ..

echo Copying to server
cp -r frontend/dist resources
