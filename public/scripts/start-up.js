// Тут все стартовые действия (как только фронтенд загрузился)

(async () => { 
    var databases = await getDatabases();

    renderSelectWithDatabases(databases)
    await renderDatabaseTables();
    
    await initDatabaseSelectComponent(); 
    await initDatabaseAddingComponent();
    await addDeleteTableEventListener();
    await viewTableEventListener();
    addTableViewButtonListener();
})();

async function initDatabaseSelectComponent() {
    document.getElementById('database-select').addEventListener('change', async function(event) {
        const selectedValue = event.target.value;
        
        var databaseAddingForm = document.getElementById("add-database-form");
        if(selectedValue === "add"){
            document.getElementById('database-tables-controll').style.display = "none";
            document.getElementById("main-content").style.display = "none";
            document.getElementById('adding-database-message').textContent = "";

            databaseAddingForm.style.display = 'block';
        }
        else{
            databaseAddingForm.style.display = 'none';
            document.getElementById("main-content").style.display = "block";

            await renderDatabaseTables();
        }

        console.log('Выбрано:', selectedValue);
    });
}

async function initDatabaseAddingComponent() {
    document.getElementById('adding-database-button').addEventListener('click', async function() {
        document.getElementById('adding-database-message').textContent = "";
        
        const newDatabaseName = document.getElementById('adding-database-name-input').value;
        
        console.log('Кнопка добавления базы данных нажата! Значение: ' + newDatabaseName);

        if(newDatabaseName === ""){
            document.getElementById('adding-database-message').textContent = "Название не вписано";

            return;
        }
        
        var addingStatus = await addNewDatabase(newDatabaseName);

        document.getElementById('adding-database-name-input').value = "";
        if(!addingStatus.success) {
            console.log('Не удача!!! Ошибка: ' + addingStatus.error);
                
            document.getElementById('adding-database-message').textContent = addingStatus.error;

            return;
        }

        var databases = await getDatabases();

        var lastDatabaseName = null;
        if(databases.length > 0){
            lastDatabaseName = databases.at(-1);
        }

        renderSelectWithDatabases(databases, lastDatabaseName);
        document.getElementById("add-database-form").style.display = "none";
        document.getElementById("main-content").style.display = "block";
    });
}

function renderSelectWithDatabases(databases, pickDatabaseName = null){
    var selectComponent = document.getElementById('database-select');

    selectComponent.innerHTML = "";
    for(let database of databases){
        selectComponent.innerHTML += 
            `<option value="${database}">${database}</option>`;
    }

    selectComponent.innerHTML += 
        `<option value="add">+</option>`;

    if(databases.length <= 0){
        document.getElementById("add-database-form").style.display = "block";
    }

    if(pickDatabaseName !== null){
        console.log("Было прошено отобразить " + pickDatabaseName);
        selectComponent.value = pickDatabaseName;
        renderDatabaseTables();
    }
}

async function renderDatabaseTables(){
    var databaseName = document.getElementById('database-select').value;

    if(databaseName === 'add'){
        return;
    }

    var tables = await getDatabaseTables(databaseName);

    document.getElementById('database-tables-controll').style.display = "block";
    document.getElementById('database-tables-message').innerHTML = "Тут таблицы для бд " + databaseName; 

    if(tables.length > 0){
        document.getElementById('database-tables-table').style.display = "block";

        var tableBody = document.getElementById("database-tables-table-body");
        tableBody.innerHTML = "";
        for(let table of tables){
            tableBody.innerHTML += 
                `<tr>` +
                `<td>${table}</td>` +
                `<td><button class="view-table-button" data-table-name="${table}">Посмотреть</button></td>` +
                `<td><button class="delete-table-button" data-table-name="${table}">Удалить</button></td>` +
                `</tr>`;
        }
    }
    else{
        document.getElementById('database-tables-table').style.display = "none";
        document.getElementById('database-tables-message').innerHTML = "Тут таблицы для бд " + databaseName + ". Таблиц нет."; 
    }
}

async function addDeleteTableEventListener(){
    document.getElementById('database-tables-table-body').addEventListener('click', async (event) => {
        if (event.target.classList.contains('delete-table-button')) {
            const tableName = event.target.getAttribute('data-table-name');
            
            var databaseName = document.getElementById('database-select').value;

            console.log(`Удалить таблицу: ${tableName} у бд ${databaseName}`);

            var status = await deleteTableFromDatabase(databaseName, tableName);

            console.log(`Удалена таблицу: ${tableName} ${status.success}`);

            await renderDatabaseTables();
        }
    });
}

async function viewTableEventListener(){
    document.getElementById('database-tables-table-body').addEventListener('click', async (event) => {
        if (event.target.classList.contains('view-table-button')) {
            document.getElementById('table-adding').style.display = "none";
            document.getElementById('table-view').style.display = "block";

            var tableName = event.target.getAttribute('data-table-name');
            var databaseName = document.getElementById('database-select').value;
            console.log(`Посмотреть таблицу: ${tableName}`);

            var tableData = await getTableData(databaseName, tableName);

            var htmlTable = generateTableFromData(tableData);

            var tableViewData = document.getElementById('table-view-data');
            tableViewData.innerHTML = htmlTable;

            generateInputs(tableData, tableName);
        }
    });
}

function addTableViewButtonListener(){
    document.getElementById('table-adding-button-open-view').addEventListener('click', (event) => {
        document.getElementById('table-adding').style.display = "block";
        document.getElementById('table-view').style.display = "none";
        document.getElementById('table-columns-container').innerHTML = "";
    });
}