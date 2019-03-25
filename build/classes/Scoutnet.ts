import { Log, LogLevel } from "./Log";
import { Config } from "./Config";
import { Helpers } from "../code/Helpers";

export class Scoutnet {

    private log: Log = new Log('Scoutnet');
    private config: Config = new Config();
    private members: any = null;
    private lists: any = null;
    private filterCache: any = {};
    



    constructor() {
        this.log.debug('Constructed!');
    }


    //
    // Function to return all members and load info from Scoutnet if not already done!
    //
    getMembers(): any {
        if (this.members === null) {
            this.members = {};

            //TODO: errorhandling
            var response = UrlFetchApp.fetch('https://www.scoutnet.se/api/group/memberlist?id=' + this.config.get('scoutnet.id') + '&key=' + this.config.get('scoutnet.memberListKey'));
            var membersRaw: JSON = JSON.parse(response.getContentText()).data;
            this.log.debug('Memberlist loaded from scoutnet! \n%s', JSON.stringify(membersRaw));
            for (var memberId in membersRaw) {
                var memberRaw = membersRaw[memberId];
                var member = {};
                for (var property in memberRaw) {
                    switch (property) {
                        case 'contact_mobile_phone':
                            //TODO! Formatters
                            member[property] = memberRaw[property].value.phoneNumber();
                            break;

                        case 'email':
                            //TODO! Formatters
                            member[property] = memberRaw[property].value.trim().toLowerCase();
                            break;

                        case 'unit_role':
                        case 'group_role':
                            member[property] = memberRaw[property].value.splitAndTrim(',');
                            break;

                        default:
                            member[property] = memberRaw[property].value.trim();
                    }
                }
                this.members[memberId] = member;
            }

        }
        return this.members;
    }

    //
    // Function to return all lists with members and load info from Scoutnet if not already done!
    //
    getLists(): any {
        if (this.lists === null) {

            var response = UrlFetchApp.fetch('https://www.scoutnet.se/api/group/customlists?id=' + this.config.get('scoutnet.id') + '&key=' + this.config.get('scoutnet.groupListKey'));
            this.lists = JSON.parse(response.getContentText());
            var listId: string;
            // Add an extra property 'members' as an array with all id of users 
            for (listId in this.lists) {
                var list = UrlFetchApp.fetch('https://www.scoutnet.se/api/group/customlists?id=' + this.config.get('scoutnet.id') + '&key=' + this.config.get('scoutnet.groupListKey') + '&list_id=' + listId);
                this.lists[listId].members = Object.keys(JSON.parse(list.getContentText()).data);
            }
            this.log.debug2('this.lists\n%s', this.lists);

        }

        return this.lists;
    }


    //
    // Function to get memberid:s from members matching named filter
    //
    getFilteredMembersId(filterName: string): any {
        var filters: any = this.config.get('scoutnet.filters')[filterName];

        if (filters === undefined) {
            this.log.error('Invalid filter name specified, returning empty array!')
            return [];
        }
        this.log.debug('Getting filtered list, name: %s, rules %s.', filterName, filters)

        if (this.filterCache[filterName] === undefined) {
            this.filterCache[filterName] = [];

            var memberIds: string[] = this.filterCache[filterName];
            var memberId: string;
            var members: any = this.getMembers();

            for (memberId in members) {
                for (var i = 0; i < filters.length; i++) {
                    var filter = filters[i];
                    var member = members[memberId];
                    var match: boolean = false;
                    switch (filter.type) {
                        case 'in_group_role':
                            match = (this.matchRoles(member.group_role, filter.match))
                            break;
                        case 'in_unit_role':
                            match = (this.matchRoles(member.unit_role, filter.match))
                            break;
                        case 'in_custom_list':
                            match = (this.matchCustomList(memberId, filter.match));
                            break;
                        case 'memberid':
                            match = (memberId === filter.match);
                            break;
                        default:
                            this.log.warn('Invalid filter type %s.', filter.type);
                    }

                    if (match) {
                        memberIds.push(memberId);
                        //If we have not specified that we will continue on matched rule we break and end for-loop
                        break;

                    }
                }
            }
        }
        this.log.debug2('filterCache = %s', JSON.stringify(this.filterCache));
        return memberIds;
    }

    //
    // Internal function to check if member is in role
    //
    private matchRoles(memberRoles: string[], groupToMatch: string): any {

        // If no roles this will allways be false
        if (!memberRoles) {
            return false;
        }

        //If * used as roles match any role
        if (groupToMatch == '*') {
            return true;
        }

        return (memberRoles.indexOf(groupToMatch) > -1);
    }


    //
    // Internal function to check if user is member of custom list.
    //
    private matchCustomList(memberId: string, listToMatch: string): any {

        var lists: string[] = this.getLists();

        // If list do not exist or do not contain any users this will allways be false
        if (!lists[listToMatch] || !lists[listToMatch].members) {
            return false;
        }

        this.log.debug2('List "%s" contains members: %s', lists[listToMatch].title, lists[listToMatch].members)
        this.log.debug2('MemberId "%s" is in list: %s', memberId, (lists[listToMatch].members.indexOf(memberId) > -1))

        //If * used as roles match any role
        if (listToMatch == '*') {
            return true;
        }

        return (lists[listToMatch].members.indexOf(memberId) > -1);
    }


    //
    // Get scoutnet member as a GSuite user object
    //
    getGUser(memberId: string): any {
        var member: any = this.getMembers()[memberId];
        if (member === undefined)
            return undefined;

        var gsuiteUser =
        {
            "name": {
                "givenName": member.first_name,
                "familyName": member.last_name,
            },
            "externalIds": [
                {
                    "value": member.member_no,
                    "type": "organization",
                }
            ],
            "customerId": this.config.get('gsuite.customerId'),
            "orgUnitPath": "",
            "includeInGlobalAddressList": true,
        }

        if (typeof member.email != 'undefined') {
            gsuiteUser['emails'] =
                [
                    {
                        "type": "home",
                        "address": member.email,
                        "primary": false
                    }
                ];
            gsuiteUser["recoveryEmail"] = member.email;
        }

        if (typeof member.address_1 != 'undefined' && typeof member.postcode != 'undefined' && typeof member.town != 'undefined') {
            gsuiteUser["addresses"] = [
                {
                    "type": "home",
                    "formatted": `${member.address_1}, ${member.postcode} ${member.town.toUpperCase()}`,
                }
            ];
        }

        if (typeof member.contact_mobile_phone != 'undefined') {
            gsuiteUser["phones"] = [
                {
                    "value": member.contact_mobile_phone,
                    "primary": true,
                    "type": "mobile",
                }
            ];
            gsuiteUser["recoveryPhone"] = member.contact_mobile_phone;
        };

        gsuiteUser["customSchemas"] = {
            "scoutnetSync": {
                "lastUpdate": Date.now(),
                "updateHash": MD5(JSON.stringify(gsuiteUser))
            }
        };


        return gsuiteUser;

    }


    test() { this.log.debug('this = %s', this.constructor.name) }


}