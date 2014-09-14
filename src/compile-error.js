;
/**
 * Compilation errors.
 * For trying to figure out what went wrong, and what the user needs to do to
 * fix it.
 */
var CompileError;
(function() {
    "use strict";

    // Maps a terminator token's text to a slightly more understandable
    // structure
    var terminators = {
        'IF_U_SAY_SO' : 'function (IF U SAY SO)',
        'IM_OUTTA_YR' : 'loop (IM OUTTA YR)',
        'OIC':          'conditional (OIC)'
    };

    function terminator(expected) {
        var i, t = [];
        for (i = 0; i < expected.length; i++) {
            var s = expected[i].replace(/^'|'$/g, '');
            if (terminators[s]) {
                t.push(terminators[s]);
            }
        }
        return t;
    }


    CompileError = function(err, hash, parser) {
        this.pos = {
            line: hash.loc.first_line - 1,
            col: hash.loc.first_column,
            lineEnd: hash.loc.last_line - 1,
            colEnd: hash.loc.last_column
        };

        this.text = function() {
            var t = terminator(hash.expected).join(', ');
            if (hash.token === 'TYPE') {
                return {
                    msg: 'Unexpected type: ' + hash.text,
                    more: '"' + hash.text + '" is a reserved word, are you ' +
                        'trying to use it as a variable name?'
                }
            }
            else if (hash.text.match(/^[\n\r]+/)) {
                return {
                    msg: 'Unexpected end of line',
                    more: 'Expected to find: ' + hash.expected.join(', ')
                }
            }
            else if (hash.token === 'EOF') {
                return {
                    msg: 'Unexpected end of input',
                    more: t ? 'Expected to find terminator for ' + t : null
                }
            }
            else {
                return {
                    msg: 'Unexpected text: ' + hash.text,
                    more: t ? 'Expected to find terminator for ' + t : null
                }
            }
        }
    }
}());