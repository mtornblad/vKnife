import { Log, LogLevel } from "../classes/Log";
import { Scoutnet } from "../classes/Scoutnet";
import { Config } from "../classes/Config";
import { GOrgUnit } from "../classes/GOrgUnit";

function resetConfig() {
    new Config().resetToDefault(undefined);
}

function test() {

    var log = new Log('main')

    log.info('Application launched from Function test in Main!')

    var config = new Config();


    var x = new Scoutnet();
    /*
        var y = new GOrgUnit('/Scoutnet/Nisse');
    // var y = new GOrgUnit('/Scoutnet/Olle/');

    log.info('exists? = %s', y.exists())
    // log.info('exists? = %s', y.getParent().exists())
    log.info('member_by_id: %s', x.getFilteredMembersId('member_by_id'));
    log.info('Styrelseledamot %s', x.getFilteredMembersId('Styrelseledamot'));
    log.info('anylist %s', x.getFilteredMembersId('anylist'));
    log.info('anyrole %s', x.getFilteredMembersId('anyrole'));

    log.info('userobject \n%s', JSON.stringify(x.getGUser('3328268')));
*/
    config.resetToDefault('gsuite.userRules');
    log.info(x.getMembers())
    log.info(x.getMembers()[3328268])
    log.info(config.get('gsuite.userRules',x.getMembers()[3328268]));


}


