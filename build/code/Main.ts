function test() {
    var x = new Log(LogLevel.Warn)
    x.error('ett error med meddelande %s %s %s', 'nisse', 'olle', 'kalle');
    x.warn('ett warn med meddelande %s', 'nisse');
    x.info('ett info med meddelande %s', 'nisse');
    x.verbose('ett verbose med meddelande %s', 'nisse');
}