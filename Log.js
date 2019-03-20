"use strict";

var Log = function(conf) {
  this.errorLogged = true;
  this.counter = {error:0, warn:0, info:0, debug:0};
    
  this.error = function() {
    if (conf.logLevel.error) {
      this.counter.error++;
      var args = Array.prototype.slice.call(arguments);
      args[0] = 'ERROR:\t' + args[0];
      Logger.log.apply(Logger, args);
      
    }
  }

  this.warn = function() {
    if (conf.logLevel.warn) {
      this.counter.warn++;
      var args = Array.prototype.slice.call(arguments);
      args[0] = 'WARN:\t' + args[0];
      Logger.log.apply(Logger, args);
    }
  }

  this.info = function() {
    this.counter.info++;
    if (conf.logLevel.info) {
      var args = Array.prototype.slice.call(arguments);
      args[0] = 'INFO:\t' + args[0];
      Logger.log.apply(Logger, args);
    }
  }

  this.debug = function() {
    this.counter.debug++;
    if (conf.logLevel.debug) {
      var args = Array.prototype.slice.call(arguments);
      args[0] = 'DEBUG:\t' + args[0];
      Logger.log.apply(Logger, args);
    }
  }
}