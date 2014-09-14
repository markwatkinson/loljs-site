<?php

if (get_magic_quotes_gpc()) {
    function strip_array($var) {
        return is_array($var) ? array_map("strip_array", $var) :
            stripslashes($var);
    }
    $_POST = strip_array($_POST);
    $_SESSION = strip_array($_SESSION);
    $_GET = strip_array($_GET);
}

/**
  * Router
  */
function route($table) {
    $path = $_SERVER['REQUEST_URI'];
    $q_pos = strpos($path, '?');
    if ($q_pos !== false) {
        $path = substr($path, 0, $q_pos);
    }
    $segments = explode('/', trim($path, ' /'));

    $possibilities = array();
    foreach($table as $route => $handler) {
        $parts = preg_split('/\s+/', $route);
        $method = $parts[0];
        if ($method !== $_SERVER['REQUEST_METHOD']) { continue; }
        $path = $parts[1];
        $path = preg_replace('%//+%', '/', $path);
        $path = trim(trim($path, '/'));
        $path_split = explode('/', $path);
        if (count($path_split) !== count($segments)) { continue; }
        $possibilities[$route] = array(
            'segments' => $path_split,
            'params' => array(),
            'segment_matches' => 0
        );
    }

    foreach($segments as $i => $s) {
        foreach($possibilities as $route => &$route_data) {
            $is_match = false;
            $route_segment = (count($route_data['segments']) > $i) ?
                $route_data['segments'][$i] :
                null;
            if ($route_segment === $s) {
                $is_match = true;
                $route_data['segment_matches']++;
            }
            else if (strlen($route_segment) && $route_segment[0] === ':') {
                $is_match = true;
                $param_name = substr($route_segment, 1);
                $route_data['params'][$param_name] = $s;
            }

            if (!$is_match) {
                unset($possibilities[$route]);
            }
        }
    }
    $selected_route = null;
    $segment_matches = 0;
    // select the route with the highest number of verbatim matches.
    foreach($possibilities as $route => $p) {
        if ($p['segment_matches'] > $segment_matches) {
            $segment_matches = $p['segment_matches'];
            $selected_route = $route;
        }
    }
    if ($selected_route !== null) {
        $p = $possibilities[$selected_route];
        $f = $table[$selected_route];
        $req = array(
            'params' => $p['params'],
            'body' => array(),
            'query' => $_GET
        );
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $post = isset($_POST['message']) ?
                json_decode($_POST['message'], true) : array();
            $req['body'] = $post;
        }
         $f($req);
    } else {
        header('HTTP/1.0 404 Not Found');
        echo 'No route matched.';
    }
}
