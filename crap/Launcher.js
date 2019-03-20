"use strict";

function ImporteraAnvandareFranScoutnet() {
  Logger.log('--- Execution initiated from ImporteraAnvandareFranScoutnet() ---');  
  init();
  //gsuite.syncUsers(scoutnet.users);
  gdrive.syncRights();
}


function Test(){
  var optionalArgs = {
    customer: 'my_customer',
    maxResults: 100,
    //query: "orgUnitPath='" + conf.orgUnitPathBase + "'"
  };
  
  var response = AdminDirectory.Users.list(optionalArgs);
  Logger.log(JSON.stringify(response,null,4));
}


  