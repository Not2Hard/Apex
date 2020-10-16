#!/bin/bash

pushd website
npm run build

pushd build
aws s3 cp . s3://apexquest.cloud --recursive --acl public-read