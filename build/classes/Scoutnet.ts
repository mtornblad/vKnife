import { Log, LogLevel } from "./Log";
import { Helpers } from "../code/Helpers";



export class Scoutnet {

    private log: Log = new Log('Scoutnet')
    private scoutnetId: string;
    private memberListKey: string;
    private groupListKey: string;
    private members: any = null;
    private lists: any = null;
    private filterCache: any = {};

    private filters: any =
        {
            'anyrole':
                [
                    { type: 'in_group_role', match: 'Styrelseledamot' },
                    { type: 'in_unit_role', match: '*' },
                ],
            'inlist_4515':
                [
                    { type: 'in_custom_list', match: '4515' }
                ]
        };


    constructor(scoutnetId: string, memberListKey: string, groupListKey: string) {
        this.scoutnetId = scoutnetId;
        this.memberListKey = memberListKey;
        this.groupListKey = groupListKey;
        this.log.debug('Constructed!');
    }


    //
    // Function to return all members and load info from Scoutnet if not already done!
    //
    getMembers(): any {
        if (this.members === null) {
            this.members = {};

            //TODO: errorhandling
            var response = UrlFetchApp.fetch('https://www.scoutnet.se/api/group/memberlist?id=' + this.scoutnetId + '&key=' + this.memberListKey);
            var membersRaw: JSON = JSON.parse(response.getContentText()).data;
            this.log.debug('Memberlist loaded from scoutnet! \n%s', JSON.stringify(membersRaw));
            for (var memberId in membersRaw) {
                var memberRaw = membersRaw[memberId];
                var member = {};
                for (var property in memberRaw) {
                    switch (property) {
                        case 'contact_mobile_phone':
                            //TODO! Formatters
                            member[property] = memberRaw[property].value;
                            break;

                        case 'email':
                            //TODO! Formatters
                            member[property] = memberRaw[property].value;
                            break;

                        case 'unit_role':
                        case 'group_role':
                            member[property] = Helpers.splitAndTrim(memberRaw[property].value, ',');
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

            var response = UrlFetchApp.fetch('https://www.scoutnet.se/api/group/customlists?id=' + this.scoutnetId + '&key=' + this.groupListKey);
            this.lists = JSON.parse(response.getContentText());
            var listId: string;
            // Add an extra property 'members' as an array with all id of users 
            for (listId in this.lists) {
                var list = UrlFetchApp.fetch('https://www.scoutnet.se/api/group/customlists?id=' + this.scoutnetId + '&key=' + this.groupListKey + '&list_id=' + listId);
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
        var filters: any = this.filters[filterName];

        this.log.debug('Getting filtered list, name: %s, rules %s.', filterName, filters)

        if (this.filterCache[filterName] === undefined) {
            this.filterCache[filterName] = [];

            var members: any = this.getMembers();
            var memberIds: string[] = this.filterCache[filterName];
            var memberId: string;

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


    test() { this.log.debug('this = %s', this.constructor.name) }


}