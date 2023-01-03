/*


var numSelected = null;
var tileSelected = null;

var errors = 0;

var board = [
    "--74916-5",
    "2---6-3-9",
    "-----7-1-",
    "-586----4",
    "--3----9-",
    "--62--187",
    "9-4-7---2",
    "67-83----",
    "81--45---"
]

var solution = [
    "387491625",
    "241568379",
    "569327418",
    "758619234",
    "123784596",
    "496253187",
    "934176852",
    "675832941",
    "812945763"
]

window.onload = function() {
    setGame();
}

function setGame() {
    // Digits 1-9
    for (let i = 1; i <= 9; i++) {
        let number = document.createElement("div");
        number.id = i
        number.innerText = i;
        number.addEventListener("click", selectNumber);
        number.classList.add("number");
        document.getElementById("digits").appendChild(number);
    }
    
    // Board 9x9
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            if (board[r][c] != "-") {
                tile.innerText = board[r][c];
                tile.classList.add("tile-start");
            }
            if (r == 2 || r == 5) {
                tile.classList.add("horizontal-line");
            }
            if (c == 2 || c == 5) {
                tile.classList.add("vertical-line");
            }
            tile.addEventListener("click", selectTile);
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
        }
    }
}

function selectNumber(){
    if (numSelected != null) {
        numSelected.classList.remove("number-selected");
    }
    numSelected = this;
    numSelected.classList.add("number-selected");
}

function selectTile() {
    if (numSelected) {
        if (this.innerText != "") {
            return;
        }
        let coords = this.id.split("-");
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);
        if (solution[r][c] == numSelected.id) {
            this.innerText = numSelected.id;
        }
        else {
            errors += 1;
            document.getElementById("errors").innerText = errors;
        }
    }
}
*/

const cellHolder = document.getElementById("cellHolder");

for (i = 0; i <= 80; i++) {
    cellHolder.innerHTML += `<input id="cell-${i}" class="cell" maxlength=1 max=9 min=1 onchange="validate_cells();">`;
    if (i === 8 || i === 17 || i === 26 || i === 35 || i === 44 || i === 53 || i === 62 || i === 71 || i === 80) {
        cellHolder.innerHTML += `<br>`
    }
}

const read_grid = () => {
    var grid = [];
    for (var i = 0; i < 81; i++) {
        var val = document.getElementById('cell-' + i).value;
        if (is_int(val) && val > 0 && val < 10) val = parseInt(val);
        else val = 0;
        grid.push(val);
    }
    return grid;
}

const write_grid = (grid, read_only) => {
    for (var i = 0; i < 81; i++) {
        if (grid[i] === 0) document.getElementById('cell-' + i).value = '';
        else {
            document.getElementById('cell-' + i).value = grid[i];
            if (read_only) {
                document.getElementById('cell-' + i).readOnly = true;
                document.getElementById('cell-' + i).classList.add('cell-readonly');
            }
        }
    }
}

const solution = (grid) => {
    var new_grid = grid.slice();
    var possible = [];

    for (var i = 0; i < 81; i++) {
        if (grid[i] !== 0) continue;
        var item = {};
        item.index = i;
        item.poss = possible_number(grid, i);
        possible.push(item);
    }
    if (possible.length === 0) return grid;

    possible.sort((a, b) => (a.poss.length > b.poss.length) ? 1 : ((b.poss.length > a.poss.length) ? -1 : 0));

    if (possible[0].poss.length === 0) return grid;
    for (const val of possible[0].poss) {
        new_grid[possible[0].index] = val;
        new_grid = solution(new_grid);
        if (check_completed(new_grid)) return new_grid;
        new_grid = grid.slice();
    }
    return grid;
}

const possible_number = (grid, i) => {
    var possible = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    possible = check_row(grid, i, possible);
    possible = check_column(grid, i, possible);
    possible = check_square(grid, i, possible);
    return possible;
}

const check_square = (grid, i, possible) => {
    for (const j of get_square(i)) {
        if (grid[j] !== 0) possible = remove_from_arr(possible, grid[j]);
    }
    return possible;
}

const check_row = (grid, i, possible) => {
    for (const j of get_row(i)) {
        if (grid[j] !== 0) possible = remove_from_arr(possible, grid[j]);
    }
    return possible;
}

const check_column = (grid, i, possible) => {
    for (const j of get_column(i)) {
        if (grid[j] !== 0) possible = remove_from_arr(possible, grid[j]);
    }
    return possible;
}

const check_completed = (grid) => {
    for (var i = 0; i < 81; i++) {
        if (grid[i] === 0) return false;
    }
    return true;
}

const valid_grid = (grid) => {
    var arr = [];

    for (var i = 0; i < 73; i += 9) {
        for (const j of get_row(i)) {
            if (grid[j] === 0) continue;
            if (arr.includes(grid[j])) return false;
            arr.push(grid[j]);
        }
        arr = [];
    }

    for (var i = 0; i < 9; i++) {
        for (const j of get_column(i)) {
            if (grid[j] === 0) continue;
            if (arr.includes(grid[j])) return false;
            arr.push(grid[j]);
        }
        arr = [];
    }

    for (const i of [0, 3, 6, 27, 30, 33, 54, 57, 60]) {
        for (const j of get_square(i)) {
            if (grid[j] === 0) continue;
            if (arr.includes(grid[j])) return false;
            arr.push(grid[j]);
        }
        arr = [];
    }
    return true;
}

const new_sudoku_old = (x) => {
    var empty_cells = [];
    for (var i = 0; i < 81; i++) empty_cells.push(i);
    clean();
    var grid = read_grid();

    for (var i = 0; i < x; i++) {
        var index, val;

        while (1) {
            var previous_grid = grid.slice();
            index = empty_cells[get_rand_int(0, empty_cells.length - 1)];
            val = get_rand_int(1, 9);
            grid[index] = val;
            if (valid_grid(grid) && check_completed(solution(grid))) {
                empty_cells = remove_from_arr(empty_cells, index);
                break;
            }
            grid = previous_grid.slice();
        }
    }
    write_grid(grid, true);
}

const new_sudoku = (x) => {
    var empty_cells = [];
    for (var i = 0; i < 81; i++) empty_cells.push(i);
    clean();
    var grid = read_grid();

    for (var i = 0; i < x; i++) {
        var index, val;
        while (1) {
            var previous_grid = grid.slice();
            index = empty_cells[get_rand_int(0, empty_cells.length - 1)];
            var possible = possible_number(grid, index);
            if (possible.length === 0) continue;
            val = possible[get_rand_int(0, possible.length - 1)];
            grid[index] = val;
            if (valid_grid(grid) && check_completed(solution(grid))) {
                empty_cells = remove_from_arr(empty_cells, index);
                break;
            }
            grid = previous_grid.slice();
        }
    }
    write_grid(grid, true);
}

const validate_cell_value = (id) => {
    var element = document.getElementById('cell-' + id);
    if (element.value.length == 0) return true;
    if (!is_int(element.value)) return false;
    var val = parseInt(element.value);
    var possible = [val];
    var grid = read_grid();
    grid[id] = 0;

    if (check_row(grid, id, possible).length === 0) {
        for (const i of get_row(id)) document.getElementById('cell-' + i).classList.add('cell-wrong');
        return false;
    }
    if (check_column(grid, id, possible).length === 0) {
        for (const i of get_column(id)) document.getElementById('cell-' + i).classList.add('cell-wrong');
        return false;
    }
    if (check_square(grid, id, possible).length === 0) {
        for (const i of get_square(id)) document.getElementById('cell-' + i).classList.add('cell-wrong');
        return false;
    }
    return true;
}

const get_row = (i) => {
    var res = [];
    var row_num = Math.floor(i / 9);
    for (var j = row_num * 9; j < (row_num * 9 + 9); j++) res.push(j);
    return res;
}

const get_column = (i) => {
    var res = [];
    var column_num = i % 9;
    for (var j = column_num; j < 81; j += 9) res.push(j);
    return res;
}

const get_square = (i) => {
    var res = [];
    var squares = [
        [0, 1, 2, 9, 10, 11, 18, 19, 20],
        [3, 4, 5, 12, 13, 14, 21, 22, 23],
        [6, 7, 8, 15, 16, 17, 24, 25, 26],

        [27, 28, 29, 36, 37, 38, 45, 46, 47],
        [30, 31, 32, 39, 40, 41, 48, 49, 50],
        [33, 34, 35, 42, 43, 44, 51, 52, 53],

        [54, 55, 56, 63, 64, 65, 72, 73, 74],
        [57, 58, 59, 66, 67, 68, 75, 76, 77],
        [60, 61, 62, 69, 70, 71, 78, 79, 80]
    ];

    for (var j = 0; j < 9; j++) {
        if (!squares[j].includes(i)) continue;
        squares[j].forEach(el => { res.push(el) });
    }
    return res;
}

//--------------

const clean = () => {
    document.getElementById('status').innerHTML = '';
    for (var i = 0; i < 81; i++) {
        document.getElementById('cell-' + i).value = '';
        document.getElementById('cell-' + i).readOnly = false;
        document.getElementById('cell-' + i).classList.remove('cell-readonly');
        document.getElementById('cell-' + i).classList.remove('cell-wrong');
    }
}

const solve = () => {
    document.getElementById('status').innerHTML = '';
    var grid = read_grid();
    if (valid_grid(grid)) {
        grid = solution(grid);
        status = (check_completed(grid)) ? 'Solved' : 'Not solvable';
        document.getElementById('status').innerHTML = status;
        write_grid(grid, false);
    } else {
        document.getElementById('status').innerHTML = 'Input is not valid';
    }
};

const easy = () => new_sudoku(35);
const medium = () => new_sudoku(27);
const hard = () => new_sudoku(20);

const validate_cells = () => {
    for (var i = 0; i < 81; i++) document.getElementById('cell-' + i).classList.remove('cell-wrong-border', 'cell-wrong');
    for (var i = 0; i < 81; i++) {
        if (!validate_cell_value(i)) document.getElementById('cell-' + i).classList.add('cell-wrong-border');
    }
    if (check_completed(read_grid())) document.getElementById('status').innerHTML = 'Solved';
}

const reset = () => {
    for (var i = 0; i < 81; i++) {
        var element = document.getElementById('cell-' + i);
        if (element.readOnly == false) {
            element.value = '';
        }
        element.classList.remove('cell-wrong-border', 'cell-wrong');
    }
    document.getElementById('status').innerHTML = '';
}

const is_int = (value) => {
    return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
}

const remove_from_arr = (arr, item) => {
    var new_arr = [];
    arr.forEach(el => { if (el !== item) new_arr.push(el) });
    return new_arr;
}

const get_rand_int = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}