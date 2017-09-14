# JSDocGen - an automated JSDoc generator

[![Build Status](https://travis-ci.org/mlessio/js-docgen.svg?branch=master)](https://travis-ci.org/mlessio/js-docgen)
[![npm version](https://badge.fury.io/js/js-docgen.svg)](https://badge.fury.io/js/js-docgen)
[![Open Source Love](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://github.com/ellerbrock/open-source-badge/)
[![Open Source Love](https://badges.frapsoft.com/os/v2/open-source.svg?v=102)](https://github.com/ellerbrock/open-source-badge/)
[![Code Climate](https://codeclimate.com/github/mlessio/js-docgen/badges/gpa.svg)](https://codeclimate.com/github/mlessio/js-docgen)  


An automated library based on AST that parses and traverses a Javascript source file and adds JSDoc compliant comments.

## How to install?
Just use NPM to install the package. Simply type:

```javascript
npm install --save jsdocgen
```

## What does it recognizes?
* Function names
* Function parameters
* Function parameters types(with Ternjs inference engine)
* Return values
* Return values types(with Ternjs inference engine)
* Throws statements
* Throws types(with Ternjs inference engine)
* Try/Catch blocks
* Function.prototype assignments

## How does it works?

## How to test

No unit test are provided at this stage.  
You can run:
```javascript
npm test
```

and it will run the JSDocGen engine on the test/main.js file.  
The result will be stored in test/main.annotated.js

## Contributions are welcome!

Want to join the project?  
You can open an issue, or fork the project and submit a pull request!  
You have some ideas on how to improve the project? Get in touch!

## Credits
TernJs

## License

The MIT License  

Copyright (c) 2017 Martino Lessio  

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:  

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.  

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
