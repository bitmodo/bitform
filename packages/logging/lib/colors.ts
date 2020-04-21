import { Instance, Chalk, supportsColor, stderr } from 'chalk';
import stripAnsi                                  from 'strip-ansi';

// Chalk instance
const c = new Instance({ level: 3 });

// Colors
const red: Chalk     = c.red,
      green: Chalk   = c.green,
      yellow: Chalk  = c.yellow,
      blue: Chalk    = c.blue,
      magenta: Chalk = c.magenta,
      cyan: Chalk    = c.cyan,
      white: Chalk   = c.white,
      gray: Chalk    = c.gray,
      grey: Chalk    = c.grey;

// Styles
const bold: Chalk                    = c.bold,
      italic: Chalk                  = c.italic,
      underline: Chalk               = c.underline,
      strikethrough: Chalk           = c.strikethrough,
      strip: (str: string) => string = stripAnsi;

const none: (...text: unknown[]) => string = (...text: unknown[]) => {
    return text.join(' ');
};

// Generic colors
const fine    = white,
      issue   = yellow,
      problem = red;

// Message colors
const timestamp = supportsColor ? grey : none;
const prefix    = supportsColor ? cyan : none;
const level     = supportsColor ? bold : none;

const debug  = supportsColor ? grey : none;
const info   = supportsColor ? blue : none;
const warn   = supportsColor ? yellow : none;
const error  = supportsColor ? red : none;
const severe = supportsColor ? red : none;

export {
    supportsColor, stderr,
    red, green, yellow, blue, magenta, cyan, white, gray, grey,
    bold, italic, underline, strikethrough, none, strip,
    fine, issue, problem,
    timestamp, prefix, level,
    debug, info, warn, error, severe,
};
