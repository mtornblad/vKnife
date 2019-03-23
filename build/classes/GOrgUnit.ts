import { Log, LogLevel } from "./Log";
import { AdminDirectory } from '@dgcode/admin-directory';
import { Config } from "./Config";




export class GOrgUnit {

    private log: Log = new Log('GOrgUnit')
    private config: Config = new Config();
    private static orgUnitPathCache: string[] = [];
    private cacheMode: boolean = this.config.get('gsuite.cacheMode');
    private customerId: string = this.config.get('gsuite.customerId');
    private orgUnitPath: string;

    constructor(orgUnitPath: string) {
        this.orgUnitPath = orgUnitPath;
    }


    exists() {
        //TODO: create function to remove leading slash if it's there
        if (this.cacheMode && (GOrgUnit.orgUnitPathCache.indexOf(this.orgUnitPath) != -1)) {
            this.log.debug('orgUnitPath "%s" found in cache.', this.orgUnitPath);
            return true;
        } else {
            this.log.debug('orgUnitPath "%s" not found in cache.', this.orgUnitPath);
            try {
                var o = AdminDirectory.Orgunits.get(this.customerId, this.orgUnitPath);
                this.log.debug('orgUnitPath "%s" found in directory.', this.orgUnitPath);
                this.cacheAdd();
                return true;
            }
            catch (err) {
                this.log.warn('get orgUnit "%s" failed, [%s]', this.orgUnitPath, err.message);
                return false;
            }
        }
    }


    cacheAdd() {
        if (this.cacheMode && (GOrgUnit.orgUnitPathCache.indexOf(this.orgUnitPath) != -1)) {
            this.log.debug('orgUnitPath "%s" added to cache.', this.orgUnitPath);
        }
    }


    test() {
        Logger.log('Test called, this.log equals = %s', JSON.stringify(this.log))
        this.log.debug('TESTING');
    }
}
