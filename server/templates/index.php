<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">

        <title> O HAI </title>

        <script src='/lib/knockout-2.2.1.js'></script>
        <script src='/lib/async.js'></script>
        <script src='/lib/jquery-1.9.1.min.js'></script>
        <script src='/lib/jquery-ui-1.10.3.custom.min.js'></script>
        <link rel='stylesheet' href='/css/jquery-ui-1.10.3.custom.css'></link>

        <script src='/lib/loljs/parser.js'></script>
        <script src='/lib/loljs/src/lol.js'></script>
        <script src='/lib/loljs/src/ast.js'></script>

        <script src='/lib/CodeMirror/lib/codemirror.js'></script>
        <link rel='stylesheet' href='/lib/CodeMirror/lib/codemirror.css'></link>

        <script src='/lib/lol-cm/lolcode.js'></script>

        <script>
        var LOAD = {
            id: <?= $program_id === null ? 'null' : "'$program_id'" ?>,
            revision: <?= $program_revision === null ? 'null' : $program_revision  ?>
        };
        </script>

        <style>
            body {
                font-family: sans-serif;
            }

            .tooltip {
                position: absolute;
                z-index: 10;
                border: 2px solid #eee;
                background: #999;
                padding: 0.25em 1em;
                color: #fff;
                text-align: center;
                border-radius: 2px;
                -webkit-transition: ease-in-out 0.2s;
            }

            .code-wrapper {
                background-color: #000;
            }

            .paused {
                background-color: #5F5F5F;
            }

            .debug-focus {
                border-bottom: 1px solid #fff;
            }
        </style>

        <link rel='stylesheet' type='text/css' href='/css/style.css'>
    </head>

    <body class='<?= $fatal_error ? 'error' : '' ?>'>
        <div class='header'>
            <div class='left'>
                <?php if (!$fatal_error): ?>
                    <a href='#' class='button save' title='Save' data-bind='click: save'>Save</a>
                <?php endif ?>
            </div>
            <div class='center'>lol.js</div>
            <div class='right'>
                <a href='#' class='button help' title='Help' data-bind='click: help.showMenuClick'>
                    <span>?</span>
                </a>
                <!-- help menu dropdown -->
                <div class='menu help-menu'>
                    <ul>
                        <li> <a href='#'>lol.js&nbsp;Manual</a> </li>
                        <li> <a href='#' data-bind='click: help.menuAboutClick'>About&nbsp;lol.js</a> </li>
                    </ul>
                </div>
            </div>
        </div>

        <?php
            require $inner_template;
        ?>

        <div class='bottom'>
            <div>
                Permalink to this revision:
                <input type='text'
                    data-bind='value: "/" + remote.programData().id + "/" + remote.programData().revision'>
            </div>
        </div>

        <!-- About panel -->
        <div class='about overlay'>
            <div class='header'>
                <h2>About</h2>
                <a href='#' title='Close' class='button close' data-bind='click: help.aboutCloseClick'>Close</a>
            </div>
            <div class='content' data-bind='style: { height: help.aboutContentHeight }'>
                <p>
                    This is still a very rough development version. You should try visiting
                    <a href='http://asgaard.co.uk/misc/loljs/'>http://asgaard.co.uk/misc/loljs/</a> for a more useful version.
                </p>
                <p><a href='#' title='Close' data-bind='click: help.aboutCloseClick'>Close</a></p>
            </div>
        </div>

        <script src='/src/remote.js'></script>
        <script src='/src/compile-error.js'></script>
        <script src='/src/help.js'></script>
        <script src='/src/url.js'></script>
        <script src='/src/layout.js'></script>
        <script src='/src/examples.js'></script>
        <script src='/src/app.js'></script>


    </body>
</html>
