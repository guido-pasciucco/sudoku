var numSelected = null;
var titleSelecter = null;
const errors = 0;

const board = [
    "--74916-5",
    "2---6-3-9",
    "-----7-1-",
    "-586----4",
    "--3----9-",
    "--62--187",
    "9-4-7---2",
    "67-83----",
    "81--45---"
];

const solution = [
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

window.onload = () => setGame();

const setGame = () => {
    /* create digits 1 - 9 */
    for (let i = 1; i <= 9; i++) {
        let number = document.createElement("div");
        number.id = i;
        number.innerText = i;
        number.addEventListener("click", selectNumber);
        number.classList.add("number");
        document.getElementById("digits").appendChild(number);
    }
    /* create 9x9 board */
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++){
            let tile = document.createElement("div");
            tile.id = `${r.toString()}-${c.toString()}`;
            
            tile.addEventListener("click", selectTile)
            
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
        }
    }
}

/* ver porque no funciona, no se pone el fondito gris */
const selectNumber = () => {
    if(numSelected != null){
        numSelected.classList.remove("number-selected")
    }
    numSelected = this;
    numSelected.classList.add("number-selected");
};

const selectTile = () => {
    if(numSelected){
        this.innerText = numSelected.id;
    }
}


// dejé el video en 19:50



