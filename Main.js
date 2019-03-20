"use strict";

var log;
var gsuite;
var scoutnet;
var gdrive;

function init() {
  
  // Log should be first object to initialize  since it is used in other objects!
  if (log == undefined) {
    log = new Log(config.log);
    log.debug('log initialized!')
  }
  
  //Other objects needed globally for all launchers
  if (gsuite == undefined) {
    gsuite = new GSuiteHelper(config.gsuite);
    log.debug('gsuite initialized!')
  }

  if (scoutnet == undefined) {
    scoutnet = new ScoutnetHelper(config.scoutnet);
    log.debug('scoutnet initialized!')
  }

  if (gdrive == undefined) {
    gdrive = new GDriveHelper(config.gdrive);
    log.debug('gdrive initialized!')
  }

}


