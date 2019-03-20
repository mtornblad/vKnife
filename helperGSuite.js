"use strict";

var GSuiteHelper = function(conf) {
  
  var orgUnitPathCache = [];
  
  function cacheExist(orgUnitPath) {
    if (conf.cacheMode && (orgUnitPathCache.indexOf(orgUnitPath) != -1)){
      log.debug('(folderExists) orgUnitPath "%s" found in cache.', orgUnitPath);
      return true;
    } else {
      log.debug('(folderExists) orgUnitPath "%s" not found in cache.', orgUnitPath);
      return false;
    }
  }
  
  function cacheAdd(orgUnitPath) {
    if (conf.cacheMode && (orgUnitPathCache.indexOf(orgUnitPath) != -1)){
      log.debug('(folderExists) orgUnitPath "%s" added to cache.', orgUnitPath);
    }
  }

  
  ///
  /// Helper to handle OU verification, creation etc in a safe way.
  ///
  var orgUnitHelper = function(orgUnitPath){
    // Trim orgUntiPath from leadeíng and trailing slash..
    // ^\/+   beginning of the string, slash , one or more times
    // |      or
    // \/+$   slash, one or more times, end of the string
    this.orgUnitPathX = orgUnitPath.trimSlash();   //orgUnitPath without leading slash
    this.orgUnitPath = '/' + this.orgUnitPathX;                  //orgUnitPath with leading slash
    
    var i = this.orgUnitPath.lastIndexOf("/");
    this.parentPath = this.orgUnitPath.substring(0, i);
    this.name = this.orgUnitPath.substring(i+1, this.orgUnitPath.length);
    log.debug('(orgUnitHelper) object initialized %s', JSON.stringify(this,null,2));
    
    
    //
    // Check if a folder exists, either in cache or directory depending on mode
    //
    function folderExists(orgUnitPath) {
      if (cacheExist(orgUnitPath)){
        return true;
      }
      try {
        var o = AdminDirectory.Orgunits.get(conf.customerId, orgUnitPath.substring(1));   //orgUnitPath contains leading slash that we remove!
        log.debug('(folderExists) orgUnitPath "%s" found in directory.', orgUnitPath);
        cacheAdd(orgUnitPath);        
        return true;
      }
      catch(err) {
        log.warn('(folderExists) get orgUnit "%s" failed, [%s]', orgUnitPath, err.message);
        return false;
      }   
    }
    
    
    //
    // Return true if this folder exists.
    //
    this.exists = function() {
      return folderExists(this.orgUnitPath);
    }
    
    //
    // Return true if this folders parent folder exists.
    //
    this.parentExists = function() {
      return folderExists(this.parentPath);
    }
    

    //
    // Create this folder, recurse down to where first existing folder in path is found
    //
    this.createRecursive = function() {
      // Return true if already exists
      if (this.exists()) {
        log.debug('(createRecursive) orgUnit "%s" already exists.', this.orgUnitPath);
        return true;
      }
      
      //Check if parent exists and create it otherwise
      if (!this.parentExists()) {
        var p = new orgUnitHelper(this.parentPath).createRecursive();
      }
      
      try {
        log.debug('(createRecursive) Creating orgUnit "%s" in "%s"', this.name, this.parentPath);
        var o = AdminDirectory.Orgunits.insert({parentOrgUnitPath: this.parentPath, name:this.name}, conf.customerId);
        log.debug('(createRecursive) orgUnit "%s" created with Id.', this.orgUnitPath, o.orgUnitId);
        cacheAdd(this.orgUnitPath);        
        return true;
      }
      catch(err) {
        log.error('(createRecursive) Create orgUnit "%s/%s" insert failed, [%s]', this.parentPath, this.name, err.message);
        return false;
      }
    }
  }

  
  function createUser(userProperties){
    log.debug('(createUser) called!');
      log.debug(JSON.stringify(userProperties,null,4));

    var gsuiteUser = HtmlService.createTemplateFromFile('tmplInsertUser');
    gsuiteUser.conf = conf;
    gsuiteUser.user = userProperties;
    var gsuiteUserText = gsuiteUser.evaluate().getContent();
    log.debug(gsuiteUserText);
    var gsuiteUserObject = JSON.parse(gsuiteUserText);
    ou = new orgUnitHelper(gsuiteUserObject.orgUnitPath);
    ou.createRecursive();      
    //TODO: Try/Catch
    var createdUser = AdminDirectory.Users.insert(gsuiteUserObject); 
    log.debug(JSON.stringify(createdUser,null,4));
                
    return updateUser(createdUser, userProperties);
  }

  
  function suspendUser(existingGsuiteUser, userProperties){
    log.debug('(suspendUser) called!');

    //Check what properties we should set if it was new user!
    var gsuiteUser = HtmlService.createTemplateFromFile('tmplSuspendUser');
    gsuiteUser.conf = conf;
    gsuiteUser.user = userProperties;
    var gsuiteUserText = gsuiteUser.evaluate().getContent();
    log.debug(gsuiteUserText);
    var gsuiteUserObject = JSON.parse(gsuiteUserText);
    
    // Do not update primaryEmail even if name has changed
    delete gsuiteUserObject.primaryEmail;
    
    ou = new orgUnitHelper(gsuiteUserObject.orgUnitPath);
    ou.createRecursive();      
    //TODO: Try/Catch
    var updatedUser = AdminDirectory.Users.update(gsuiteUserObject, existingGsuiteUser.id);
    log.debug(JSON.stringify(updatedUser,null,4));
    
    return updatedUser;
  }
  
  function updateUser(existingGsuiteUser, userProperties){
    log.debug('(updateUser) called!');
    log.debug(JSON.stringify(userProperties,null,4));

    //Check what properties we should set if it was new user!
    var gsuiteUser = HtmlService.createTemplateFromFile('tmplUpdateUser');
    gsuiteUser.conf = conf;
    gsuiteUser.user = userProperties;
    var gsuiteUserText = gsuiteUser.evaluate().getContent();
    log.debug(gsuiteUserText);
    var gsuiteUserObject = JSON.parse(gsuiteUserText);
    
    ou = new orgUnitHelper(gsuiteUserObject.orgUnitPath);
    ou.createRecursive();      
    //TODO: Try/Catch
    gsuiteUserObject.recoveryPhone = ''
    var updatedUser = AdminDirectory.Users.update(gsuiteUserObject, existingGsuiteUser.id);
    log.debug(JSON.stringify(updatedUser,null,4));
    
    return updatedUser;
  }
  
  
  
  //
  // Todo: list users paged, safer way to read externalid
  //
  this.syncUsers = function(users) {

    //Create copy of user object since we will manipulate it
    users = JSON.parse(JSON.stringify(users));
   
    var optionalArgs = {
      customer: 'my_customer',
      maxResults: 100,
      query: "orgUnitPath='" + conf.orgUnitPathBase + "'"

    };
    
    var response = AdminDirectory.Users.list(optionalArgs);
    var gsuiteUsers = response.users;
    if (gsuiteUsers && gsuiteUsers.length > 0) {
      
      for (i = 0; i < gsuiteUsers.length; i++) {
        
        var gsuiteUser = gsuiteUsers[i];
        
        if (typeof gsuiteUser.externalIds != 'object') {
          log.debug('User: %s is missing scoutnetId, suspend it. Object type: %s', gsuiteUser.primaryEmail, typeof gsuiteUser.externalIds);
          suspendUser(gsuiteUser, {});
          continue;
        }
        
        var memberId = gsuiteUser.externalIds[0].value;
        if (users[memberId]) {
          log.debug('User: %s should have account, update it', gsuiteUser.primaryEmail);
          updateUser(gsuiteUser, users[memberId]);
          delete users[memberId];
          continue;          
        } else {
          log.debug('User: %s is missing in lists that should have accounts, suspend it', gsuiteUser.primaryEmail);
          suspendUser(gsuiteUser, users[memberId]);
          delete users[memberId];
          continue;
        }           
      }
    } else {
      log.debug('No gsuite-users found.');
    }
    memberIds = Object.keys(users); 
    for (var i = 0; i < memberIds.length; i++){
      log.debug('Call create user for %s', memberIds[i]);
      createUser(users[memberIds[i]]);
    }
  }
}
