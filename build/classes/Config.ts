import { Log } from "./Log";

export class Config {
    private log: Log = new Log('Config')
    private props: any = PropertiesService.getUserProperties();
    private defaults: any = {
        'gsuite.domain': 'rottne.scout.se',
        'gsuite.customerId': 'my_customer',
        'gsuite.cacheMode': true,
        'scoutnet.id': '',
        'scoutnet.memberListKey': '',
        'scoutnet.groupListKey': '',
        'scoutnet.filters': {
            'anyrole':
                [
                    { type: 'in_group_role', match: '*' },
                    { type: 'in_unit_role', match: '*' },
                ],
            'anylist':
                [
                    { type: 'in_custom_list', match: '*' },
                ],
            'inlist_4515':
                [
                    { type: 'in_custom_list', match: '4515' },
                ],
            'member_by_id':
                [
                    { type: 'memberid', match: '3291915' },
                    { type: 'memberid', match: '3328268' },
                ],
            'Styrelseledamot':
                [
                    { type: 'in_group_role', match: 'Styrelseledamot' },
                ],

        }
    };

    constructor() {
        for (let key in this.defaults) {
            if (this.props.getProperty(key) === null) {
                this.set(key, this.defaults[key]);
            }
        }
    }

    get(key: string): any {
        return JSON.parse(this.props.getProperty(key));
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

