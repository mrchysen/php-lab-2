async function getDatabases() {
    try {
        const response = await fetch(`/database/list`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const databases = await response.json();
        console.log('Полученные базы данных:', databases);
        
        return databases;
    } catch (error) {
        console.error('Ошибка запроса:', error);
    }
}

async function addNewDatabase(newDatabaseName) {
    try {
        const response = await fetch('/database', {
            method: 'POST',
            body: JSON.stringify({
                databaseName: newDatabaseName
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const databases = await response.json();
        console.log('Полученные базы данных:', databases);
        
        return databases;
    } catch (error) {
        console.error('Ошибка запроса:', error);
    }
}

async function getDatabaseTables(databaseName) {
    try {
        const response = await fetch(`/database/tables?database-name=${databaseName}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const tables = await response.json();
        console.log(`Полученные таблиц для базы данных (${databaseName}):`, tables);
        
        return tables;
    } catch (error) {
        console.error('Ошибка запроса:', error);
    }
}

async function addTableToDatabase(database, tableMetainfo) {
    try {
        var json = JSON.stringify({
                databaseName: database,
                tableMetainfo: tableMetainfo
            });

        console.log(json);

        const response = await fetch(`/database/table`, {
            method: 'POST',
            body: json
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const responseStatus = await response.json();

        return responseStatus;
    } catch (error) {
        console.error('Ошибка запроса:', error);
    }
}

async function deleteTableFromDatabase(database, tableName) {
    try {
        const response = await fetch(
            `/database/table?database-name=${database}&table-name=${tableName}`, 
            {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const responseStatus = await response.json();

        return responseStatus;
    } catch (error) {
        console.error('Ошибка запроса:', error);
    }
}

async function getTableData(database, table, filter = null) {
    try {
        const filterText = filter != null ? "&filter=" + filter : "";

        const response = await fetch(
            `/table/data?database=${database}&table=${table}${filterText}`, 
            {
            method: 'GET'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const responseStatus = await response.json();

        console.log(responseStatus);

        return responseStatus;
    } catch (error) {
        console.error('Ошибка запроса:', error);
    }
}

async function addRowValues(request) {
    try {
        var json = JSON.stringify(request);

        console.log(json);

        const response = await fetch(`/table/add-row`, {
            method: 'POST',
            body: json
        });

        const responseStatus = await response.json();

        console.log(responseStatus);

        return responseStatus;
    } catch (error) {
        console.error('Ошибка запроса:', error);
    }
}

async function deleteRow(request) {
    try {
        var json = JSON.stringify(request);

        console.log(json);

        const response = await fetch(`/table/delete-row`, {
            method: 'POST',
            body: json
        });

        const responseStatus = await response.json();

        console.log(responseStatus);

        return responseStatus;
    } catch (error) {
        console.error('Ошибка запроса:', error);
    }
}

