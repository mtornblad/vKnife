import { Log, LogLevel } from "../classes/Log";


function test() {
    var x = new Log(LogLevel.Info)
   
    x.info(PropertiesService.getUserProperties().getKeys().toString());
    x.info(PropertiesService.getScriptProperties().getKeys().toString())


}


