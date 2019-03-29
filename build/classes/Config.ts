import { Log } from "./Log";

export class Config {
    private log: Log = new Log('Config')
    private props: any = PropertiesService.getUserProperties();
    private defaults: any = {
        'gsuite.domain': 'rottne.scout.se',
        'gsuite.customerId': 'my_customer',
        'gsuite.cacheMode': true,
        'gsuite.managedOrgUnitPath': 'Scoutnet',
        'scoutnet.id': '',
        'scoutnet.memberListKey': '',
        'scoutnet.groupListKey': '',
        'scoutnet.filters': {
            'anyrole':
                [
                    { 'type': 'in_group_role', 'match': '*' },
                    { 'type': 'in_unit_role', 'match': '*' },
                ],
            'anylist':
                [
                    { 'type': 'in_custom_list', 'match': '*' },
                ],
            'inlist_4515':
                [
                    { 'type': 'in_custom_list', 'match': '4515' },
                ],
            'member_by_id':
                [
                    { 'type': 'memberid', 'match': '3291915' },
                    { 'type': 'memberid', 'match': '3328268' },
                ],
            'Styrelseledamot':
                [
                    { 'type': 'in_group_role', 'match': 'Styrelseledamot' },
                ],

        },
        'scoutnet.userRules': {
            'defaults': {
                'create': false, 'update': true, 'delete': false, 'properties': {
                    'suspended': true, 'orgUnitPath': 'Suspended', 'includeInGlobalAddressList': false
                }
            }, //If a user is matched within a filter, defaults will be changed according to rule definition
            'rules': [
                {
                    'filterName': 'member_by_id', 'create': true, 'properties': {
                        'suspended': false, 'orgUnitPath': '%{unit}/%{patrol}', 'includeInGlobalAddressList': true
                    }
                },
                {
                    'filterName': 'member_by_id', 'create': true, 'properties': {
                        'suspended': false, 'orgUnitPath': '%{sex}', 'includeInGlobalAddressList': true
                    }
                }
            ]
        },

    };

    
    constructor() {
        for (let key in this.defaults) {
            if (this.props.getProperty(key) === null) {
                this.set(key, this.defaults[key]);
            }
        }
    }


    get(key: string, tokenValues: any = {}): any {

        function replacer(match, p1, offset, string) {
            return tokenValues[p1] ? tokenValues[p1] : '';
        }

        var result = this.props.getProperty(key);
        var regex = /%{([^}]+)}/gi;
        result = result.replace(regex, replacer);

        this.log.debug('String to parse by JSON: %s', result);
        return JSON.parse(result);
    }


    set(key: string, value: any) {
        this.props.setProperty(key, JSON.stringify(value));
    }


    resetToDefault(key: string) {
        if (key === undefined) {
            this.props.deleteAllProperties();
            for (let key in this.defaults) {
                this.set(key, this.defaults[key]);
            }
        } else {
            this.set(key, this.defaults[key]);
        }
    }

}

