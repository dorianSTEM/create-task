#!/bin/sh

echo "STARTED RUN.SH"
cd ./client

echo "ENTERED CLIENT"
npm install
npm i @ionic/app-scripts
ionic build
cd ..
