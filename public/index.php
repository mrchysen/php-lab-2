<?php

require_once '../src/controllers/HomeController.php';
require_once '../src/controllers/DatabaseController.php';
require_once '../src/controllers/TableController.php';

$pdo = new PDO("mysql:host=mysql;port=3306;charset=utf8", "root", "rootpassword");

$homeController = new HomeController();
$databaseController = new DatabaseController($pdo);
$tableController = new TableController($pdo);

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET': 

        switch (strtok($_SERVER['REQUEST_URI'], '?')) { 
            case "/":
                $homeController->getUndex();
                break;
            case "/database/list":
                $databaseController->getDatabases();
                break;
            case "/database/tables":
                $databaseController->getTables($_GET['database-name'] ?? null);
                break;
            case "/table/data":
                $tableController->getTableData($_GET['database'], $_GET['table'], $_GET['filter'] ?? null);
                break;
            default:
                echo "Not found";
                break;
        }

        break;
    case 'POST':
        switch (strtok($_SERVER['REQUEST_URI'], '?')) { 
            case "/database":
                $databaseController->addDatabase();
                break;
            case "/database/table":
                $databaseController->addTable();
                break;
            case "/table/add-row":
                $tableController->addRowToTable();
                break;
            case "/table/delete-row":
                $tableController->deleteRow();
                break;
            default:
                echo "Not found";
                break;
        }

        break;

    case 'DELETE':

        switch (strtok($_SERVER['REQUEST_URI'], '?')) { 
            case "/database/table":
                $databaseController->deleteTable($_GET['database-name'], $_GET['table-name']);
                break;
            default:
                echo "Not found";
                break;
        }

        break;
    default:
        echo "Not Found";
}