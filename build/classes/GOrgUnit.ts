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

    constructor(orgUnitPath: any) {   //todo change to string
        //Trim whitespace and leading and trailing slash
        this.orgUnitPath = orgUnitPath.trim().trimChar('/');
        this.log.debug(`OrgUnitPath object created with path "${this.orgUnitPath}"`);

        if (!this.exists()) {
            this.log.debug(`(orgUnit "${this.getPath()}" do not exist, attempting to create it.`);
            this.create();
        }
    }

    getPath(): string {
        return this.orgUnitPath;
    }


    getName(): string {
        var i: number = this.orgUnitPath.lastIndexOf("/");
        var name: string = this.orgUnitPath.substring(i + 1, this.orgUnitPath.length);
        return name;
    }


    getParent(): GOrgUnit {
        var i: number = this.orgUnitPath.lastIndexOf("/");
        var parent: GOrgUnit = new GOrgUnit(this.orgUnitPath.substring(0, i))
        return (parent);
    }


    exists(): boolean {
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


    //
    // Create this folder
    //
    private create() {

        var parent: GOrgUnit = this.getParent();

        if (parent.exists()) {
            try {
                this.log.debug('Creating orgUnit "%s" in "%s"', this.getName(), parent.getPath());
                var o = AdminDirectory.Orgunits.insert({ parentOrgUnitPath: '/' + parent.getPath(), name: this.getName() }, this.customerId);
                this.log.debug('orgUnit "%s" created with Id.', this.orgUnitPath, o.orgUnitId);
                this.cacheAdd();
                return true;
            }
            catch (err) {
                this.log.error('(createRecursive) Create orgUnit "%s/%s" insert failed, [%s]', parent.getPath(), this.getName(), err.message);
                return false;
            }
        }
    }



    private cacheAdd() {
        if (this.cacheMode && (GOrgUnit.orgUnitPathCache.indexOf(this.orgUnitPath) == -1)) {
            GOrgUnit.orgUnitPathCache.push(this.orgUnitPath);
            this.log.debug('orgUnitPath "%s" added to cache.', this.orgUnitPath);
        }
    }


    test() {
        Logger.log('Test called, this.log equals = %s', JSON.stringify(this.log))
        this.log.debug('TESTING');
    }
}
