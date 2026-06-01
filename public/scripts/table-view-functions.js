(async () => {
    addClickListenerToTableColumnAdderButton();
    await addClickListenerToTableAdderButton();
    await addClickListenerToFilterButton();
    await addClickListenerToAddRowButton();
    await addClickListenerToDeleteRowButton();
})();

function addClickListenerToTableColumnAdderButton(){
    document
        .getElementById("adding-table-column-button")
        .addEventListener("click", addColumn);
}

async function addClickListenerToTableAdderButton(){
    document
        .getElementById("adding-table-button")
        .addEventListener("click", addTable);
}

async function addTable(){
    var newTableNameInput = document.getElementById("new-table-name-input");
    var tableColumnsContainer = document.getElementById("table-columns-container");
    var addingTableMessageSpan = document.getElementById("adding-table-message");
    
    addingTableMessageSpan.innerText = "";
    var newTableName = newTableNameInput.value;

    var tableMetainfoResponse = {
        tableName: newTableName,
        columns: []
    };

    for (const child of tableColumnsContainer.children) {
        const inputs = child.querySelectorAll('input');
        const columnName = inputs[0].value;
        const columnType = inputs[1].value;

        tableMetainfoResponse.columns.push({
            columnName: columnName,
            columnType: columnType
        });
    }

    console.log(tableMetainfoResponse);

    var result = await addTableToDatabase(
        document.getElementById('database-select').value, 
        tableMetainfoResponse);

    console.log(result);
    if(!result.success) {
        addingTableMessageSpan.innerText = result.error;

        return;
    }

    newTableNameInput.value = "";
    tableColumnsContainer.innerHTML = "";

    renderDatabaseTables();
}

function addColumn(){
    tableColumnsContainer = document.getElementById("table-columns-container");

    tableColumnsContainer.insertAdjacentHTML('beforeend',
        `<div>` +
        `<input type="text" placeholder="Название колонки"></input>` +
        `<input type="text" placeholder="Тип колонки"></input>` +
        `<button onclick="this.parentElement.remove()">Удалить</button>` +
        `</div>`
    );
}

function generateTableFromData(response) {
    let html = '<table>';

    html += '<thead><tr>';
    response.columns.forEach(col => {
        html += `<th>${col}</th>`;
    });
    html += '<th></th></tr></thead>';

    html += '<tbody id="table-row-values">';
    response.data.forEach(item => {
        html += '<tr>';

        var deleteButtonValue = formatDataToQuery(response.columns, item);

        console.log(item);

        response.columns.forEach(col => {
            const value = item[col] !== undefined ? item[col] : '';
            html += `<td>${String(value)}</td>`;
        });
        html += `<td><button class="delete-row-button" data-row-values="${deleteButtonValue}">Удалить</button></td>`

        html += '</tr>';
    });
    html += '</tr></tbody></table>';
    
    return html;
}

function formatDataToQuery(columns, data) {
    const parts = [];
    
    for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        
        // Если значение строка - добавляем кавычки
        const formattedValue = typeof data[column] === 'string' ? `'${data[column]}'` : data[column];
        
        parts.push(`${column} = ${formattedValue}`);
    }
    
    const last = parts.pop();
    return parts.join(" and ") + " and " + last;
}

function generateInputs(response, table) {
    const container = document.getElementById('table-view-data-inputs');
    container.innerHTML = '';
    
    response.columns.forEach(column => {
        const input = document.createElement('input');
        input.type = 'text';
        input.name = "table-view-data-input-name-" + column;
        input.placeholder = column;
        container.appendChild(input);
    });

    const input = document.createElement('input');
    input.type = 'text';
    input.name = table;
    input.id = "table-view-data-input-name-table"
    input.placeholder = table;
    input.style.display = "none"
    container.appendChild(input);
}

async function addClickListenerToFilterButton() {
    document
        .getElementById("filter-button")
        .addEventListener("click", getDataWithFilter);
}

async function getDataWithFilter() {
    var table = document.getElementById("table-view-data-input-name-table").name;
    var database = document.getElementById('database-select').value;
    var filter = document.getElementById("table-view-filter").value;
    
    filter = filter === "" ? null : filter;
    
    console.log(`Посмотреть таблицу: ${table} с фильтром`);

    var tableData = await getTableData(database, table, filter);

    var htmlTable = generateTableFromData(tableData);
    var tableViewData = document.getElementById('table-view-data');
    tableViewData.innerHTML = htmlTable;
}

async function addClickListenerToAddRowButton() {
    document
        .getElementById("table-view-data-add-button")
        .addEventListener("click", addRowButton);
}

async function addRowButton() {
    var messageInput = document.getElementById("table-view-row-add-message");
    messageInput.textContent = "";
    
    const container = document.getElementById('table-view-data-inputs');
    const inputs = container.querySelectorAll('input:not(#table-view-data-input-name-table)');

    var listOfValues = [];
    var listOfFields = [];

    for (const input of inputs) {
        listOfValues.push(input.value);
        listOfFields.push(input.name.replace("table-view-data-input-name-", ""));
    }

    var database = document.getElementById('database-select').value;
    var table = document.getElementById("table-view-data-input-name-table").name;

    var result = await addRowValues({
        table: table,
        database: database,
        listOfFields: listOfFields,
        listOfValues: listOfValues
    });

    if(!result.success){
        messageInput.textContent = result.ex;

        return;
    }

    for (const input of inputs) {
        input.value = "";
    }

    var tableData = await getTableData(database, table);
    var htmlTable = generateTableFromData(tableData);

    var tableViewData = document.getElementById('table-view-data');
    tableViewData.innerHTML = htmlTable;
}

async function addClickListenerToDeleteRowButton() {
    document
        .getElementById("table-view-data")
        .addEventListener("click", deleteRowButton);
}

async function deleteRowButton(event) {
    if (event.target.classList.contains('delete-row-button')) {
        const rowValues = event.target.getAttribute('data-row-values');
        var database = document.getElementById('database-select').value;
        var table = document.getElementById("table-view-data-input-name-table").name;

        var result = await deleteRow({
            table: table,
            database: database,
            rowValues: rowValues 
        });

        var tableData = await getTableData(database, table);
        var htmlTable = generateTableFromData(tableData);

        var tableViewData = document.getElementById('table-view-data');
        tableViewData.innerHTML = htmlTable;   
    }
}