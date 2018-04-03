#!/bin/sh

cd ./client
npm install
npm i @ionic/app-scripts
ionic build
cd ..