
<div class="container">
    <div class="sidebar">
        <select name="db-names" id="database-select"></select>

        <div id="add-database-form" style="display: none">
            <h2>Добавление базы данных</h2>
            <input type="text" id="adding-database-name-input" placeholder="Название базы данных"></input>
            <span id="adding-database-message" style="color: red"></span>
            <button id="adding-database-button">Добавить</button>
        </div>

        <div id="database-tables-controll" style="display: none">
            <p id="database-tables-message"></p>

            <table id="database-tables-table" style="display: none">
                <thead>
                    <tr>
                        <th>Название таблицы</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody id="database-tables-table-body">
                </tbody>
            </table>

            <button id="table-adding-button-open-view">Добавить таблицу</button>
        </div>
    </div>
    
    <div class="main-content" id="main-content">
        <div class="table-adding" id="table-adding" style="display:none">
            <h2>Добавление таблицы</h2>
            <input type="text" id="new-table-name-input" placeholder="Название таблицы данных" style="display:block"></input>
            <span id="adding-table-message" style="color:red"></span>
            
            <div class="table-columns-container" id="table-columns-container">
            </div>

            <button id="adding-table-column-button">Добавить колонку</button>
            <button id="adding-table-button" style="margin-top:20px;display:block">Добавить</button>
        </div>

        <div class="table-view" id="table-view" style="display:none">
            <h2>Просмотр данных в таблице</h2>
            
            <span>WHERE</span>
            <input type="text" id="table-view-filter"></input>
            <button type="text" id="filter-button">Применить</button>

            <div id="table-view-data">
                <-- сюда генерация таблицы с данными
            </div>

            <div id="table-view-data-add" style="margin-top:20px">
                <div id="table-view-data-inputs">
                    <-- сюда генерация инпутов по колонкам
                </div>
                <div id="table-view-row-add-message" style="color: red"></div>
                <button id="table-view-data-add-button">Создать</button>
            </div>
        </div>
    </div>
</div>
