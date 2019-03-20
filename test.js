
/**
 * Lists the names and IDs of up to 10 files.
 */
function listFiles() {
  var args = {supportsTeamDrives: true, useDomainAdminAccess:true}
  var permissions = Drive.Permissions.list('1br4Lnu-qnSiG4g70VWcG8t-f25zoCOvKg1RmNNwAasA', args).items;
    for (var i = 0; i < permissions.length; i++) {
    Logger.log('%s (%s)', permissions[i].emailAddress, permissions[i].role);
  };
}


function Start() {
  Logger.log(listFiles());
}