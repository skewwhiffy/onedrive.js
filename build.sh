#!/bin/sh
echo Building frontend
cd frontend
npm run build
cd ..

echo Copying to server
cp -r frontend/dist resources
