#!/bin/bash

# set variables
commit_msg="build and push to gh-pages"
dir="components/dist"
pid=$$
current_branch=`git rev-parse --abbrev-ref HEAD`
# build project and push to gh-pages branch
npm run build
git checkout -b ${pid}
git add ${dir} --force
git commit -m "${commit_msg}"
subtree=`git subtree split --prefix components ${pid}`
git push --force origin ${subtree}:refs/heads/gh-pages
git checkout ${current_branch}
git branch -D ${pid}