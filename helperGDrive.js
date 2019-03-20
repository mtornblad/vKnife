var GDriveHelper = function(conf) {
  
  var tdargs ={'supportsTeamDrives':true, 'useDomainAdminAccess':true}
  
  //Error handling
  function getTeamDrivePerms(teamDriveId){
    //Drive.Teamdrives.get(teamDriveId).name;
    log.debug('(getTeamDrivePerms) Getting permissions for %s!', Drive.Teamdrives.get(teamDriveId).name); 
    return Drive.Permissions.list(teamDriveId, tdargs).items;
  }
  
  this.syncRights = function() {
    for (var teamDriveId in conf.accessRightsRules) {
      permissions = getTeamDrivePerms(teamDriveId);
      log.debug('antal rättigheter: %s' ,permissions.length);
      for (i = 0; i < permissions.length; i++) {
        var permission = permissions[i];
        log.debug('(syncRights) User: %s (%s) has role "%s".',  permission.name, permission.emailAddress, permission.role);
      }
      //newperms = [];
      //newperms.push(Drive.Permissions.
      
    }
  }
  
}
