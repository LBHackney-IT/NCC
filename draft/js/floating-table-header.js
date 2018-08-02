(function() {

    window.addEventListener('resize', function() {
        setTimeout(updateTables, 50);
    });
    updateTables();

    function updateTables() {
        var tables = document.querySelectorAll('table.floating-header');

        _iterate(tables, function(table) {
            resizeColumns(table);
        });            
    }

    function readColumns(table) {
        var columns = [];
        var header_cells = table.querySelectorAll('thead th');
        _iterate(header_cells, function(cell) {
            var width = parseFloat(cell.getAttribute('data-width'));
            columns.push(width);
        });
        return columns;
    }

    function resizeColumns(table) {
        var columns = readColumns(table);
        var table_width = table.clientWidth;

        // Find the width of table columns without a width.
        var columns_without_width = 0;
        var unallocated_width = table_width;
        _iterate(columns, function(w) {
            if ( isNaN(w) ) {
                columns_without_width++;
            } else {
                unallocated_width -= w;
            }
        });

        // Set the width of each column in the table.
        // console.log(columns);
        _iterate(columns, function(w, index) {
            // console.log(index, '=>', w);

            index = parseInt(index) + 1;
            var cells = table.querySelectorAll('tr > :nth-child(' + index + ')');
            var first_cell = cells[0];
            first_cell.style.width = w + 'px';

            // Find the minimum possible width of the cells in this column.
            var cell_width = isNaN(w) ? unallocated_width / columns_without_width : w;
            cell_width = Math.min(cell_width, first_cell.clientWidth);

            _iterate(cells, function(cell) {
                cell.style.width = (cell_width / table_width * 100 - .5).toFixed(1) + '%';
                cell.width = isNaN(w) ? '*' : cell_width;
            });
        });
    }

    // conveniently iterate through objects, avoiding inherited properties.
    function _iterate(obj, callback) {
        for ( var key in obj ) {
            if ( obj.hasOwnProperty(key) ) {
                callback.apply(null, [ obj[key], key ]);
            }
        }    
    }

})();