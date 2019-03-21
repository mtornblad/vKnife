import { LogLevel } from "./Log";

export class Config {
    props: GoogleAppsScript.Properties.Properties = PropertiesService.getUserProperties();
    defaults: any = {
        'loglevel': LogLevel.Error
    };

    constructor() {
        for (let key in this.defaults) {
            if (this.props.getProperty(key) === null) {
                this.props.setProperty(key, this.defaults[key]);
            }
        }
    }

    get(key: string):string {
        return this.props.getProperty(key);
    }
}

function teet() {
    var c = new Config();
    Logger.log(c.get('loglevel'));
  }
  