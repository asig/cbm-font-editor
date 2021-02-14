# CBM Font Editor

CBM Font Editor is a little tool that allows you modify fonts for a wide range
of Commodore home computers, and to store your creations as binary files (in 
plain and 'prg' format), as BASIC programs or as source code for the cbmasm
cross-assembler.

To get you started, you need a 2k Commodore font in binary format, which you
can get for example at [zimmers.net](http://www.zimmers.net/anonftp/pub/cbm/firmware/characters/).

This is an early version with basic functionality. Most notably, multi-color
fonts are not supported yet.

And last but not least, this app completely runs in your browser. All your
data is kept on your own machine, nothing is sent over the internets!

## Build and run the app

### Prerequisites
This project uses `npm` to build. If you don't have `npm` installed yet, head
over to https://www.npmjs.com/get-npm first.
 
### Install required deoendencies
Install the dependencies with `npm install`

### Build the app
Build the app with `npm run build`

### Run the app locally
To start the app, just execute `npm start`, and point your browser to [http://locahost:3000/](http://localhost:3000/) 

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## License
Copyright (c) 2021 Andreas Signer.  
Licensed under [GPLv3](https://www.gnu.org/licenses/gpl-3.0).
