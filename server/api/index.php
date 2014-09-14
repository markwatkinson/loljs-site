<?php

require '../router.php';
require '../IdCodec.php';
require '../Store.php';
require '../utils.php';

/**
  * REST Api Routing
  */

function output($code, $content=null) {
    http_response_code($code);
    echo json_encode($content);
}

route(array(
    'POST /api/program/new/' => function($req) use ($store, $idc) {
        $id = $store->createNewProgram(array(
            'name' => $req['body']['name'],
            'program' => $req['body']['program']
        ));
        output(200, array('id' => $idc->encode($id), 'revision' => 1));
    },
    'POST /api/program/save' => function($req) use ($store, $idc) {
        $id = $idc->decode($req['body']['id']);
        $revision = $store->saveProgram($id,
            array('program' => $req['body']['program']
        ));

        if ($revision) {
            $out = array(
                'id' => $idc->encode($id),
                'revision' => $revision
            );
            output(201, $out);
        }
        else {
            output(404, 'No such program: ' . $req['body']['id']);
        }
    },

    'GET /api/program/:id' => function($req) use ($store, $idc) {
        $id = $idc->decode($req['params']['id']);
        $result = $store->getProgramLatest($id);
        if ($result) {
            output(200, array(
                'id' => $idc->encode($result['program_id']),
                'program' => $result['program'],
                'revision' => $result['revision']
            ));
        } else {
            output(404, 'No such program: ' . $req['params']['id']);
        }
    },

    'GET /api/program/:id/:revision' => function($req) use ($store, $idc) {
        $id = $idc->decode($req['params']['id']);
        $result = $store->getProgramRevision($id, $req['params']['revision']);
        if ($result) {
            output(200, array(
                'id' => $idc->encode($result['program_id']),
                'program' => $result['program'],
                'revision' => $result['revision']
            ));
        } else {
            output(404, 'No such program/revision: ' . $req['params']['id'] .
                '/' . $req['params']['revision']);
        }
    },
    'POST /api/program/fork/:id/:revision' => function($req) {
    }
));
