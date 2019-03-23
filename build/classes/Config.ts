export class Config {
    private props: any = PropertiesService.getUserProperties();
    private defaults: any = {
        'scoutnetId': '',
        'memberListKey': '',
        'groupListKey': '',
        'gsuite.domain': 'rottne.scout.se',
        'gsuite.customerId': 'my_customer',
        'gsuite.cacheMode': true,
    };

    constructor() {
        for (let key in this.defaults) {
            if (this.props.getProperty(key) === null) {
                this.props.setProperty(key, this.defaults[key]);
            }
        }
    }

    get(key: string): any {
        return this.props.getProperty(key);
    }
}

