"use strict";

var ScoutnetHelper = function(conf) {
  
  // 
  // Initialize all local properties by running following functions, must be loaded in correct order!
  // TODO: Make function for making load optional?
  //
  this.lists = loadLists();
  this.listCount = Object.keys(this.lists).length;

  this.members = loadMembers();
  this.memberCount = Object.keys(this.members).length;

  this.users = parseUsers(this.members, this.lists);
  this.userCount = Object.keys(this.users).length;
   
  log.info('(ScoutnetHelper) object created with count of %s members, %s users and %s lists', this.memberCount, this.userCount, this.listCount);
  
  
  //
  // Internal function to return all users and load info from Scoutnet if not already done!
  //
  function loadMembers() {
    log.debug('(loadMembers) called');
    var response = UrlFetchApp.fetch('https://www.scoutnet.se/api/group/memberlist?id=' + conf.scoutnetID + '&key=' + conf.memberListKey);
    var members = JSON.parse(response.getContentText()).data;
    return members;
  }
  

  //
  // Internal function to return all lists and load info from Scoutnet  (Users = members that should have gsuite account)
  //
  function loadLists() {
    var response = UrlFetchApp.fetch('https://www.scoutnet.se/api/group/customlists?id=' + conf.scoutnetID + '&key=' + conf.groupListKey);
    var lists = JSON.parse(response.getContentText());
    // Add an extra property 'members' as an array with all id of users 
    for (listId in lists) {
      var list = UrlFetchApp.fetch('https://www.scoutnet.se/api/group/customlists?id=' + conf.scoutnetID + '&key=' + conf.groupListKey + '&list_id=' + listId);
      lists[listId].members = Object.keys(JSON.parse(list.getContentText()).data);
    }
    return lists;
  }
  

  //
  // Internal functio
  //
  function parseUsers(members, lists) {
    var users = {};
    for (memberId in members){
      var member = members[memberId];
      member.id = memberId;
      var user = {};
      for (property in member) {
        // log.debug('(parseUsers) Property: %s = %s', property, member[property].value)
        user[property] = member[property].value;
      }
      
      // User HtmlService template function to replace tokens we mght have used in config file to specfy the paths (do not really have anything with HTML to do)
      var orgUnitPathTemplate = HtmlService.createTemplate(ruleHandler(conf.userCreationRules, member, lists).join('/'));
      orgUnitPathTemplate.user = user;
      user['orgUnitPath'] = orgUnitPathTemplate.evaluate().getContent();
      if (user['orgUnitPath']){
        users[memberId]=user;
      }
    }
    return users; 
  }

    
  //
  //  function to match rules
  //
  //
 function ruleHandler(rules, member, lists) {
    log.debug('(buildOrgUnitPath) processingr %s rules for %s', rules.length, member.email);
    var results = [];
    for (var i = 0; i < rules.length; i++) {
      var rule = rules[i];
      var match = false;
      log.debug('(ruleHandler) processing rule of type "%s":\n%s', rule.type, JSON.stringify(rule,null,4));      
      switch (rule.type) {
        case 'in_group_role':
          log.debug('(ruleHandler) checking if user has group_roles "%s".', rule.condition);
          match = (hasRole(member.group_role, rule.condition))
          break;
        case 'in_unit_role':
          log.debug('(ruleHandler) checking if user has unit_roles "%s".', rule.condition);
          match = (hasRole(member.unit_role, rule.condition))
          break;
        case 'in_custom_list':
          log.debug('(ruleHandler) checking if user is in list "%s".', rule.condition);
          match = (inCustomList(lists, rule.condition, member.id));
          break;
        default:
          log.warn('(ruleHandler) invalid rule type %s.', rule.type);
      }
      
      if (match) {
        results.push(rule.result);            
        //If we have not specified that we will continue on matched rule we break and end for-loop
        if (!rule.merge){
          break;
        }
      } 
    } 
    return results;
  }
  
  
  //
  // Internal function to check if member is in role
  //
  function hasRole(memberRoles, rolesToMatch) {
    // If no roles this will allways be false
    if (!memberRoles || !memberRoles.value){
      log.debug('(hasRole) missing role object value.');
      return false;
    }
    
    //If * used as roles match any role
    if (rolesToMatch == '*') {
      log.debug('(hasRole) matched wildcard.');
      return true;
    }
    var memberRolesArray = memberRoles.value.splitTrim(','); //.map(function(item) {return item.trim();});
    var rolesToMatchArray = rolesToMatch.splitTrim(','); //.map(function(item) {return item.trim();});

    for (var i = 0; i < memberRolesArray.length; i++) {
      if (rolesToMatchArray.indexOf(memberRolesArray[i]) >= 0 ){
        log.debug('(hasRole) matched "%s".', memberRolesArray[i]);
        return true;
      }
    }    
    return false;
  }
  
  
  //
  // Internal function to check if user is member of custom list.
  //
  function inCustomList(lists, listsToMatch, memberId) {
   
    var listsToMatchArray = listsToMatch.splitTrim(','); //.map(function(item) {return item.trim();});
   
    for (var i = 0; i < listsToMatchArray.length; i++) {
      var list=lists[listsToMatchArray[i]];
      log.debug('(inCustomList) List "%s" has members:%s' ,list.id, list.members);
      if (list.members.indexOf(memberId) >= 0) {
        log.debug('(inCustomList) matched "%s".', list.title);
        return true;
      }
    }
    return false;
  }
  
  
  
  this.ruleHandler = function(rules, member, lists) {
    return ruleHandler(rules, member, lists);
  }
  
};