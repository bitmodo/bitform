import { Level }      from './level';
import {
    stderr,
    timestamp as timestampColor, prefix as prefixColor, level as levelColor,
    debug as debugColor, info as infoColor, warn as warnColor, error as errorColor, severe as severeColor
}                     from './colors';
import { ILogRecord } from './record';

/**
 *
 * @param lvl
 */
export function erroring(lvl: Level): boolean {
    return lvl >= Level.error;
}

const timeFormatter = new Intl.DateTimeFormat('default', {
    hour:   'numeric', minute: 'numeric', second: 'numeric',
    hour12: false,
});

/**
 *
 * @param record
 * @param color
 */
export function timestamp(record: ILogRecord, color: boolean = true): string {
    const ts = timeFormatter.format(record.timestamp);

    if (!color)
        return ts;

    if (erroring(record.level)) {
        if (stderr.supportsColor) {
            return stderr.red(ts);
        }

        return ts;
    }

    return timestampColor(ts);
}

/**
 *
 * @param record
 * @param color
 */
export function prefix(record: ILogRecord, color: boolean = true): string {
    if (!color)
        return record.prefix;

    if (erroring(record.level)) {
        if (stderr.supportsColor) {
            return stderr.red(record.prefix);
        }

        return record.prefix;
    }

    return prefixColor(record.prefix);
}

/**
 *
 * @param record
 * @param color
 */
export function level(record: ILogRecord, color: boolean = true): string {
    const lvl = record.level.name.toUpperCase();

    if (!color)
        return lvl;

    if (erroring(record.level)) {
        if (stderr.supportsColor) {
            return stderr.red.bold(lvl);
        }

        return lvl;
    }

    let style: (...text: unknown[]) => string;

    switch (record.level) {
        case Level.info:
            style = infoColor;
            break;
        case Level.warn:
            style = warnColor;
            break;
        case Level.error:
            style = errorColor;
            break;
        case Level.severe:
            style = severeColor;
            break;
        default:
            style = debugColor;
    }

    return levelColor(style(lvl));
}

/**
 *
 * @param record
 * @param msg
 * @param color
 */
export function message(record: ILogRecord, msg: string, color: boolean = true): string {
    if (!color)
        return msg;

    if (erroring(record.level) && stderr.supportsColor) {
        return stderr.red(msg);
    }

    return msg;
}

function formatMessage(ts: string, pre: string, lvl: string, msg: string): string {
    return `[${ts}] ${pre.trim() === '' ? '' : `[${pre}] `}[${lvl}] ${msg}\n`;
}

/**
 *
 */
export type MessageFormatter = (record: ILogRecord, msg: string) => string;

/**
 *
 * @param record
 * @param ts
 * @param pre
 * @param lvl
 * @param msgFormat
 */
export function format(record: ILogRecord, ts: string, pre: string, lvl: string, msgFormat: MessageFormatter = message): string {
    if (Array.isArray(record.messages)) {
        return record.messages.map((msg: string) => formatMessage(ts, pre, lvl, msgFormat(record, msg))).join('');
    }

    return formatMessage(ts, pre, lvl, msgFormat(record, record.messages));
}
