"use strict";
(function() {
    var examples = {};
    app = $.extend(app || {}, {
        Examples: function() {
            this.examples = ko.observableArray([]);
            this.currentExample = ko.observable(null);
            for (var k in examples) {
                this.examples.push(k);
            }

            this.currentExample.subscribe(function(e) {
                var code = examples[e];
                if (code) {
                    a.setCode(code);
                }
            });

        }
    });
    examples[''] = null;
    examples['Square root'] = 'HAI\n\
I HAS A NUMBER\n\
GIMMEH NUMBER\n\
NUMBER IS NOW A NUMBAR\n\
I HAS A IMAGINARY ITZ FAIL\n\
\n\
NUMBER SMALLR THAN 0.0?, O RLY?\n\
  YA RLY\n\
      NUMBER R PRODUKT OF NUMBER AN -1\n\
      IMAGINARY R WIN\n\
OIC\n\
\n\
I HAS A X_N ITZ 10\n\
I HAS A LIMIT ITZ 100\n\
I HAS A COUNTER ITZ 0\n\
IM IN YR LOOP UPPIN YR COUNTER WILE COUNTER SMALLR THAN LIMIT?\n\
  I HAS A TERM ITZ QUOSHUNT OF NUMBER AN X_N\n\
  TERM R SUM OF X_N AN TERM\n\
  TERM R QUOSHUNT OF TERM AN 2\n\
  X_N R TERM\n\
  IM OUTTA YR LOOP\n\
\n\
BOTH SAEM IMAGINARY AN WIN, O RLY?\n\
  YA RLY\n\
    BOTH SAEM 1 AN X_N, O RLY?\n\
      YA RLY\n\
        X_N R "i"\n\
      NO WAI\n\
        X_N R SMOOSH "(" AN X_N AN "i)" MKAY\n\
  OIC\n\
OIC\n\
\n\
VISIBLE SMOOSH "sqrt(" AN NUMBER AN ") ~ ±" AN X_N\n\
KTHXBYE\n\
';
    examples['Escape operators'] = 'HAI\n\
BTW we\'re going to look at some escape sequences\n\
I HAS A VAR ITZ 12\n\
BTW interpolation\n\
I HAS A STR ITZ "MY VAR IS :{VAR}"\n\
VISIBLE STR\n\
BTW unicode\n\
VISIBLE "---"\n\
VISIBLE "I LIKE :(03C0)"\n\
\n\
BTW escaping works by the : character.\n\
BTW escaping a quote:\n\
VISIBLE "---"\n\
VISIBLE "I SAID :"hello:" to him"\n\
BTW escaping newlines, and tabs\n\
VISIBLE "---"\n\
VISIBLE "I SAID:):>:"hello:":)to him"\n\
KTHXBYE\n\
';
    examples['Operators'] = 'HAI\n\
BTW operators use prefix notation which looks like this:\n\
I HAS A X\n\
BTW (1*2) + (3/4)\n\
X R SUM OF PRODUKT OF 1 AN 2 AN QUOSHUNT OF 3 AN 4\n\
VISIBLE "X IS :{X}"\n\
\n\
\n\
BTW there are also some infinite arity operators (terminated by MKAY):\n\
BTW here we nest the nary ANY OF inside the binary BOTH SAEM\n\
\n\
VISIBLE BOTH SAEM ANY OF WIN AN FAIL AN FAIL AN FAIL MKAY AN WIN\n\
\n\
\n\
BTW we can define our own functions which work a lot like operators\n\
BTW we can nest function calls inside operator expressions:\n\
BTW define an XOR\n\
HOW DUZ I XOR YR ARG1 AN YR ARG2\n\
  I HAS A X ITZ NOT BOTH SAEM ARG1 AN ARG2\n\
  X R BOTH OF X AN EITHER OF ARG1 AN ARG2\n\
  FOUND YR X\n\
IF U SAY SO\n\
\n\
BTW SMOOSH is an infinite arity concatenation operator\n\
VISIBLE SMOOSH "XOR 1 AN 0 = " AN XOR 1 AN 0 MKAY\n\
\n\
BTW now we use the function in a more complex expression:\n\
BTW this reads: \'xor(0+1, 0) + 2\' = 3\n\
BTW VISIBLE SUM OF XOR SUM OF 0 AN 1 AN 0 AN 2 MKAY\n\
KTHXBYE\n\
';

    examples['Function definition'] = 'BTW THIS IS A FUNCTION DEFINITION EXAMPLE\n\
\n\
\n\
HOW DUZ I ADD YR NUM1 AN YR NUM2\n\
  SUM OF NUM1 AN NUM2\n\
IF U SAY SO\n\
\n\
\n\
HOW DUZ I DIVIDE YR NUM1 AN YR NUM2\n\
  I HAS A ANSWER ITS QUOSHUNT OF NUM1 AN NUM2\n\
  FOUND YR ANSWER\n\
IF U SAY SO\n\
\n\
\n\
BTW let\'s use the function:\n\
I HAS A NUMBER ITS DIVIDE 20 AN 10 MKAY\n\
VISIBLE NUMBER\n\
NUMBER R ADD 20 AN 10 MKAY\n\
VISIBLE NUMBER\n\
';
    examples['Fibonacci sequence'] = 'HAI BTW I HOPE YOU LIKE MY FIBONACCI SEQUENCE\n\
I HAS A TARGET ITS 100\n\
I HAS A COUNTER ITS 2\n\
I HAS A NUMBR1 ITS 0\n\
I HAS A NUMBR2 ITS 1\n\
VISIBLE SMOOSH 0 AN ": " AN NUMBR1 MKAY\n\
VISIBLE SMOOSH 1 AN ": " AN NUMBR2 MKAY\n\
IM IN YR LOOP UPPIN YR COUNTER TIL BOTH SAEM COUNTER AN TARGET\n\
  I HAS A SUM ITS SUM OF NUMBR1 AN NUMBR2\n\
  NUMBR1 R NUMBR2\n\
  NUMBR2 R SUM\n\
  VISIBLE SMOOSH COUNTER AN ": " AN SUM MKAY\n\
IM OUTTA YR LOOP\n\
KTHXBYE\n\
';

    examples['Factorial'] = 'HAI BTW THIS IS A STANDARD RECURSIVE FACTORIAL PROGRAM\n\
HOW DUZ I FACTORIAL YR NUM\n\
BOTH SAEM 0 AN BIGGR OF NUM AN 0, O RLY?\n\
  YA RLY\n\
    FOUND YR 1\n\
  NO WAI\n\
    FOUND YR PRODUKT OF NUM AN FACTORIAL DIFF OF NUM AN 1 MKAY\n\
OIC\n\
IF U SAY SO\n\
\n\
\n\
I HAS A NUMBER\n\
GIMMEH NUMBER\n\
NUMBER IS NOW A NUMBR BTW WE JUST CASTED TO NUMBER\n\
BTW WE GOTTA CHECK ITS BIGGR THAN 0 BECOZ FACTORIAL ISNT DEFINED FOR LESS THAN 0 OMG\n\
BOTH SAEM 0 AN BIGGR OF NUMBER AN 0, O RLY?\n\
  YA RLY\n\
    NUMBER R 0\n\
OIC\n\
\n\
\n\
NUMBER R FACTORIAL NUMBER MKAY\n\
VISIBLE SMOOSH "I FOUND UR FACTORIAL ITS " AN NUMBER\n\
'

}());