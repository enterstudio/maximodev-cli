#! /usr/bin/env node

var log = require('./lib/logger');
var env = require('./lib/env');
var cli = require('./lib/cli');
var psi = require('./lib/psi');
const fs = require('fs');
var dist = require('./lib/dist');

var schema = {
  _version: '0.0.1',
  _description: 'Create a ZIP package structure for an new installation ',
  properties: {
     package_name: {
      description: "ZIP Package Name",
      pattern: /^[a-zA-Z0-9]+$/,
      message: 'Must only contain letters and numbers (i.e hotfix7960)',
      required: true,
      _cli: 'package_name',
      default: 'default'
    },
    // uuid:{
    //   _prompt: false,
    //   _cli: 'uuid',
    //   require: false,
    //   default: psi.getUUID()
    // }
    //TODO: Define the prompt.

  }//Ending properties.
};

//var uuid  = ;

//schema.properties['uuid'] = {_prop: 'uuid',required: true, default: uuid};



cli.process(schema, process.argv, create_package);

function create_package(result) {
  
  var args = Object.assign({}, env.props, result);
  /**
   * For future versions the installation will be able to be done by the IBM Installation Manager or solutionintaller. 
   */
  var build_dir = 'dist/.';
  if(psi.ensureDir(build_dir)){

    //Install templates 
    psi.installTemplateZIP("zip", env.addonDir(), args);

    //Copy folders recursively 
    psi.copyFolderRecursiveSync(build_dir, 'zip/'+result.package_name+'Package/');
    
    //Zip the content from a package int a file to be installed.
    psi.zipFolderContent('./zip/'+result.package_name+'Package/',result.package_name).then(function(base){
      console.log("Your package were created into the zip folder of this project. Unzip the package into MAXIMO's installation folder and then run the updatedb command to install it");
    });
  }else{
    console.log('Package is note ready, please build the package before zip it (i.e. run maximodev build)');
  }//End ensure dir
   
};

