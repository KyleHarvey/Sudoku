function Sudoku(puzzle) {
    var sudoku = document.getElementById('sudoku');
    var spaces = document.querySelectorAll("#sudoku table input");
    fillPuzzle();

    //
    //Add puzzle to DOM
    function fillPuzzle() {
        var row,col;
        for(row=0; row<9; row++) {
            for(col=0; col<9; col++) {
                //add data-(x/y) to spaces for specific access
                spaces[row*9+col].dataset.x = row;
                spaces[row*9+col].dataset.y = col;
                if(puzzle[row][col] !== 0) {
                    spaces[row*9+col].value = puzzle[row][col];
                    spaces[row*9+col].readOnly = true;
                    spaces[row*9+col].tabIndex = -1;
                }
            }
        }
    };

    //
    //cycle through all values and return true if it doesn't exist.
    function valid(row,col,v) {
        var i,arr = [];
        for(i=0; i<9; i++) {
            if( 
                spaces[row*9+i].value == v && row*9+i !== row*9+col || //check row
                spaces[i*9+col] == v && i*9+col !== row*9+col //check column
            ) {
                return false;
            }
        }

        //check pod
        var podRow = Math.floor(row/3)*3;
        var podCol = Math.floor(col/3)*3;
        for(i=podRow; i<podRow+3; i++) {
            for(j=podCol; j<podCol+3; j++) {
                if(!spaces[i*9+j].classList.contains('wrong') && spaces[i*9+j].value == v  && i*9+j !== row*9+col) {
                    return false;
                }
            }
        }
        return true;
    }
    //
    //Check if all spaces are full and valid
    function checkWin() {
        var i,x,y,v;
        for(i=0; i<81; i++) {
            x = parseInt(spaces[i].dataset.x, 10);
            y = parseInt(spaces[i].dataset.y, 10);
            v = spaces[i].value;
            if ( !v || !valid(x, y, v)) {
                return;
            }
        }
        sudoku.classList.add('winner');
    }

    //
    //change to input: make sure input is num and check for winner.
    function checkMove(e) {
        var x,y,v;
        x = parseInt(e.target.dataset.x, 10);
        y = parseInt(e.target.dataset.y, 10);
        v = e.target.value;
        if(v.match(/[1-9]/)) { //if value is 1-9 
            e.target.select(); //keep selected for ux
            e.target.classList.add('num');
            checkWin();
        } else { //value deleted or is not valid
            e.target.value = ''; 
            e.target.classList.remove('num');
            e.target.classList.remove('wrong');
        }
    }

    //event listeners
    sudoku.addEventListener('input', checkMove, false); //any change to input
};
Sudoku(
   [[5,3,0,0,7,0,0,0,0],
    [6,0,0,1,9,5,0,0,0],
    [0,9,8,0,0,0,0,6,0],
    [8,0,0,0,6,0,0,0,3],
    [4,0,0,8,0,3,0,0,1],
    [7,0,0,0,2,0,0,0,6],
    [0,6,0,0,0,0,2,8,0],
    [0,0,0,4,1,9,0,0,5],
    [0,0,0,0,8,0,0,7,9]]
);
