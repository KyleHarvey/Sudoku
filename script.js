function Sudoku(puzzle) {
    var sudoku = document.getElementById('sudoku');
    var spaces = document.querySelectorAll("#sudoku table input");
    var autoNotes = false;
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
                //add span for notes
                spaces[row*9+col].insertAdjacentHTML('afterend', '<span class="notes"></span>');
                if(puzzle[row][col] !== 0) {
                    spaces[row*9+col].value = puzzle[row][col];
                    spaces[row*9+col].readOnly = true;
                    spaces[row*9+col].tabIndex = -1;
                }
            }
        }
    };

    //
    //returns values against row / column
    function getConflictValues(row,col) {
        var i,arr = [];
        for(i=0; i<9; i++) {
            if( spaces[row*9+i].value && row*9+i !== row*9+col) {
                arr.push(parseInt(spaces[row*9+i].value, 10));
            }
            if( spaces[i*9+col].value && i*9+col !== row*9+col ) {
                arr.push(parseInt(spaces[i*9+col].value, 10));
            }
        }

        //check pod
        var podRow = Math.floor(row/3)*3;
        var podCol = Math.floor(col/3)*3;
        for(i=podRow; i<podRow+3; i++) {
            for(j=podCol; j<podCol+3; j++) {
                if(spaces[i*9+j].value  && i*9+j !== row*9+col) {
                    arr.push(parseInt(spaces[i*9+j].value,10));
                }
            }
        }
        return arr;
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
    function checkMove(evt) {
        evt.target.classList.add('num');
        setTimeout(function() {
            evt.target.select(); //keep selected for ux
            if(autoNotes) {
                getNotes();
            }
            checkWin();
        }, 0);
    }

    //
    //add user note
    function userNotes(evt) {
        var el,v,notes;
        el = evt.target.nextSibling;
        v = String.fromCharCode(evt.keyCode);
        notes = el.textContent.split('');
        if(notes.indexOf(v) >= 0) {
            notes.splice(notes.indexOf(v), 1);
        } else {
            notes.push(v);
        }
        el.innerHTML = notes.sort().join('');
    }
    function getNotes() {
        var starterNotes = [1,2,3,4,5,6,7,8,9], notes;
        Array.prototype.forEach.call(spaces, function(el) {
            if(!el.value) {
                var arr = getConflictValues(parseInt(el.dataset.x, 10), parseInt(el.dataset.y, 10));
                notes = starterNotes.filter(function(e) {
                    return arr.indexOf(e) < 0;
                });
                el.nextSibling.innerHTML = notes.join('');
            }
        });
    }

    //Navigate puzzle with arrow keys
    function moveFocus(num) {
        if (num >= 0 && num < 81) {
            spaces[num].focus();
        }
    }
    function keyDown(evt) {
        var space = parseInt(evt.target.dataset.x) * 9  + parseInt(evt.target.dataset.y);
        switch(evt.which) {
            case 37: // left
                moveFocus(space-1);
                break;
            case 38: // up
                moveFocus(space-9);
                break;
            case 39: // right
                moveFocus(space+1);
                break;
            case 40: // down
                moveFocus(space+9);
                break;
            case 78: // n key (toggle notes)
                toggleNotes.checked = !toggleNotes.checked;
                evt.preventDefault();
                break;

            default: return;
        }
        evt.preventDefault();
    };

    //event listeners
    sudoku.addEventListener('keydown', keyDown, false);
    var toggleNotes = document.getElementById('tnotes');
    sudoku.addEventListener('keypress', function(evt) {
        if (evt.keyCode > 48 && evt.keyCode < 58) {
            if(toggleNotes.checked) {
                evt.preventDefault();
                userNotes(evt);
            } else {
                checkMove(evt);
            }
        } else {
            evt.preventDefault();
        }
    }, false); //any change to input
    sudoku.addEventListener('keyup', function(evt) {
        if (evt.keyCode == 8) {
            evt.target.classList.remove('num');
        }
    }, false);
    var aNotes = document.getElementById('autonotes');
    aNotes.addEventListener('click', function() {
        autoNotes = !autoNotes;
        if(autoNotes) {
            getNotes();
        }
    });
    sudoku.addEventListener('focus', function(evt) { 
        if (evt.target.matches('input')) {
            evt.target.select(); 
        }
    }, true);
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
     //[[5,3,0,0,7,8,9,1,2],
      //[6,7,2,1,9,5,3,4,8],
      //[1,9,8,3,4,2,5,6,7],
      //[8,5,9,7,6,1,4,2,3],
      //[4,2,6,8,5,3,7,9,1],
      //[7,1,3,9,2,4,8,5,6],
      //[9,6,1,5,3,7,2,8,4],
      //[2,8,7,4,1,9,6,3,5],
      //[3,4,5,2,8,6,1,7,9]]
