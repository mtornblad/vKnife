import { Log, LogLevel } from "../classes/Log";
import { Scoutnet } from "../classes/Scoutnet";
import { Config } from "../classes/Config";



function test() {

    var log = new Log('main')
    var config = new Config();

    var x = new Scoutnet(config.get('scoutnetId'), config.get('memberListKey'), config.get('groupListKey'));
    log.debug(JSON.stringify(x.getFilteredMembersId('inlist_4515')));

}


