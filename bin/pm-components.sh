#!/bin/bash

npm run clean && webpack --config webpack.config.js $@;
