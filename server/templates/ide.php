<div class='ide'>
    <div class='code-debug-wrapper' data-bind='
        css: { running: program.isPaused },
        style: { height: layout.codeHeight() + "px" }
    '>
        <div class='code-wrapper'><textarea id='code'><?= $code ?></textarea></div>
        <div class='debugger-panel'>
            <div class='debugger-inner' data-bind='style: { height: layout.debugInnerHeight() + "px" }'>
                <div class='toolbar'>
                    <a class='continue button' href='#' title='Continue' data-bind='
                        enable : program.isPaused,
                        click: function() { program.interpreter.resume(); return false; }
                    '>Continue</a>
                    <a class='add-watch button' href='#' title='Add watch statement'
                        data-bind='click: debug.addWatchExpression'>Add</a>
                </div>
                <ul class='watch' data-bind='
                    style: { height: layout.watchListHeight() + "px"},
                    foreach: debug.watchExpressions
                '>
                    <li>
                        <a href='#' class='remove-watch button' title='Remove watch statement'
                            data-bind='click: function() { $root.debug.removeWatchExpression($index()); }'
                        >Remove</a>
                        <input data-bind='value: expression,
                        event: {
                            change: function() { $data.update() }
                        }'>
                        <div class='output' data-bind='text: output, attr: { title: output }'></div>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <div class='output-container' data-bind='style: {height: layout.outputHeight() + "px" }'>
        <button id='run' data-bind='click: run'>i can has program?</button>

        <!-- really doesn't belong here -->
        <label id='examples'> Examples
            <select data-bind='options: examples.examples,
                value: examples.currentExample'></select>
        </label>

        <div id='output' data-bind='text: program.output'></div>
    </div>
    <div class='tooltip' id='debug-state-inspector' data-bind='
        text: debug.tooltip.value,
        visible: debug.tooltip.visible,
        style: {
            minWidth: debug.tooltip.width,
            left: debug.tooltip.offset().left,
            top: debug.tooltip.offset().top
        }'>
    </div>

</div> <!-- end IDE -->

