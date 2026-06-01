<?php

class DatabaseController {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    // GET - /database/list список баз данных
    public function getDatabases() {
        header('Content-Type: application/json');

        $stmt = $this->pdo->query("SHOW DATABASES;");
        $databases = $stmt->fetchAll();
        $allDbs = array_column($databases, 'Database');
        $systemDbs = ['information_schema', 'mysql', 'performance_schema', 'sys'];
        $userDbs = array_values(array_diff($allDbs, $systemDbs));

        echo json_encode($userDbs);
    }

    // POST /database
    public function addDatabase() {
        header('Content-Type: application/json');
    
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        try{
            $databaseName = $data["databaseName"];
            $this->pdo->exec("CREATE DATABASE `$databaseName`");

            echo json_encode([
                "success" => true
            ]);
        } catch (PDOException $e) {
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }

    // GET /database/tables?database-name=<database-name>
    public function getTables($databaseName) {
        if($databaseName === null){
            http_response_code(400);
            echo "Имя базы данных должно быть задано.";
            return;
        }

        $this->pdo->exec("USE `$databaseName`");
        $stmt = $this->pdo->query("SHOW TABLES");
        $tables = $stmt->fetchAll();
        $tableNames = array_column($tables, 0);

        header('Content-Type: application/json');
        echo json_encode($tableNames);
    }

    // POST /database/tables
    public function addTable() {
        header('Content-Type: application/json');
        
        $json = file_get_contents('php://input');
        $data = json_decode($json);
        
        try {
            $this->pdo->exec("USE `$data->databaseName`");
            $sql = "CREATE TABLE `{$data->tableMetainfo->tableName}` (";
            
            $columnDefinitions = [];
            foreach ($data->tableMetainfo->columns as $col) {
                $columnDefinitions[] = "`{$col->columnName}` {$col->columnType}";
            }
            
            $sql .= implode(", ", $columnDefinitions);
            $sql .= ");";
            $this->pdo->exec($sql);
            
            echo json_encode([
                'success' => true,
                'message' => 'Table created successfully',
                'sql' => $sql
            ]);
            
        } catch (PDOException $e) {
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }

    // DELETE /database/tables?database-name=""&table-name=""
    public function deleteTable($databaseName, $tableName) {
        header('Content-Type: application/json');

        try {
            $this->pdo->exec("USE `$databaseName`;");
            $this->pdo->exec("DROP TABLE `$tableName`;");

            echo json_encode([
                'success' => true
            ]);
        } catch (PDOException $e) {
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
        }
    }
}