#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const target = process.argv[2]

if (!target) {
  console.log('Please provide a target')
  process.exit(1)
}

const copyContent = function (sourceDir, targetDir) {
  fs.readdir(sourceDir, function (err, names) {
    if (err) {
      throw err
    }

    names.forEach(function (name) {
      fs.createReadStream(path.join(path.join(sourceDir, name)))
        .pipe(fs.createWriteStream(path.join(targetDir, name)))
    })
  })
}

// Copy fonts from here
copyContent(path.join(__dirname, 'assets', 'fonts'), path.join(target, 'fonts'))

// Copy images from here
copyContent(path.join(__dirname, 'assets', 'images'), path.join(target, 'images'))

// Copy fonts from bootstrap
copyContent(path.join('node_modules', 'bootstrap', 'fonts'), path.join(target, 'fonts'))
