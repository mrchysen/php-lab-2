<?php

// относительно index.php
require_once '../src/views/View.php';

class HomeController {
    private $view;

    public function __construct() {
        $this->view = new View();
    }

    // GET - / страница
    public function getUndex() {
        echo $this->view->renderWithLayout("index");
    }
}