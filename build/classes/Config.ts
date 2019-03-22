export class Config {
    private props: any = PropertiesService.getUserProperties();
    private defaults: any = {
        scoutnetId: '',
        memberListKey: '',
        groupListKey: '',

    };

    constructor() {
        for (let key in this.defaults) {
            if (this.props.getProperty(key) === null) {
                this.props.setProperty(key, this.defaults[key]);
            }
        }
    }

    get(key: string): string {
        return this.props.getProperty(key);
    }
}

