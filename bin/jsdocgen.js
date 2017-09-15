/**
 * @Author: Martino Lessio <martinolessio>
 * @Date:   2017-07-27T23:56:43+02:00
 * @Email:  martino.lessio@gmail.com
 * @Project: GuidApp
 * @Last modified by:   martinolessio
 * @Last modified time: 2017-09-15T21:38:28+02:00
 * @Copyright: Martino Lessio
 */



#!/usr/bin/env node
const fs = require("fs");
const argv = require('yargs').argv;
const path = require("path");
const JSDocGen = require('../index');

var docGenerator = new JSDocGen();

var fileName = '';

if(argv.f)
  fileName = argv.f;
else
  fileName = '/dev/stdin';

const fileData = fs.readFileSync(fileName, "utf-8");

docGenerator.annotate(fileName, fileData);
