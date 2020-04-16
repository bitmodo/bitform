module.exports = {
    ui:         'bdd',
    checkLeaks: true,
    require:    ['ts-node/register', 'source-map-support/register', 'chai/register-assert', 'chai/register-expect', 'chai/register-should'],
    reporter:   'min',
};
