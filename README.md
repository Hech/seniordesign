# UCRPals

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.11.1.


## Build & development
Follow steps to set up dependencies:
https://github.com/yeoman/generator-angular

Need to have npm installed 
`1. npm install` 
`2. bower install`


Run `grunt` for building and `grunt serve` for preview.

If you have this problem: 
Stack trace:
  Error: EACCES,
  
Run: sudo bower install --allow-root

## Build issues encountered
1. compass binaries not found  -- try gem uninstall compass then gem install
compass
2. if it ask for sudo then, run `sudo chown -R $(whoami) ~/.npm` , `sudo chown -R $(whoami) /usr/local/lib/node_modules`

## Testing

Running `grunt test` will run the unit test

## Run
Running `grunt serve` will serve the application, autoreload on. Runs on http://localhost:9000/


