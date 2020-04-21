import * as Logging from '../lib';

import path from 'path';

it('passes', () => {
    const stringifier = (record: Logging.ILogRecord) => `[${record.prefix}][${record.level}] ${Array.isArray(record.messages) ? record.messages.join('/n') : record.messages}\n`;

    const a = Logging.logger();
    const b = Logging.logger({ level: Logging.Level.debug });
    const c = Logging.logger({ prefix: 'test' });
    const d = c.child({ level: Logging.Level.warn });
    const e = Logging.logger({ stringifier });
    const f = Logging.logger({ prefix: 'test 3', stringifier });
    const g = Logging.logger({ level: Logging.Level.debug, prefix: 'test 4', stringifier });

    const fileOutput = new Logging.FileOutput(path.join(__dirname, 'output.log'));
    [a, b, c, d].forEach((logger) => logger.addOutput(fileOutput));

    a.info('test');
    b.debug('test 2', true);
    c.warn('test 3', 4);
    d.severe(new Error('test 8'), 'test 7');
    e.error('test 4', 12.5);
    f.info('test 5', undefined);
    // tslint:disable-next-line:no-null-keyword
    g.debug('test 6', null);
});
