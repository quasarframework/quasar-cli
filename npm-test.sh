#!/bin/bash

if [ -n CIRCLECI ]
then
  istanbul cover ./node_modules/mocha/bin/_mocha -- -r test/setup.js test/**/*.spec.js
else
  istanbul cover ./node_modules/mocha/bin/_mocha -- -r test/setup.js test/**/*.spec.js  && cat ./coverage/coverage.json | ./node_modules/codecov.io/bin/codecov.io.js
fi
