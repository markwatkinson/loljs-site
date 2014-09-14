<?php


require 'router.php';
require 'IdCodec.php';
require 'Store.php';
require 'utils.php';

function load($program=null, $revision=null) {
    global $store, $idc;
    $code = '';
    $inner_template = 'ide.php';
    $fatal_error = false;
    $program_id = $program !== null ? $idc->encode($program) : null;
    $program_revision = $revision;
    if ($program !== null && $revision !== null) {
        $r = $store->getProgramRevision($program, $revision);
        if ($r) {
            $code = $r['program'];
        } else {
            http_response_code(404);
            $inner_template = '404.php';
            $fatal_error = true;
        }
    }
    require 'templates/index.php';
}


route(array(
    'GET /' => function($req) {
        load();
    },
    'GET /p/:id/:revision' => function($req) use ($idc) {
        load($idc->decode($req['params']['id']), $req['params']['revision']);
    }
));