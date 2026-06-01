<?php

class TableController {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    // GET - /table?database=&table=&filter список баз данных
    public function getTableData($database, $table, $filter) {
        header('Content-Type: application/json');

        try {
            $this->pdo->exec("USE `$database`;");

            $sql = "SELECT * FROM `$table`";
            if($filter !== null){
                $sql .= " WHERE " . $filter;
            }
            $stmt = $this->pdo->query($sql);
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $stmt = $this->pdo->query("SHOW COLUMNS FROM `$table`;");
            $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $columnNames = array_column($columns, 'Field');

            echo json_encode([
                "success" => true,
                "data" => $data,
                "columns" => $columnNames,
                "sql" => $sql
            ]);
        } catch (PDOException $e) {
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage(),
                "sql" => $sql
            ]);
        }
    }

    // POST /table/add-row
    public function addRowToTable() {
        header('Content-Type: application/json');
    
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        try{
            $database = $data["database"];
            $table = $data["table"];
            $fieldNames = $data["listOfFields"];
            $values = $data["listOfValues"];

            $this->pdo->exec("USE `$database`;");

            $fieldsStr = implode(",", $fieldNames);
            $valuesStr = "'" . implode("', '", $values) . "'";

            $sql = "INSERT INTO `$table` ($fieldsStr) VALUES ($valuesStr)";

            $this->pdo->exec($sql);

            echo json_encode([
                "success" => true,
                "sql" => $sql
            ]);
        } catch (PDOException $e) {
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage(),
                'sql' => $sql
            ]);
        }
    }

    // POST /table/add-row
    public function deleteRow() {
        header('Content-Type: application/json');
    
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        try{
            $database = $data["database"];
            $table = $data["table"];
            $rowValues = $data["rowValues"];

            $this->pdo->exec("USE `$database`;");

            $sql = "DELETE FROM `$table` WHERE $rowValues";

            $this->pdo->exec($sql);

            echo json_encode([
                "success" => true,
                "sql" => $sql
            ]);
        } catch (PDOException $e) {
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage(),
                'sql' => $sql
            ]);
        }
    }
}