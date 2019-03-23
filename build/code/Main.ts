import { Log, LogLevel } from "../classes/Log";
import { Scoutnet } from "../classes/Scoutnet";
import { Config } from "../classes/Config";
import { GOrgUnit } from "../classes/GOrgUnit";



function test() {

    var log = new Log('main')
    var config = new Config();



    //var x = new Scoutnet(config.get('scoutnetId'), config.get('memberListKey'), config.get('groupListKey'));
    var y = new GOrgUnit('Scoutnet');
    log.info('%s exists? = %s', y.exists())
    log.info('%s exists? = %s', y.exists())


}


