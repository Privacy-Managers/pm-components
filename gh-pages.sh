#!/bin/bash

# set variables
commit_msg="build and push to gh-pages"
dirs=("components/dist" "components/img" "components/tests/smoke")
pid=$$
current_branch=`git rev-parse --abbrev-ref HEAD`
# build project and push to gh-pages branch
npm run build
git checkout -b ${pid}
git add ${dirs[*]} --force
git commit -m "${commit_msg}"
subtree=`git subtree split --prefix components ${pid}`
git push --force origin ${subtree}:refs/heads/gh-pages
git checkout ${current_branch}
git branch -D ${pid}