import { Log } from "./Log";
import { AdminDirectory } from '@dgcode/admin-directory';



export class GOrgUnit {



    private log: Log = new Log('GDir')

    constructor() {
        this.log.debug('Constructed!');

        var x = AdminDirectory.
        
    }

















    test() { this.log.debug('this = %s', this.constructor.name) }


}