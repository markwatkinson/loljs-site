<?php

/*
 * SQL Database interface
 */

class Store {

    private $dbh;

    function __construct($details) {
        $this->dbh = new PDO('mysql:host=' . $details['host'] . ';dbname=' .
            $details['db'], $details['user'], $details['password']);
    }

    // Gets the given key of an array, or returns default if it's not present.
    function _get($array, $key, $default=null) {
        return isset($array[$key]) ? $array[$key] : $default;
    }

    // Returns the new program's ID.
    function createNewProgram($params) {
        // We have to insert a program into the programs table, then
        // a revision into the revisions table, which references the program.
        $name = $this->_get($params, 'name', '');
        $program = isset($params['program']) ? $params['program'] : '';
        $s = $this->dbh->prepare('INSERT INTO lolcode_programs(name) VALUES (?)');
        $s->execute(array($name));

        $id = $this->dbh->lastInsertId();
        $s = $this->dbh->prepare('INSERT INTO
            lolcode_program_revisions(program_id, program, revision)
            VALUES(?, ?, 1)
        ');
        $s->execute(array($id, $this->_get($params, 'program', '')));
        return $id;
    }


    function saveProgram($id, $params) {
        $program = $this->_get($params, 'program', '');
        $s = $this->dbh->prepare('
            INSERT INTO lolcode_program_revisions(program, program_id, revision)
                SELECT ?, program_id, MAX(revision) + 1
                FROM lolcode_program_revisions
                WHERE program_id = ?
        ');
        $s->execute(array($program, $id));
        if ($s->rowCount() == 0) {
            return false;
        }
        $s = $this->dbh->prepare('SELECT revision FROM lolcode_program_revisions
            WHERE id = ?');
        $s->execute(array($this->dbh->lastInsertId()));
        $r = $s->fetch(PDO::FETCH_ASSOC);
        return $r ? $r['revision'] : false;
    }

    function getProgramRevision($id, $revision) {
        $s = $this->dbh->prepare('SELECT program_id, program, revision
            FROM lolcode_program_revisions
            WHERE program_id = ? AND revision = ?');
        $s->execute(array($id, $revision));
        return $s->fetch(PDO::FETCH_ASSOC);
    }

    function getProgramLatest($id) {
        $s = $this->dbh->prepare('
            SELECT program_id, program, revision FROM lolcode_program_revisions
            WHERE program_id = ? AND revision =
                (SELECT MAX(revision) FROM lolcode_program_revisions
                 WHERE program_id = ?)
        ');
        $s->execute(array($id, $id));
        $result = $s->fetch(PDO::FETCH_ASSOC);
        return $result;
    }

    function forkProgram($id, $revision) {
    }
}

$store = new Store(include('credentials.php'));
