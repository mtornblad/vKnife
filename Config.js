"use strict";

var config = {
  log:{
    logLevel:{
      warn: true, 
      error: true, 
      info:true, 
      debug:true
    }
  },
  scoutnet:{
    scoutnetID:'943', 
    memberListKey:'4a4b382d3a4aa6bd980448554eb3035437b08820', 
    groupListKey:'daf2ea90e77fbac49409c6f971f1209b5ae470a0', 
    userCreationRules: [ 
      {              
        type:'in_unit_role',
        condition:'*',
        result: '<?= user.unit ?>',
      },
      {              
        type:'in_group_role',
        condition:'*',
        result: '<?= user.unit ?>',
      },
/*      {
        type:'in_custom_list',
        condition:'4475',
        merge: true
        result: '<?= user.unit ?>',
      },
      {
        type:'special', // Not implemeted in code yet
        condition:'inactive',// valid values = missing and/or inactive
        result: '<?= user.unit ?>',
      },
      {              
        type:'in_unit_role',
        condition:'*',
        result: '<?= user.unit ?>',
      },
      {              
        type:'in_group_role',
        condition:'Planeringsansvarig, IT-ansvarig, Arrangemangsansvarig, Medlemsregistrerare, Webbansvarig',
        result: '<?= user.unit ?>',
      },
*/
    ]
  },
  gsuite:{
    domain:'rottne.scout.se',
    customerId:'my_customer', 
    cacheMode:true,
    orgUnitPathBase:'/Scoutnet', 
    orgUnitPathSuspended:'Suspended'  //relative to orgUntiBAse
  },
  gdrive:{
    accessRightsRules: { 
      '0AC_ap2GwuEwNUk9PVA':[ 
        {
          type:'in_group_role',
          condition:'B\u00e5tansvarig',
          result: '<?= user.unit ?>',
        },
        {              
          type:'in_group_role',
          condition:'*',
          result: '<?= user.unit ?>',
        },
      ],
    },
  },
}

