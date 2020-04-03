// @ts-nocheck

const reporter = require('@jest/reporters');
const util     = require('jest-util');

class Reporter extends reporter.DefaultReporter {
    constructor(globalConfig, options) {
        super(globalConfig);

        this._options = options;
    }

    onRunStart(aggregatedResults, options) {
    }

    onTestStart(test) {
    }

    onRunComplete() {
        this.forceFlushBufferedOutput();

        process.stdout.write = this._out;
        process.stderr.write = this._err;
        util.clearLine(process.stderr);
    }

    onTestResult(test, testResult, aggregatedResults) {
        // eslint-disable-next-line no-constant-condition
        if ((this._config || { output: true }).output && !testResult.skipped) {
            if (testResult.failureMessage) {
                this.log(testResult.failureMessage);
            }
        }

        this.forceFlushBufferedOutput();
    }
}

module.exports = Reporter;
