<?php
/**
  * Class to deal with encoding/decoding IDs to short strings.
  */
class IdCodec {
    private $toStr = array();
    private $toInt = array();
    private $alphabetSize;

    function __construct() {
        $this->alphabetSize = 0;
        // set up the alphabet
        $this->addRange('a', 'z');
        $this->addRange('A', 'Z');
        $this->addRange('0', '9');
    }

    private function addRange($c1, $c2) {
        for ($i = ord($c1); $i < ord($c2); $i++) {
            $char = chr($i);
            $this->toStr[] = $char;
            $this->toInt[$char] = count($this->toStr) - 1;
            $this->alphabetSize++;
        }
    }

    public function encode($num) {
        $out = '';
        while (true) {
            $out = $this->toStr[$num % $this->alphabetSize] . $out;
            $num = floor($num / $this->alphabetSize);

            if ($num <= 0) { break; }
        }
        return $out;
    }

    public function decode($str) {
        $out = 0;
        $pos = 0;
        $a = str_split($str);
        while (!empty($a)) {
            $c = array_pop($a);
            $i = $this->toInt[$c];
            $out += $i * pow($this->alphabetSize, $pos);
            $pos++;
        }
        return $out;
    }
}

$idc = new IdCodec();
