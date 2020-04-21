import * as Logging from '../lib';

import path from 'path';

it('passes', () => {
    const stringifier = (record: Logging.ILogRecord) => `[${record.prefix}][${record.level}] ${Array.isArray(record.messages) ? record.messages.join('/n') : record.messages}\n`;

    const a = Logging.logger();
    const b = Logging.logger(Logging.Level.debug);
    const c = Logging.logger('test');
    const d = Logging.logger(Logging.Level.warn, 'test 2');
    const e = Logging.logger(stringifier);
    const f = Logging.logger('test 3', stringifier);
    const g = Logging.logger(Logging.Level.debug, 'test 4', stringifier);

    const fileOutput = new Logging.FileOutput(path.join(__dirname, 'output.log'));
    [a,b,c,d].forEach((logger) => logger.addOutput(fileOutput));

    a.info('test');
    b.debug('test 2', true);
    c.warn('test 3', 4);
    d.severe(new Error('test 8'), 'test 7');
    e.error('test 4', 12.5);
    f.info('test 5', undefined);
    g.debug('test 6', null);
});
