window.onload = function() {
  document.body.style.zoom = "80%";
};

var nombre_de_hint;
nombre_de_hint = 0 ;

var exitAlertEnabled = false;
function enableExitAlert() {
            exitAlertEnabled = true;
            window.addEventListener('beforeunload', handleBeforeUnload);
        }
function disableExitAlert() {
            exitAlertEnabled = false;
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }
function handleBeforeUnload(event) {
            if (exitAlertEnabled) {
                var confirmationMessage = 'Voulez-vous vraiment quitter cette page ?';
                event.returnValue = confirmationMessage; // Gecko, Trident, Chrome 34+
                return confirmationMessage; // Gecko, WebKit, Chrome <34
            }
        }

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function blockForOneSecond() {
    const start = Date.now();
    let now = null;
    do {
        now = Date.now();
    } while (now - start < 1000);
    console.log("retard fait");
}

var numSelected = null;
var tileSelected = null;
var valeur = 0;							//on va utiliser cette valeur dans les niveaux de difficultés
var premieregrill; //on va l'utiliser pour le pdf
var a;               //utilisés dans le temps
var b ;
var c;

function genererGrilleSudoku() {
  const base = 3;
  const side = base * base;

  // Motif pour une solution de base valide, c'est un générateur qui génére des nombres uniques dans 
  // la plage de nombres allant de 0 à (side-1)
  function motif(r, c) {
    return (base * (r % base) + Math.floor(r / base) + c) % side;
  }

  // Randomiser les lignes, les colonnes et les nombres (du motif de base valide)
  function melanger(s) {
    return s.sort(() => Math.random() - 0.5);  // cette fonction effectue un mélange aléatoire des éléments
  } /*	le paramétre () => Math.random() - 0.5) permet d'ordonner le tableaude manière aléatoire
     	en effet lorseque Math.random() - 0.5 est positif , l'élément actuel sera placé 
  		après l'élément suivant dans le tableau trié. Si la différence est négative, l'élément actuel sera placé avant l'élément suivant.*/

  const rBase = Array.from({ length: base }, (_, i) => i); 		//rBase sera un tableau contenant les nombres de 0 à base - 1.  // [0, 1, 2]
  const rows = rBase.flatMap((g) => melanger(rBase).map((r) => g * base + r));
  /*rBase.flatMap((g) => melanger(rBase).map((r) => g * base + r)) est une expression qui utilise flatMap 
  pour transformer chaque élément g de rBase en un tableau de valeurs. Ce tableau est ensuite aplati (flatten) pour créer un seul tableau résultant rows
  map((r) => g * base + r) est utilisé sur le tableau résultant du mélange. Il transforme chaque élément r du tableau 
  en une valeur calculée à l'aide de la formule g * base + r
  particularité g * base + r donne un nombre unique pour chaque combinaison (g, r)
  
  */
  
  const cols = rBase.flatMap((g) => melanger(rBase).map((c) => g * base + c));  
  const nums = melanger(Array.from({ length: base * base }, (_, i) => i + 1));

  // Produire une grille en utilisant le motif de base randomisé
  const grille = rows.map((r) => cols.map((c) => nums[motif(r, c)]));
  /*const grille = [];
   for (const r of rows) {
   const row = [];
   for (const c of cols) {
     row.push(nums[motif(r, c)]);
   }
   grille.push(row);
}*/

  // Formater la grille en une liste de chaînes de caractères
  const grilleFormatee = grille.map((ligne) => ligne.join(""));

  return grilleFormatee;
}


// ici dans l'élimination des chiffres on doit toujours être capable de résoudre la grille sans spéculation
// pour cela on va créer une fonction qui teste la possibilité de resolution




// Fonction pour vérifier si "num" peut être placé dans la ligne "row"
function rowCheck(grid, row, num) {
        for (var j = 0; j < 9; j++) {
            if (grid[row][j] === num) {
                return false;
            }
        }
        return true;
    }
// Fonction pour vérifier si "num" peut être placé dans la colonne "col"
function colCheck(grid, col, num) {
        for (var i = 0; i < 9; i++) {
            if (grid[i][col] === num) {
                return false;
            }
        }
        return true;
    }
// Fonction pour vérifier si "num" peut être placé dans la boîte à laquelle la cellule (row, col) appartient
function boxCheck(grid, row, col, num) {
        var startRow = Math.floor(row / 3) * 3;
        var startCol = Math.floor(col / 3) * 3;
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (grid[startRow + i][startCol + j] === num) {
                    return false;
                }
            }
        }
        return true;
    }

function sudokuSolver(grid) {    
    // Fonction pour trouver une cellule non assignée dans la grille
	var cmpu;
    function findUnassigned(grid) {
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                if (grid[i][j] === "-") {
                    return [i, j];
                }
            }
        }
        return [-1, -1];
    }

    // Trouver une cellule non assignée dans la grille
    var [i, j] = findUnassigned(grid);

    // Si aucune cellule n'est non assignée, la grille est complètement remplie et valide
    if (i === -1 && j === -1) {
        return true;
    }

    // Pour chaque "num" allant de 1 à 9, vérifier s'il peut être placé à "(i,j)"
    for (var num = 1; num <= 9; num++) {     // ici on pourrait effectuer une 
        num = num.toString();

        // "num" peut être placé à "(i,j)" si
        // aucune valeur dans la ligne "i" n'est égale à "num"
        // aucune valeur dans la colonne "j" n'est égale à "num"
        // aucune valeur dans la boîte à laquelle elle appartient n'est égale à "num"
        if (rowCheck(grid, i, num) && colCheck(grid, j, num) && boxCheck(grid, i, j, num)) {
            // Toutes les conditions sont satisfaites

            // Placer temporairement "num" à "(i,j)"
            grid[i] = grid[i].substring(0, j) + num + grid[i].substring(j + 1);
			cmpu = cmpu+1; 
            // Vérifier les cellules suivantes
            
            if (sudokuSolver(grid)) {
                console.log(cmpu);
                return true;
            }

            // Nous sommes arrivés ici parce que le choix que nous avons fait en mettant un certain "num" ici était incorrect
            // Par conséquent, laisser la cellule non assignée pour essayer d'autres possibilités
            grid[i] = grid[i].substring(0, j) + "-" + grid[i].substring(j + 1);
        }
    }

    // Aucune valeur ne peut être placée à "(i,j)", ce qui signifie que nous avons fait un mauvais choix précédemment
    // Si aucune valeur ne peut être placée à "(i,j)", renvoyer false, ce qui signifie que le sudoku actuel n'est pas réalisable, et essayer d'autres possibilités
    return false;
}



var mes_submit;



/*var solution ; /*on commence par générer la solution

solution= genererGrilleSudoku();*/

var test;// cette déclaration va être utilisée dans le hint
var test2;

// ici on effectue l'elimination de valeurs selon leniveau de difficulté

var chiffresRemplaces;
var grilleModifiee;
var val_limite;
var ligne;
var colonne;
let val_limite_1;
let val_limite_2;
let val_limite_3;
var grille_test;

/*function remplacerChiffresAleatoires(grille,valeur) {
 
  chiffresRemplaces = new Set();
  grilleModifiee = grille.slice(); // Crée une copie de la grille d'origine

  
  if(valeur == 0){
	  //let val_limite;  	 
  	  val_limite = Math.floor(Math.random() * 3) + 44;
	  while (chiffresRemplaces.size < val_limite) { // nombre aleatoire entre 44 et 46
	    ligne = Math.floor(Math.random() * grille.length);
	    colonne = Math.floor(Math.random() * grille[0].length);
	
	    if (!chiffresRemplaces.has(`${ligne}-${colonne}`)) {
	      grilleModifiee[ligne] = grilleModifiee[ligne].substring(0, colonne) + "-" + grilleModifiee[ligne].substring(colonne + 1);
	      chiffresRemplaces.add(`${ligne}-${colonne}`);
	    }
	  	}	
	  	
     } 
  if(valeur==1){
	  //let val_limite_1;
	  val_limite_1 = 	Math.floor(Math.random() * 5) + 46;
	  while (chiffresRemplaces.size <  val_limite_1) {
    	ligne = Math.floor(Math.random() * grille.length);
    	colonne = Math.floor(Math.random() * grille[0].length);

	    if (!chiffresRemplaces.has(`${ligne}-${colonne}`)) {
	      grilleModifiee[ligne] = grilleModifiee[ligne].substring(0, colonne) + "-" + grilleModifiee[ligne].substring(colonne + 1);
	      chiffresRemplaces.add(`${ligne}-${colonne}`);
	    }
  	}	
  }
  if(valeur==2){
	  //let val_limite_2;
	  val_limite_2 =  Math.floor(Math.random() * 5) + 50;
	  while (chiffresRemplaces.size < val_limite_2) {
	    ligne = Math.floor(Math.random() * grille.length);
	    colonne = Math.floor(Math.random() * grille[0].length);
	
	    if (!chiffresRemplaces.has(`${ligne}-${colonne}`)) {
	      grilleModifiee[ligne] = grilleModifiee[ligne].substring(0, colonne) + "-" + grilleModifiee[ligne].substring(colonne + 1);
	      chiffresRemplaces.add(`${ligne}-${colonne}`);
	    }
  	}	
  }
  if(valeur==3){
	  //let val_limite_3;
	  val_limite_3 = Math.floor(Math.random() * 3) +54 ;
	  while (chiffresRemplaces.size < val_limite_3) {
	    ligne = Math.floor(Math.random() * grille.length);
	    colonne = Math.floor(Math.random() * grille[0].length);
	
	    if (!chiffresRemplaces.has(`${ligne}-${colonne}`)) {
	      grilleModifiee[ligne] = grilleModifiee[ligne].substring(0, colonne) + "-" + grilleModifiee[ligne].substring(colonne + 1);
	      chiffresRemplaces.add(`${ligne}-${colonne}`);
	    }
	    
  	}	
  }
  //grille_test = grilleModifiee.slice();
 //if (sudokuSolver(grille_test)===true){
	return grilleModifiee;
  //}
 /* else if (sudokuSolver(grille_test)===false){	
	
	return false}  // cette forme de récursivité garanti que la grille admet une solution
										//while(sudokuSolver(grille_test)===false)
}*/

  	var answer2; 
  	var answer;

// ayant maintenant les fonctions pour l'enelevements de valeurs une dernière étape est de faire un test pour ma preeemiere grille ne soit pas erronée
function isValidSudoku(grid) {
  // Vérifier chaque ligne, colonne et bloc
  for (let i = 0; i < 9; i++) {
    if (
      !isValidSet(getRow(grid, i)) ||
      !isValidSet(getColumn(grid, i)) ||
      !isValidSet(getBlock(grid, i))
    ) {
      return false;
    }
  }

  return true;
}

function isValidSet(set) {
  let seen = new Set();
  for (let c of set) {
    if (c !== '-' && seen.has(c)) {
      return false;
    }
    seen.add(c);
  }
  return true;
}

function getRow(grid, rowIndex) {
  return grid[rowIndex];
}

function getColumn(grid, colIndex) {
  let column = '';
  for (let row = 0; row < 9; row++) {
    column += grid[row][colIndex];
  }
  return column;
}

function getBlock(grid, blockIndex) {
  let block = '';
  const startRow = Math.floor(blockIndex / 3) * 3;
  const startCol = (blockIndex % 3) * 3;
  for (let row = startRow; row < startRow + 3; row++) {
    for (let col = startCol; col < startCol + 3; col++) {
      block += grid[row][col];
    }
  }
  return block;
}


/*function makepuzzle(board) {
  var puzzle = [];
  var deduced = Array(81).fill(null);
  var order = [...Array(81).keys()];
  shuffleArray(order);

  for (var i = 0; i < order.length; i++) {
    var pos = order[i];

    if (deduced[pos] === null) {
      puzzle.push({
        pos: pos,
        num: board[pos]
      });
      deduced[pos] = board[pos];
      deduce(deduced);
    }
  }

  shuffleArray(puzzle);

  for (var i = puzzle.length - 1; i >= 0; i--) {
    var e = puzzle[i];
    removeElement(puzzle, i);
    var rating = checkpuzzle(boardforentries(puzzle), board);

    if (rating === -1) {
      puzzle.push(e);
    }
  }

  return boardforentries(puzzle);
}

function ratepuzzle(puzzle, samples) {
  var total = 0;

  for (var i = 0; i < samples; i++) {
    var tuple = solveboard(puzzle);

    if (tuple.answer === null) {
      return -1;
    }

    total += tuple.state.length;
  }

  return total / samples;
}

function checkpuzzle(puzzle, board) {
  if (board === undefined) {
    board = null;
  }

  var tuple1 = solveboard(puzzle);

  if (tuple1.answer === null) {
    return -1;
  }

  if (board != null && !boardmatches(board, tuple1.answer)) {
    return -1;
  }

  var difficulty = tuple1.state.length;
  var tuple2 = solvenext(tuple1.state);

  if (tuple2.answer != null) {
    return -1;
  }

  return difficulty;
}

function solvepuzzle(board) {
  return solveboard(board).answer;
}

function solveboard(original) {
  var board = [].concat(original);
  var guesses = deduce(board);

  if (guesses === null) {
    return {
      state: [],
      answer: board
    };
  }

  var track = [{
    guesses: guesses,
    count: 0,
    board: board
  }];
  return solvenext(track);
}

function solvenext(remembered) {
  while (remembered.length > 0) {
    var tuple1 = remembered.pop();

    if (tuple1.count >= tuple1.guesses.length) {
      continue;
    }

    remembered.push({
      guesses: tuple1.guesses,
      count: tuple1.count + 1,
      board: tuple1.board
    });
    var workspace = [].concat(tuple1.board);
    var tuple2 = tuple1.guesses[tuple1.count];
    workspace[tuple2.pos] = tuple2.num;
    var guesses = deduce(workspace);

    if (guesses === null) {
      return {
        state: remembered,
        answer: workspace
      };
    }

    remembered.push({
      guesses: guesses,
      count: 0,
      board: workspace
    });
  }

  return {
    state: [],
    answer: null
  };
}

function deduce(board) {
  while (true) {
    var stuck = true;
    var guess = null;
    var count = 0; // fill in any spots determined by direct conflicts

    var tuple1 = figurebits(board);
    var allowed = tuple1.allowed;
    var needed = tuple1.needed;

    for (var pos = 0; pos < 81; pos++) {
      if (board[pos] === null) {
        var numbers = listbits(allowed[pos]);

        if (numbers.length === 0) {
          return [];
        } else if (numbers.length === 1) {
          board[pos] = numbers[0];
          stuck = false;
        } else if (stuck) {
          var t = numbers.map(function (val, key) {
            return {
              pos: pos,
              num: val
            };
          });
          var tuple2 = pickbetter(guess, count, t);
          guess = tuple2.guess;
          count = tuple2.count;
        }
      }
    }

    if (!stuck) {
      var tuple3 = figurebits(board);
      allowed = tuple3.allowed;
      needed = tuple3.needed;
    } // fill in any spots determined by elimination of other locations


    for (var axis = 0; axis < 3; axis++) {
      for (var x = 0; x < 9; x++) {
        var numbers = listbits(needed[axis * 9 + x]);

        for (var i = 0; i < numbers.length; i++) {
          var n = numbers[i];
          var bit = 1 << n;
          var spots = [];

          for (var y = 0; y < 9; y++) {
            var pos = posfor(x, y, axis);

            if (allowed[pos] & bit) {
              spots.push(pos);
            }
          }

          if (spots.length === 0) {
            return [];
          } else if (spots.length === 1) {
            board[spots[0]] = n;
            stuck = false;
          } else if (stuck) {
            var t = spots.map(function (val, key) {
              return {
                pos: val,
                num: n
              };
            });
            var tuple4 = pickbetter(guess, count, t);
            guess = tuple4.guess;
            count = tuple4.count;
          }
        }
      }
    }

    if (stuck) {
      if (guess != null) {
        shuffleArray(guess);
      }

      return guess;
    }
  }
}

function figurebits(board) {
  var needed = [];
  var allowed = board.map(function (val, key) {
    return val === null ? 511 : 0;
  }, []);

  for (var axis = 0; axis < 3; axis++) {
    for (var x = 0; x < 9; x++) {
      var bits = axismissing(board, x, axis);
      needed.push(bits);

      for (var y = 0; y < 9; y++) {
        var pos = posfor(x, y, axis);
        allowed[pos] = allowed[pos] & bits;
      }
    }
  }

  return {
    allowed: allowed,
    needed: needed
  };
}

function posfor(x, y, axis) {
  if (axis === undefined) {
    axis = 0;
  }

  if (axis === 0) {
    return x * 9 + y;
  } else if (axis === 1) {
    return y * 9 + x;
  }

  return [0, 3, 6, 27, 30, 33, 54, 57, 60][x] + [0, 1, 2, 9, 10, 11, 18, 19, 20][y];
}

function axismissing(board, x, axis) {
  var bits = 0;

  for (var y = 0; y < 9; y++) {
    var e = board[posfor(x, y, axis)];

    if (e != null) {
      bits |= 1 << e;
    }
  }

  return 511 ^ bits;
}

function listbits(bits) {
  var list = [];

  for (var y = 0; y < 9; y++) {
    if ((bits & 1 << y) != 0) {
      list.push(y);
    }
  }

  return list;
}


function pickbetter(b, c, t) {
  if (b === null || t.length < b.length) {
    return {
      guess: t,
      count: 1
    };
  } else if (t.length > b.length) {
    return {
      guess: b,
      count: c
    };
  } else if (randomInt(c) === 0) {
    return {
      guess: t,
      count: c + 1
    };
  }

  return {
    guess: b,
    count: c + 1
  };
}

function boardforentries(entries) {
  var board = Array(81).fill(null);

  for (var i = 0; i < entries.length; i++) {
    var item = entries[i];
    var pos = item.pos;
    var num = item.num;
    board[pos] = num;
  }

  return board;
}

function boardmatches(b1, b2) {
  for (var i = 0; i < 81; i++) {
    if (b1[i] != b2[i]) {
      return false;
    }
  }

  return true;
}

function randomInt(max) {
  return Math.floor(Math.random() * (max + 1));
}

function shuffleArray(original) {
  // Swap each element with another randomly selected one.
  for (var i = original.length - 1; i > 0; i--) {
    var j = randomInt(i);
    var contents = original[i];
    original[i] = original[j];
    original[j] = contents;
  }
}
function removeElement(array, from, to) {
  var rest = array.slice((to || from) + 1 || array.length);
  array.length = from < 0 ? array.length + from : from;
  return array.push.apply(array, rest);
}
/*module.exports = {
  makepuzzle: function () {
    return makepuzzle(solvepuzzle(Array(81).fill(null)));
  solvepuzzle: solvepuzzle,
  ratepuzzle: ratepuzzle,
  posfor: posfor
};/*
  },*/


window.onload = function() {
	  document.body.style.zoom = "80%";
	// Récupérer l'email depuis le localStorage
	var email = localStorage.getItem('email');
	console.log(email);
	
      // Créer une WebSocket
      let websocket = new WebSocket("ws://localhost:8083/zPFA_Sudoku/userstatistics");

      // Lorsque la connexion est ouverte
      websocket.onopen = function(_event) {
        websocket.send(email); // Envoyer l'email à la WebSocket
      };

      // Lorsque des données sont reçues de la WebSocket
      websocket.onmessage = function(event) {
        let userStatistics = event.data; // Les statistiques de l'utilisateur sous forme de chaîne de caractères
        console.log(userStatistics);
        //document.getElementById("userStatistics").innerText = userStatistics; // Afficher les statistiques dans la page
		 // Sélectionnez l'élément aside
	 	let asideElement = document.getElementById("dynamicAside");
		
  	 // Modifiez le contenu de l'aside
	 	asideElement.innerHTML = userStatistics;
      };

      // Gérer les erreurs de la WebSocket
      websocket.onerror = function(event) {
        console.error("Erreur WebSocket : ", event);
      };
    

  
  
  
const boardElement = document.getElementById("board");
boardElement.innerHTML = `
  <div class="welcome-section" style="background-image: url('belle_image_bienvenue_.jpg');">
    <h2 style="font-size: 17px;">Bienvenue au Sudoku !</h2>
    <p style="font-size: 17px;">
      Le Sudoku est un jeu de logique fascinant qui a été inventé dans les années 1970. Il est devenu rapidement populaire dans le monde entier.
    </p>
    <p style="font-size: 17px;">
      L'objectif du Sudoku est de remplir une grille 9x9 avec des chiffres de 1 à 9, de telle sorte que chaque colonne, chaque ligne et chaque région de 3x3 contienne tous les chiffres de 1 à 9, sans répétition.
    </p>
    <p style="font-size: 17px;">
     Au début du jeu, certaines cases sont déjà remplies avec des chiffres, appelées "indices" ou "pré-remplissages". Ces indices servent de point de départ et doivent être respectés lors de la résolution du Sudoku.
    </p>
     <p style="font-size: 17px;">
     La résolution d'une grille est gratifiée par un score : <br>facile : 10💎  <br>moyen : 50💎  <br>difficile : 500💎  <br>diabolique : 1000💎
    </p>
     <p style="font-size: 18px;">
     Allez Cliquer sur un Niveau pour commencer 😊
    </p>
  </div>
`;
}



var historyList = [];
var test;// cette déclaration va être utilisée dans le hint
function setGame(board) {
    // Initialiser la grande liste avec la première grille
    historyList[0] = board;
	
	
    // Board 9x9
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement("input");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
			tile.classList.add("center-text"); // Ajoutez cette ligne pour centrer le texte
            //console.log('les voila :: ',board[r][c]);
            if (board[r][c] != "-") {
                tile.value = board[r][c];
                tile.classList.add("tile-start");
                tile.readOnly = true; // Empêche la modification des cases pré-remplies
                //console.log('les voila :: ',board[r][c]);
            } else {
                tile.classList.add("tile-empty");
                //tile.classList.add("invalid-input");
                // Ajouter l'écouteur d'événements input pour les cases vides
                tile.addEventListener("input", function(event) {
                    let inputChar = event.target.value;
                    if (!/^[1-9]$/.test(inputChar)) {
                        event.target.value = ""; // Remplace le caractère non autorisé par une chaîne vide
                        
                    }
                   	 
                    else {
                        updateGridHistory(); // Mettre à jour la grande liste lorsque la valeur de la case est modifiée
                       /* for (let r = 0; r < 9; r++) {
							        for (let c = 0; c < 9; c++) {
							            let tileValue = document.getElementById(r.toString() + "-" + c.toString()).value;
							            grid___values += tileValue !== "" ? tileValue : "-";
							        }
							    }
                      if (!isValidSudoku(grid___values)) {                         
   						 event.target.style.color = "red";
   						 setTimeout(() => {
   						     event.target.style.color = "black";event.target.value = "";updateGridHistory();
  							  }, 2000);
                        } else {
                            event.target.style.color = "black"; updateGridHistory();
                        }*/
                    }
                });
                
            }
            if (r == 2 || r == 5) {
                tile.classList.add("horizontal-line");
            }
            if (c == 2 || c == 5) {
                tile.classList.add("vertical-line");
            }
            //tile.addEventListener("click", selectTile);
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
        }
    }
}
 
// Fonction pour stocker la grille dans la grande liste
function storeGridHistory() {
    // Initialisation de la grille vide
    var gridValues = "";

    // Parcours de la grille actuelle et construction des valeurs
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tileValue = document.getElementById(r.toString() + "-" + c.toString()).value;
            gridValues += tileValue !== "" ? tileValue : "-";
        }
    }

    // Ajout de la grille actuelle à la grande liste
    historyList.push(gridValues);
   if(cases_generes_avec_hint.length !=0){		
		for	(let j = 0; j < historyList.length; j++){
		// Parcours de chaque paire [r, c] dans cases_generes_avec_hint
		for (let i = 0; i < cases_generes_avec_hint.length; i++) {
		    let coord = cases_generes_avec_hint[i];
		    let r = coord[0];
		    let c = coord[1];
		  	historyList[j][r] = historyList[j][r].substring(0, c) + solution[r][c] + historyList[j][r].substring(c + 1);		    
		}
	}}
    // ici je vais ajouter un bloc permettant de prendre en considération tout les hints et les ajouter automatiquement à toutes les grids
    
}

// Fonction pour mettre à jour la grande liste à chaque modification de case
function updateGridHistory() {
    // Ajouter la grille actuelle à la grande liste
    storeGridHistory();
}


var nouveau_board;// on va utiliser ce nouveau board dans le hintButton
var cases_generes_avec_hint=[];
//on doit ajouter des actions au bouttons

//fonction quiva etre utiliséedans le hint pour tester les cases générer par le hint
function isCoordInList(coordList, r, c) {
    for (let i = 0; i < coordList.length; i++) {
        let coord = coordList[i];
        if (coord[0] === r && coord[1] === c) {
            return true;
        }
    }
    return false;
}

// Sélection des boutons 
var indice_ligne_gourdn ; 
indice_ligne_gourdn = 0;
var indice_ligne_facile ; 
indice_ligne_facile = 0;
var indice_ligne_difficile ; 
indice_ligne_difficile = 0;
var indice_ligne_moyen ; 
indice_ligne_moyen = 0;


// une variable pour se rappeler quelle grille est résolue
var nature_grill;


document.addEventListener('DOMContentLoaded', function() {
  // Sélection des boutons
  var startButton = document.getElementById("startButton");
  var stopButton = document.getElementById("stopButton");
  var hoursSpan = document.getElementById("hours");
  var minutesSpan = document.getElementById("minutes");
  var secondsSpan = document.getElementById("seconds");
  var RappelButton = document.getElementById("rappelButton");
  var submitButton = document.getElementById("submitButton");
  var refreshButton = document.getElementById("refreshButton");
  var to_pdfButton = document.getElementById("topdfButton");
  var redemarrerButton = document.getElementById("redemmarage");
  
   
  const easyButton = document.querySelector('.easy');
  const mediumButton = document.querySelector('.medium');
  const hardButton = document.querySelector('.hard');
  const expertButton = document.querySelector('.expert');
  const undoButton = document.querySelector('.undo');
  const hintButton = document.querySelector('.hint');
  const decButton = document.getElementById('declButton');

    
  decButton.addEventListener('click', () => {
        window.location.href = 'http://localhost:8083/zPFA_Sudoku/';
  		console.log("action de la deconnexion");
  });
  
  //action du boutton redémarrer
  
  redemarrerButton.addEventListener('click',function(){
		startButton.click();
		var nouvelle_grille_pr = premieregrill.slice();
		console.log("nouvelle_grille_nv =", nouvelle_grille_pr);
		
		
		const boardElement = document.getElementById("board");
		boardElement.innerHTML = "";
		    	
		historyList = [];
		cases_generes_avec_hint = [];
		setGame(nouvelle_grille_pr);
		console.log("Action du bouton redemmarer");	
  })
  
// action du refresh 
  refreshButton.addEventListener('click', function() {
	//update des statistiques
	  var email = localStorage.getItem('email');
	  console.log(email);
	
      // Créer une WebSocket
      let websocket = new WebSocket("ws://localhost:8083/zPFA_Sudoku/userstatistics");

      // Lorsque la connexion est ouverte
      websocket.onopen = function(_event) {
        websocket.send(email); // Envoyer l'email à la WebSocket
      };

      // Lorsque des données sont reçues de la WebSocket
      websocket.onmessage = function(event) {
        let userStatistics = event.data; // Les statistiques de l'utilisateur sous forme de chaîne de caractères
        console.log(userStatistics);
        //document.getElementById("userStatistics").innerText = userStatistics; // Afficher les statistiques dans la page
		 // Sélectionnez l'élément aside
	 	let asideElement = document.getElementById("dynamicAside");
		
  	 // Modifiez le contenu de l'aside
	 	asideElement.innerHTML = userStatistics;
      };

      // Gérer les erreurs de la WebSocket
      websocket.onerror = function(event) {
        console.error("Erreur WebSocket : ", event);
      };
})
    
  
// Action pour le bouton "Facile"
// Variables du chronomètre
	var hours = 0;
	var minutes = 0;
	var seconds = 0;
	var timer;
	
	// Fonction de démarrage du chronomètre
	function startTimer() {
		//blockForOneSecond();
	    console.log("bonjour--------------------------------------------------------------------------------------")
	    timer = setInterval(updateTimer, 1000);
	    startButton.disabled = true; // Désactiver le bouton "Démarrer"
	}
	
	// Fonction de mise à jour du chronomètre
	function updateTimer() {
	    seconds++;
	    if (seconds >= 60) {
	        seconds = 0;
	        minutes++;
	        if (minutes >= 60) {
	            minutes = 0;
	            hours++;
	        }
	    }
	
	    // Afficher les valeurs mises à jour dans le chronomètre
	    hoursSpan.textContent = padNumber(hours);
	    minutesSpan.textContent = padNumber(minutes);
	    secondsSpan.textContent = padNumber(seconds);
	}
	
	// Fonction d'arrêt du chronomètre
	function stopTimer() {
	    clearInterval(timer);
	    startButton.disabled = false; // Réactiver le bouton "Démarrer"
	}
	
	// Fonction pour ajouter un zéro devant les chiffres inférieurs à 10
	function padNumber(number) {
	    return number < 10 ? "0" + number : number;
	}
	// Fonction pour récupérer la valeur actuelle du chronomètre
	function getCurrentTime() {
	    return {
	        hours: hours,
	        minutes: minutes,
	        seconds: seconds
	    };
	}
	
	// Fonction pour réinitialiser le chronomètre à 0
	function resetTimer() {
	    //startButton.disabled = false;
	    hours = 0;
	    minutes = 0;
	    seconds = 0;
	    // Mettre à jour l'affichage du chronomètre réinitialisé
	    hoursSpan.textContent = padNumber(hours);
	    minutesSpan.textContent = padNumber(minutes);
	    secondsSpan.textContent = padNumber(seconds);
	}
	
	
	// Ajouter les écouteurs d'événements aux boutons
	function startButtonCallback() {
	    startTimer(); // Appeler la fonction startTimer()
	    
	// Attribuer à board le dernier élément de la liste historyList
	if (historyList.length === 1) {
	  board = historyList[0];	  
	} 
	else {
		
		if (historyList.length === 1) {
		  board = historyList[0];	  
		} 
		 else{ board = historyList[historyList.length-1];
		  board = board.match(/.{1,9}/g);
		}
	}
	
	if(cases_generes_avec_hint.length !=0){
		// Parcours de chaque paire [r, c] dans cases_generes_avec_hint
		for (let i = 0; i < cases_generes_avec_hint.length; i++) {
		    let coord = cases_generes_avec_hint[i];
		    let r = coord[0];
		    let c = coord[1];
		  	board[r] = board[r].substring(0, c) + solution[r][c] + board[r].substring(c + 1);		    
		}
	}
	
	//var suppr_first = cases_generes_avec_hint.pop();
	const boardElement = document.getElementById("board");
	console.log(board);
    boardElement.innerHTML = "";
    
    // Board 9x9
	for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement("input");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
			tile.classList.add("center-text"); // Ajoutez cette ligne pour centrer le texte
            if (board[r][c] != "-") {
                if (historyList[0][r][c] != "-" ||isCoordInList(cases_generes_avec_hint, r, c)){
                tile.value = board[r][c];
                tile.classList.add("tile-start");
                tile.readOnly = true;}
                else{
					tile.value = board[r][c];												// Empêche la modification des cases pré-remplies
 					tile.classList.add("tile-empty");
 					tile.addEventListener("input", function(event) {
                    let inputChar = event.target.value;
                    if (!/^[1-9]$/.test(inputChar)) {
                        event.target.value = ""; // Remplace le caractère non autorisé par une chaîne vide
                    }   else {
                        updateGridHistory(); // Mettre à jour la grande liste lorsque la valeur de la case est modifiée
                       /* for (let r = 0; r < 9; r++) {
							        for (let c = 0; c < 9; c++) {
							            let tileValue = document.getElementById(r.toString() + "-" + c.toString()).value;
							            grid___values += tileValue !== "" ? tileValue : "-";
							        }
							    }
                      if (!isValidSudoku(grid___values)) {                         
   						 event.target.style.color = "red";
   						 setTimeout(() => {
   						     event.target.style.color = "black";event.target.value = "";updateGridHistory();
  							  }, 2000);
                        } else {
                            event.target.style.color = "black"; updateGridHistory();
                        }*/
                    }
                });         
          	 }
          	 
          	  
           } else {
                tile.classList.add("tile-empty");
                // Ajouter l'écouteur d'événements input pour les cases vides
                tile.addEventListener("input", function(event) {
                    let inputChar = event.target.value;
                    if (!/^[1-9]$/.test(inputChar)) {
                        event.target.value = ""; // Remplace le caractère non autorisé par une chaîne vide
                    } else {
                        updateGridHistory(); // Mettre à jour la grande liste lorsque la valeur de la case est modifiée
                       /* for (let r = 0; r < 9; r++) {
							        for (let c = 0; c < 9; c++) {
							            let tileValue = document.getElementById(r.toString() + "-" + c.toString()).value;
							            grid___values += tileValue !== "" ? tileValue : "-";
							        }
							    }
                      if (!isValidSudoku(grid___values)) {                         
   						 event.target.style.color = "red";
   						 setTimeout(() => {
   						     event.target.style.color = "black";event.target.value = "";updateGridHistory();
  							  }, 2000);
                        } else {
                            event.target.style.color = "black"; updateGridHistory();
                        }*/
                    }
                });
            }
            if (r == 2 || r == 5) {
                tile.classList.add("horizontal-line");
            }
            if (c == 2 || c == 5) {
                tile.classList.add("vertical-line");
            }
            //tile.addEventListener("click", selectTile);
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
        }
    }

				
	}
	startButton.addEventListener('click', startButtonCallback);
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
		
	
	function stopButtonCallback() {
		 
	    stopTimer(); // Appeler la fonction stopTimer()
		const boardElement = document.getElementById("board");
	boardElement.innerHTML = `
  	 <div class="welcome-section" style="background-image: url('belle_image_bienvenue_.jpg');">
    <h2 style="font-size: 18.7px;"> Bienvenue toujours au Sudoku !</h2>
    <p style="font-size: 18.7px;">
      Le Sudoku est un jeu de logique fascinant qui a été inventé dans les années 1970. Il est devenu rapidement populaire dans le monde entier.
    </p>
    <p style="font-size: 18.7px;">
      L'objectif du Sudoku est de remplir une grille 9x9 avec des chiffres de 1 à 9, de telle sorte que chaque colonne, chaque ligne et chaque région de 3x3 contienne tous les chiffres de 1 à 9, sans répétition.
    </p>
    <p style="font-size: 18.7px;">
     Au début du jeu, certaines cases sont déjà remplies avec des chiffres, appelées "indices" ou "pré-remplissages". Ces indices servent de point de départ et doivent être respectés lors de la résolution du Sudoku.
    </p>
     <p style="font-size: 20px;">
     Appuyer sur Relancer pour continuer 😊 ou si vous avez finit la partie cliquez sur un niveau.<br> <br> 
    </p>
  </div>
	`;
	}
	stopButton.addEventListener('click', stopButtonCallback);







//action du boutton rappel
RappelButton.addEventListener('click',function(){
	alert("    Au début du jeu, certaines cases sont déjà remplies avec des chiffres, appelées indices ou pré-remplissages. Ces indices servent de point de départ et doivent être respectés lors de la résolution du Sudoku.\n    Aucun chiffre ne doit se répéter dans une même ligne,dans une même colonne ou dans une même région de 3x3 cases. Chaque ligne,colonne et region 3x3 doit contenir les chiffres de 1 à 9, sans répétition.");
})


// Événement de clic sur le bouton easyButton
easyButton.addEventListener('click', function() {
	nombre_de_hint =0 ;
	startButton.style.display = 'inline';
	submitButton.disabled = false;
	hintButton.disabled = false;
	undoButton.disabled = false;
	enableExitAlert()
	redemarrerButton.disabled = false;
	nature_grill = 0;
	var userEmail = localStorage.getItem('email'); 
	var socket;

	function formatBoard(boardString) {
	  const cp_board = [];	
	  for (let i = 0; i < 9; i++) {
	    const row = boardString.slice(i * 9, (i + 1) * 9);
	    cp_board.push(row);
	  }	
	  return cp_board;
	}	
	

	// Fonction pour initialiser la connexion WebSocket	
	function initWebSocket() {
	  socket = new WebSocket("ws://localhost:8083/zPFA_Sudoku/websocket");
	
	  socket.onopen = function() {
	    console.log("Connexion établie avec le serveur WebSocket");
	    // Une fois que la connexion WebSocket est ouverte, demandez une nouvelle grille
	    requestNewGrille();
	  };
	
	  socket.onmessage = function(event) {
	    resetTimer();
	    var grille = event.data;
	    console.log("Grille récupérée du serveur:", grille);
	    //pour stocker la premmiere grille
	 	var grille_copy = grille;
	 	var board_formatté_pourpr = grille_copy.replace(/0/g, '-');
	 	var board_copié = formatBoard(board_formatté_pourpr);
	 	premieregrill = board_copié;
	 	
	 	//
	 	
	 	var board_formatté = grille.replace(/0/g, '-');
	 	var board = formatBoard(board_formatté);
	 	
	    console.log("board =", board);
		const boardElement = document.getElementById("board");
    	boardElement.innerHTML = "";
    	console.log(board);
		resetTimer();
		stopTimer();
    	setGame(board);
	    startButton.click();
	    socket.close();
	    socket = null;
	    
		
	    // Mettez à jour votre interface utilisateur pour afficher la grille récupérée
	    //document.getElementById("grille").innerText = grille;
	  };
	}
	// Fonction pour envoyer une demande de nouvelle grille au serveur via WebSocket
	function requestNewGrille() {
	  
	  if (socket.readyState === WebSocket.OPEN) {
	    // La connexion WebSocket est ouverte, vous pouvez envoyer le message
	    socket.send(userEmail);
	  } else {
	    console.error("La connexion WebSocket n'est pas encore ouverte");
	  }
	}	  	  
	  // Effectuer les opérations nécessaires ici
	  historyList = [];
	  cases_generes_avec_hint = [];
	  console.log("Action du bouton facile");
	  valeur = 0;
	  // Initialiser la connexion WebSocket si ce n'est pas déjà fait
	  if (!socket || socket.readyState !== WebSocket.OPEN) {
	    initWebSocket();
	  }
	
	
	//update des statistiques
	  var email = localStorage.getItem('email');
	  console.log(email);
	
      // Créer une WebSocket
      let websocket = new WebSocket("ws://localhost:8083/zPFA_Sudoku/userstatistics");

      // Lorsque la connexion est ouverte
      websocket.onopen = function(_event) {
        websocket.send(email); // Envoyer l'email à la WebSocket
      };

      // Lorsque des données sont reçues de la WebSocket
      websocket.onmessage = function(event) {
        let userStatistics = event.data; // Les statistiques de l'utilisateur sous forme de chaîne de caractères
        console.log(userStatistics);
        //document.getElementById("userStatistics").innerText = userStatistics; // Afficher les statistiques dans la page
		 // Sélectionnez l'élément aside
	 	let asideElement = document.getElementById("dynamicAside");
		
  	 // Modifiez le contenu de l'aside
	 	asideElement.innerHTML = userStatistics;
	 	        websocket.close();
        websocket =null;
      };

      // Gérer les erreurs de la WebSocket
      websocket.onerror = function(event) {
        console.error("Erreur WebSocket : ", event);
      };
	stopButton.disabled = false; 
	});





  // Action pour le bouton "Moyen"
  mediumButton.addEventListener('click', function() {
	nombre_de_hint =0 ;
	startButton.style.display = 'inline';
	submitButton.disabled = false;
	hintButton.disabled = false;
	undoButton.disabled = false;
	enableExitAlert()
	redemarrerButton.disabled = false;
	
	nature_grill = 1;
    var userEmail = localStorage.getItem('email'); 
	var socket1;

	function formatBoard(boardString) {
	  const cp_board = [];	
	  for (let i = 0; i < 9; i++) {
	    const row = boardString.slice(i * 9, (i + 1) * 9);
	    cp_board.push(row);
	  }	
	  return cp_board;
	}	
	// Fonction pour initialiser la connexion WebSocket	
	function initWebSocket() {
	  socket1 = new WebSocket("ws://localhost:8083/zPFA_Sudoku/websocket_moyen");
	
	  socket1.onopen = function() {
	    console.log("Connexion établie avec le serveur WebSocket");
	    // Une fois que la connexion WebSocket est ouverte, demandez une nouvelle grille
	    requestNewGrille();
	  };
	
	  socket1.onmessage = function(event) {
	    resetTimer();
	    var grille = event.data;
	    console.log("Grille récupérée du serveur:", grille);
	    //pour stocker la premmiere grille
	 	var grille_copy = grille;
	 	var board_formatté_pourpr = grille_copy.replace(/0/g, '-');
	 	var board_copié = formatBoard(board_formatté_pourpr);
	 	premieregrill = board_copié;
	 	
	 	//
	 	
	 	var board_formatté = grille.replace(/0/g, '-');
	 	var board = formatBoard(board_formatté);
	    console.log("board =", board);
	
		const boardElement = document.getElementById("board");
    	boardElement.innerHTML = "";
		resetTimer();
    	setGame(board);
    	stopTimer();
	    startButton.click();
	    socket1.close();
	    socket1 = null;		
	    // Mettez à jour votre interface utilisateur pour afficher la grille récupérée
	    //document.getElementById("grille").innerText = grille;
	  };
	}
	// Fonction pour envoyer une demande de nouvelle grille au serveur via WebSocket
	function requestNewGrille() {
	  
	  if (socket1.readyState === WebSocket.OPEN) {
	    // La connexion WebSocket est ouverte, vous pouvez envoyer le message
	    socket1.send(userEmail);
	  } else {
	    console.error("La connexion WebSocket n'est pas encore ouverte");
	  }
	}	  	  
	  // Effectuer les opérations nécessaires ici
	  historyList = [];
	  cases_generes_avec_hint = [];
	  console.log("Action du bouton moyen");
	  valeur = 0;
	  // Initialiser la connexion WebSocket si ce n'est pas déjà fait
	  if (!socket1 || socket1.readyState !== WebSocket.OPEN) {
	    initWebSocket();
	  }
	
	
	//update des statistiques
	  var email = localStorage.getItem('email');
	  console.log(email);
	
      // Créer une WebSocket
      let websocket = new WebSocket("ws://localhost:8083/zPFA_Sudoku/userstatistics");

      // Lorsque la connexion est ouverte
      websocket.onopen = function(_event) {
        websocket.send(email); // Envoyer l'email à la WebSocket
      };

      // Lorsque des données sont reçues de la WebSocket
      websocket.onmessage = function(event) {
        let userStatistics = event.data; // Les statistiques de l'utilisateur sous forme de chaîne de caractères
        console.log(userStatistics);
        //document.getElementById("userStatistics").innerText = userStatistics; // Afficher les statistiques dans la page
		 // Sélectionnez l'élément aside
	 	let asideElement = document.getElementById("dynamicAside");
		
  	 // Modifiez le contenu de l'aside
	 	asideElement.innerHTML = userStatistics;
	 	        websocket.close();
        websocket =null;
      };

      // Gérer les erreurs de la WebSocket
      websocket.onerror = function(event) {
        console.error("Erreur WebSocket : ", event);
      };
  
  stopButton.disabled = false; 
  });




  // Action pour le bouton "Difficile"
  hardButton.addEventListener('click', function() {
	nombre_de_hint =0 ;
	startButton.style.display = 'inline';
	submitButton.disabled = false;
	hintButton.disabled = false;
	undoButton.disabled = false;
	enableExitAlert()
	redemarrerButton.disabled = false;
	
	nature_grill = 2;
	var userEmail = localStorage.getItem('email'); 
	var socket2;

	function formatBoard(boardString) {
	  const cp_board = [];	
	  for (let i = 0; i < 9; i++) {
	    const row = boardString.slice(i * 9, (i + 1) * 9);
	    cp_board.push(row);
	  }	
	  return cp_board;
	}	
	// Fonction pour initialiser la connexion WebSocket	
	function initWebSocket() {
	  socket2 = new WebSocket("ws://localhost:8083/zPFA_Sudoku/websocket_difficile");
	
	  socket2.onopen = function() {
	    console.log("Connexion établie avec le serveur WebSocket");
	    // Une fois que la connexion WebSocket est ouverte, demandez une nouvelle grille
	    requestNewGrille();
	  };
	
	  socket2.onmessage = function(event) {
	    resetTimer();
	    var grille = event.data;
	    console.log("Grille récupérée du serveur:", grille);
	 	
	 	//pour stocker la premmiere grille
	 	var grille_copy = grille;
	 	var board_formatté_pourpr = grille_copy.replace(/0/g, '-');
	 	var board_copié = formatBoard(board_formatté_pourpr);
	 	premieregrill = board_copié;
	 	
	 	//
	 	
	 	var board_formatté = grille.replace(/0/g, '-');
	 	var board = formatBoard(board_formatté);
	    console.log("board =", board);

		const boardElement = document.getElementById("board");
    	boardElement.innerHTML = "";
		resetTimer();
    	setGame(board);
	    stopTimer();
	    startButton.click();
	    socket2.close();
	    socket2 = null;	    
		
	    // Mettez à jour votre interface utilisateur pour afficher la grille récupérée
	    //document.getElementById("grille").innerText = grille;
	  };
	}
	// Fonction pour envoyer une demande de nouvelle grille au serveur via WebSocket
	function requestNewGrille() {
	  
	  if (socket2.readyState === WebSocket.OPEN) {
	    // La connexion WebSocket est ouverte, vous pouvez envoyer le message
	    socket2.send(userEmail);
	  } else {
	    console.error("La connexion WebSocket n'est pas encore ouverte");
	  }
	}	  	  
	  // Effectuer les opérations nécessaires ici
	  historyList = [];
	  cases_generes_avec_hint = [];
	  console.log("Action du bouton difficile");
	  valeur = 0;
	  // Initialiser la connexion WebSocket si ce n'est pas déjà fait
	  if (!socket2 || socket2.readyState !== WebSocket.OPEN) {
	    initWebSocket();
	  }
	
	
	//update des statistiques
	  var email = localStorage.getItem('email');
	  console.log(email);
	
      // Créer une WebSocket
      let websocket = new WebSocket("ws://localhost:8083/zPFA_Sudoku/userstatistics");

      // Lorsque la connexion est ouverte
      websocket.onopen = function(_event) {
        websocket.send(email); // Envoyer l'email à la WebSocket
      };

      // Lorsque des données sont reçues de la WebSocket
      websocket.onmessage = function(event) {
        let userStatistics = event.data; // Les statistiques de l'utilisateur sous forme de chaîne de caractères
        console.log(userStatistics);
        //document.getElementById("userStatistics").innerText = userStatistics; // Afficher les statistiques dans la page
		 // Sélectionnez l'élément aside
	 	let asideElement = document.getElementById("dynamicAside");
		
  	 // Modifiez le contenu de l'aside
	 	asideElement.innerHTML = userStatistics;
        websocket.close();
        websocket =null;
      };

      // Gérer les erreurs de la WebSocket
      websocket.onerror = function(event) {
        console.error("Erreur WebSocket : ", event);
      };
	
stopButton.disabled = false; 
  });


  // Action pour le bouton "Diabolique"
  expertButton.addEventListener('click', function() {
	nombre_de_hint =0 ;
	startButton.style.display = 'inline';
	submitButton.disabled = false;
	hintButton.disabled = false;
	undoButton.disabled = false;
	enableExitAlert()
	redemarrerButton.disabled = false;
	nature_grill = 3;

//...
	var userEmail = localStorage.getItem('email'); 
	var socket3;

	function formatBoard(boardString) {
	  const cp_board = [];	
	  for (let i = 0; i < 9; i++) {
	    const row = boardString.slice(i * 9, (i + 1) * 9);
	    cp_board.push(row);
	  }	
	  return cp_board;
	}	
	// Fonction pour initialiser la connexion WebSocket	
	function initWebSocket() {
	  socket3 = new WebSocket("ws://localhost:8083/zPFA_Sudoku/websocket_diabolique");
	
	  socket3.onopen = function() {
	    console.log("Connexion établie avec le serveur WebSocket");
	    // Une fois que la connexion WebSocket est ouverte, demandez une nouvelle grille
	    requestNewGrille();
	  };
	
	  socket3.onmessage = function(event) {
	    resetTimer();
	    var grille = event.data;
	    console.log("Grille récupérée du serveur:", grille);
	    //pour stocker la premmiere grille
	 	var grille_copy = grille;
	 	var board_formatté_pourpr = grille_copy.replace(/0/g, '-');
	 	var board_copié = formatBoard(board_formatté_pourpr);
	 	premieregrill = board_copié;
	 	
	 	//
	 	
	 	var board_formatté = grille.replace(/0/g, '-');
	 	var board = formatBoard(board_formatté);
	    console.log("board =", board);
	    
		const boardElement = document.getElementById("board");
    	boardElement.innerHTML = "";
		resetTimer();
    	setGame(board);
    	stopTimer();
	    startButton.click();
	    socket3.close();
	    socket3 = null;	    
		    	
		
	    // Mettez à jour votre interface utilisateur pour afficher la grille récupérée
	    //document.getElementById("grille").innerText = grille;
	  };
	}
	// Fonction pour envoyer une demande de nouvelle grille au serveur via WebSocket
	function requestNewGrille() {
	  
	  if (socket3.readyState === WebSocket.OPEN) {
	    // La connexion WebSocket est ouverte, vous pouvez envoyer le message
	    socket3.send(userEmail);
	  } else {
	    console.error("La connexion WebSocket n'est pas encore ouverte");
	  }
	}	  	  
	  // Effectuer les opérations nécessaires ici
	  historyList = [];
	  cases_generes_avec_hint = [];
	  console.log("Action du bouton diabolique");
	  valeur = 0;
	  // Initialiser la connexion WebSocket si ce n'est pas déjà fait
	  if (!socket3 || socket3.readyState !== WebSocket.OPEN) {
	    initWebSocket();
	  }
	
	
	//update des statistiques
	  var email = localStorage.getItem('email');
	  console.log(email);
	
      // Créer une WebSocket
      let websocket = new WebSocket("ws://localhost:8083/zPFA_Sudoku/userstatistics");

      // Lorsque la connexion est ouverte
      websocket.onopen = function(_event) {
        websocket.send(email); // Envoyer l'email à la WebSocket
      };

      // Lorsque des données sont reçues de la WebSocket
      websocket.onmessage = function(event) {
        let userStatistics = event.data; // Les statistiques de l'utilisateur sous forme de chaîne de caractères
        console.log(userStatistics);
        //document.getElementById("userStatistics").innerText = userStatistics; // Afficher les statistiques dans la page
		 // Sélectionnez l'élément aside
	 	let asideElement = document.getElementById("dynamicAside");
		
  	 // Modifiez le contenu de l'aside
	 	asideElement.innerHTML = userStatistics;
	 	websocket.close();
	    websocket = null;	    
		
      };

      // Gérer les erreurs de la WebSocket
      websocket.onerror = function(event) {
        console.error("Erreur WebSocket : ", event);
      };
      
	
stopButton.disabled = false; 

  });
    
    
    
    
    
    
    
    //action du boutton hint
       
    
    hintButton.addEventListener('click', function() {
		
	if(nombre_de_hint == 3){alert("Vous n'avez droit qu'à 3 aides 😊")};
	if(nombre_de_hint<3){
		clearInterval(timer); //du stopbutton
	console.log(premieregrill);	
    alert("Grille Très Difficile pour vous : Attendez nous allons vous aidez 😊");
    console.log("Action du bouton hint");
	if (historyList.length === 1) {
		  board = historyList[0];	  
		} 
	else{ board = historyList[historyList.length-1];
		board = board.match(/.{1,9}/g);
	}
	if(cases_generes_avec_hint.length !=0){
		// Parcours de chaque paire [r, c] dans cases_generes_avec_hint
		for (let i = 0; i < cases_generes_avec_hint.length; i++) {
		    let coord = cases_generes_avec_hint[i];
		    let r = coord[0];
		    let c = coord[1];
		  	board[r] = board[r].substring(0, c) + solution[r][c] + board[r].substring(c + 1);		    
		}
	}
	solution = board.slice();
	test2 = isValidSudoku(solution);
	if(!test2){alert("Vous ne vous dirigez nulle part ❗❗ Lisez les règles du Sudoku ❗❗")}	
	else{
	test = sudokuSolver(solution);
	if(!test){alert("Vous ne vous dirigez nulle part ❗❗ Ne spéculez pas, suivez un raisonnement pur ❗❗")}
	else{
	//console.log(board);
	console.log(solution);
	// Liste pour stocker les coordonnées des cases vides
	let emptyCells = [];
	
	// Parcourir la grille pour trouver les cases vides et stocker leurs coordonnées
	for (let r = 0; r < 9; r++) {
	    for (let c = 0; c < 9; c++) {
	        if (board[r][c] === "-") {
	            emptyCells.push([r, c]); // Stocker les coordonnées de la case vide
	        }
	    }
	}
	
	// Sélectionner aléatoirement une paire de coordonnées parmi les cases vides
	let randomIndex = Math.floor(Math.random() * emptyCells.length);
	let randomCoordinates = emptyCells[randomIndex];
	let randomRow = randomCoordinates[0];
	let randomCol = randomCoordinates[1];
	
	// Remplacer la case vide dans board par le nombre correspondant dans la même position dans le tableau solution
	board[randomRow] = board[randomRow].substring(0, randomCol) + solution[randomRow][randomCol] + board[randomRow].substring(randomCol + 1);
	cases_generes_avec_hint.push([randomRow,randomCol]);
	console.log(board);
	console.log(cases_generes_avec_hint);
	const boardElement = document.getElementById("board");
    boardElement.innerHTML = "";
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement("input");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
			tile.classList.add("center-text"); // Ajoutez cette ligne pour centrer le texte            
           /* if (isCoordInList(cases_generes_avec_hint, r, c)){
                tile.value = board[r][c];
                tile.classList.add("tile-start");
                tile.readOnly = true;}  */
            console.log(isCoordInList(cases_generes_avec_hint, r, c));                
            if (board[r][c] != "-") {
                if (historyList[0][r][c] !== "-" || isCoordInList(cases_generes_avec_hint, r, c)){
                tile.value = board[r][c];
                tile.classList.add("tile-start");
                tile.readOnly = true;}
                else{
					tile.value = board[r][c];												// Empêche la modification des cases pré-remplies
 					tile.classList.add("tile-empty");
 					tile.addEventListener("input", function(event) {
                    let inputChar = event.target.value;
                    if (!/^[1-9]$/.test(inputChar)) {
                        event.target.value = ""; // Remplace le caractère non autorisé par une chaîne vide
                    } else {
                        updateGridHistory(); // Mettre à jour la grande liste lorsque la valeur de la case est modifiée
                      
                    }
                });         
          	 }       	          	  
           } else {
                tile.classList.add("tile-empty");
                // Ajouter l'écouteur d'événements input pour les cases vides
                tile.addEventListener("input", function(event) {
                    let inputChar = event.target.value;
                    if (!/^[1-9]$/.test(inputChar)) {
                        event.target.value = ""; // Remplace le caractère non autorisé par une chaîne vide
                    }                     else {
                        updateGridHistory(); // Mettre à jour la grande liste lorsque la valeur de la case est modifiée
                    }
                });
            }
            if (r == 2 || r == 5) {
                tile.classList.add("horizontal-line");
            }
            if (c == 2 || c == 5) {
                tile.classList.add("vertical-line");
            }
            //tile.addEventListener("click", selectTile);
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
        }
    }
    updateGridHistory();
    startButton.click();
    console.log(historyList.length);
  }  }													
  			nombre_de_hint = nombre_de_hint +1	
  			timer = setInterval(updateTimer, 1000);			
  								
  									}
  		
  });
  
   



 
   //action le boutton undo
  
  
  
  
  undoButton.addEventListener('click', function() {
    console.log("Action undo");
	// Attribuer à board le dernier élément de la liste historyList
	if (historyList.length === 1) {
	  board = historyList[0];	  
	} 
	else {
		var board_tompon = historyList.pop();
		
		if (historyList.length === 1) {
		  board = historyList[0];	  
		} 
		 else{ board = historyList[historyList.length-1];
		  board = board.match(/.{1,9}/g);
		}
	}
	
	if(cases_generes_avec_hint.length !=0){
		// Parcours de chaque paire [r, c] dans cases_generes_avec_hint
		for (let i = 0; i < cases_generes_avec_hint.length; i++) {
		    let coord = cases_generes_avec_hint[i];
		    let r = coord[0];
		    let c = coord[1];
		  	board[r] = board[r].substring(0, c) + solution[r][c] + board[r].substring(c + 1);		    
		}
	}
	
	//var suppr_first = cases_generes_avec_hint.pop();
	const boardElement = document.getElementById("board");
	console.log(board);
    boardElement.innerHTML = "";
    
    // Board 9x9
	for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement("input");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
			tile.classList.add("center-text"); // Ajoutez cette ligne pour centrer le texte
            if (board[r][c] != "-") {
                if (historyList[0][r][c] != "-" ||isCoordInList(cases_generes_avec_hint, r, c)){
                tile.value = board[r][c];
                tile.classList.add("tile-start");
                tile.readOnly = true;}
                else{
					tile.value = board[r][c];												// Empêche la modification des cases pré-remplies
 					tile.classList.add("tile-empty");
 					tile.addEventListener("input", function(event) {
                    let inputChar = event.target.value;
                    if (!/^[1-9]$/.test(inputChar)) {
                        event.target.value = ""; // Remplace le caractère non autorisé par une chaîne vide
                    }   else {
                        updateGridHistory(); // Mettre à jour la grande liste lorsque la valeur de la case est modifiée
                       /* for (let r = 0; r < 9; r++) {
							        for (let c = 0; c < 9; c++) {
							            let tileValue = document.getElementById(r.toString() + "-" + c.toString()).value;
							            grid___values += tileValue !== "" ? tileValue : "-";
							        }
							    }
                      if (!isValidSudoku(grid___values)) {                         
   						 event.target.style.color = "red";
   						 setTimeout(() => {
   						     event.target.style.color = "black";event.target.value = "";updateGridHistory();
  							  }, 2000);
                        } else {
                            event.target.style.color = "black"; updateGridHistory();
                        }*/
                    }
                });         
          	 }
          	 
          	  
           } else {
                tile.classList.add("tile-empty");
                // Ajouter l'écouteur d'événements input pour les cases vides
                tile.addEventListener("input", function(event) {
                    let inputChar = event.target.value;
                    if (!/^[1-9]$/.test(inputChar)) {
                        event.target.value = ""; // Remplace le caractère non autorisé par une chaîne vide
                    } else {
                        updateGridHistory(); // Mettre à jour la grande liste lorsque la valeur de la case est modifiée
                       /* for (let r = 0; r < 9; r++) {
							        for (let c = 0; c < 9; c++) {
							            let tileValue = document.getElementById(r.toString() + "-" + c.toString()).value;
							            grid___values += tileValue !== "" ? tileValue : "-";
							        }
							    }
                      if (!isValidSudoku(grid___values)) {                         
   						 event.target.style.color = "red";
   						 setTimeout(() => {
   						     event.target.style.color = "black";event.target.value = "";updateGridHistory();
  							  }, 2000);
                        } else {
                            event.target.style.color = "black"; updateGridHistory();
                        }*/
                    }
                });
            }
            if (r == 2 || r == 5) {
                tile.classList.add("horizontal-line");
            }
            if (c == 2 || c == 5) {
                tile.classList.add("vertical-line");
            }
            //tile.addEventListener("click", selectTile);
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
        }
    }
	   console.log(historyList.length);
  });
  
  
  // action du boutton submit : 
  submitButton.addEventListener('click', function() {
	hintButton.disabled = true;
	undoButton.disabled = true;
	stopButton.disabled = false;
	redemarrerButton.disabled = true;
	stopButton.click();	
	disableExitAlert();
	
	function isDashPresent(grid) {
	  for (var i = 0; i < grid.length; i++) {
	    if (grid[i].includes("-")) {
	      return true; // Le caractère "-" est présent dans la grille
	    }
	  }
	  return false; // Le caractère "-" n'est pas présent dans la grille
	}
	
	if (historyList.length === 1) {
		  alert("😊 Essaie la prochaine fois")	 ; 
		  stopButton.click();
		} 
	else{ 
		  var test_2;
	      answer = historyList[historyList.length-1];
		  answer = answer.match(/.{1,9}/g);
		  if(isDashPresent(answer)){
			 console.log(answer);
			 alert("😊 Essaie la prochaine fois")	 ; stopButton.click();
		  }
		  else{
			/*
			if(cases_generes_avec_hint.length !=0){
			// Parcours de chaque paire [r, c] dans cases_generes_avec_hint
				for (let i = 0; i < cases_generes_avec_hint.length; i++) {
				    let coord = cases_generes_avec_hint[i];
				    let r = coord[0];
				    let c = coord[1];
				  	answer[r] = answer[r].substring(0, c) + solution[r][c] + answer[r].substring(c + 1);		    
				}
			}*/
			answer2 = answer.slice();
			test_2 = isValidSudoku(answer2);
			if(!test_2){
				alert("😊 Essaie la prochaine fois");
				stopButton.click();}
			else{
				alert("😊 💐  bien joué , félicitations");
				
				var socket = new WebSocket('ws://localhost:8083/zPFA_Sudoku/websocket_submit');
				var userEmail = localStorage.getItem('email'); 


			// Événement de connexion à la WebSocket
			socket.addEventListener('open', function(event) {
			  console.log('Connecté à la WebSocket');
			
			  // Exemple : Envoi d'une liste contenant le numéro et le temps de résolution
			  var numero = nature_grill;
			  var temps = getCurrentTime();
			  a = temps.hours;
			  b = temps.minutes;
			  c = temps.seconds;
			 // temps = temps.hours * 60 + temps.minutes + temps.seconds / 60;
			  temps = a.toString() + " h " + b.toString() + " min " + c.toString() + " s";
		   	  temps = temps.toString();
		   	  console.log(temps); 
			  var data = [numero, temps, userEmail];
			  socket.send(JSON.stringify(data));
			  
			});
			 socket.addEventListener('message', function (event) {
	    		  console.log('Message from server', event.data);
	
				//affichage statistiques
				var email = localStorage.getItem('email');
					console.log(email);
					
				      // Créer une WebSocket
				    var websocket99 = new WebSocket("ws://localhost:8083/zPFA_Sudoku/userstatistics");
				
				      // Lorsque la connexion est ouverte
				    websocket99.onopen = function(_event) {
				      websocket99.send(email); // Envoyer l'email à la WebSocket
				    };
				
				      // Lorsque des données sont reçues de la WebSocket
			      websocket99.onmessage = function(event) {
			        let userStatistics = event.data; // Les statistiques de l'utilisateur sous forme de chaîne de caractères
			       console.log(userStatistics);
			        //document.getElementById("userStatistics").innerText = userStatistics; // Afficher les statistiques dans la page
					 // Sélectionnez l'élément aside
				 	let asideElement = document.getElementById("dynamicAside");
						console.log("refresh code exécuté");
				  	 // Modifiez le contenu de l'aside
					 	asideElement.innerHTML = userStatistics;
				      };
				
				      // Gérer les erreurs de la WebSocket
				      websocket99.onerror = function(event) {
				        console.error("Erreur WebSocket : ", event);
				      };	
							
    });
				}
			
			
			
	}}

	submitButton.disabled = true;
	startButton.style.display = 'none';

  });
  
  
  
  
// Gestionnaire d'événements pour l'appui de la touche "Erase"
document.addEventListener("keydown", function(event) {
    // Vérifiez si la touche enfoncée est "Erase" (code 8)
    if (event.key === "Backspace") {
        // Exécutez l'action associée lorsque la touche "Erase" est enfoncée
        alert('Le boutton keydown est equivalent au undo : utilise le avec précaution ❗')
        undoButton.click(); // Simule un clic sur le bouton
    }
    if (event.key === 'Delete' || event.keyCode === 46) {
                event.preventDefault();
                console.log('La touche Suppr est désactivée.');
            }
});

to_pdfButton.addEventListener('click',function(){
		
		grid = premieregrill.slice();
		
		if (historyList.length==1){grid2 = historyList[historyList.length-1];}
		else{grid2 = transformSudokuGrid(historyList[historyList.length-1]);}
		console.log(grid);
		console.log(grid2);
		var userConfirmed = confirm("📎 Voulez vous bien enregistrer cette partie pdf ?");
		if (userConfirmed) {
 //stopButton.disabled = true;                           
function createTable(grid) {
  var body = [];

  for (var i = 0; i < grid.length; i++) {
    var row = [];
    for (var j = 0; j < grid[i].length; j++) {
      row.push({
        text: grid[i][j] === '-' ? ' ' : grid[i][j],
        style: (i % 3 === 2 && i !== 8) || (j % 3 === 2 && j !== 8) ? 'boldBorders' : 'normalBorders',
        alignment: 'center',
        bold: grid[i][j] !== '-'  // Mettre en gras les chiffres
      });
    }
    body.push(row);
  }

  return {
    table: {
      body: body,
      widths: Array(grid.length).fill(25), // Elargir les colonnes
      heights: Array(grid.length).fill(25) // Elargir les lignes
    },
    layout: {
      hLineWidth: function (i, node) {
        return (i === 0 || i === node.table.body.length) ? 2 : (i % 3 === 0) ? 2 : 1;
      },
      vLineWidth: function (i, node) {
        return (i === 0 || i === node.table.widths.length) ? 2 : (i % 3 === 0) ? 2 : 1;
      }
    }
  };
}
if(nature_grill ==0 ){
var docDefinition = {
  content: [
    { text: 'Grille sudoku : Facile', style: 'header', alignment: 'center' },
    { text: '\n\n' },
    { 
      columns: [
        { width: '*', text: '' },
        { width: 'auto', table: createTable(grid).table, layout: createTable(grid).layout },
        { width: '*', text: '' },
      ]
    },
    { text: '\n\n' },
    { text: 'Avancement', style: 'subheader', alignment: 'center' },
    { text: '\n\n' },
    { 
      columns: [
        { width: '*', text: '' },
        { width: 'auto', table: createTable(grid2).table, layout: createTable(grid2).layout },
        { width: '*', text: '' },
      ]
    }
  ],
  styles: {
    header: {
      fontSize: 20,
      bold: true
    },
    subheader: {
      fontSize: 16,
      bold: true
    },
    boldBorders: {
      border: [true, true, true, true],
      bold: true
    },
    normalBorders: {
      border: [true, true, true, true]
    }
  },
  defaultStyle: {
    fontSize: 18, // Augmenter la taille de la police
    bold: false
  }
};
pdfMake.createPdf(docDefinition).download('sudoku_facile.pdf');}


if(nature_grill ==1 ){
var docDefinition = {
  content: [
    { text: 'Grille sudoku : Moyen', style: 'header', alignment: 'center' },
    { text: '\n\n' },
    { 
      columns: [
        { width: '*', text: '' },
        { width: 'auto', table: createTable(grid).table, layout: createTable(grid).layout },
        { width: '*', text: '' },
      ]
    },
    { text: '\n\n' },
    { text: 'Avancement', style: 'subheader', alignment: 'center' },
    { text: '\n\n' },
    { 
      columns: [
        { width: '*', text: '' },
        { width: 'auto', table: createTable(grid2).table, layout: createTable(grid2).layout },
        { width: '*', text: '' },
      ]
    }
  ],
  styles: {
    header: {
      fontSize: 20,
      bold: true
    },
    subheader: {
      fontSize: 16,
      bold: true
    },
    boldBorders: {
      border: [true, true, true, true],
      bold: true
    },
    normalBorders: {
      border: [true, true, true, true]
    }
  },
  defaultStyle: {
    fontSize: 18, // Augmenter la taille de la police
    bold: false
  }
};
pdfMake.createPdf(docDefinition).download('sudoku_moyen.pdf');}
if(nature_grill ==2 ){
var docDefinition = {
  content: [
    { text: 'Grille sudoku : Difficile', style: 'header', alignment: 'center' },
    { text: '\n\n' },
    { 
      columns: [
        { width: '*', text: '' },
        { width: 'auto', table: createTable(grid).table, layout: createTable(grid).layout },
        { width: '*', text: '' },
      ]
    },
    { text: '\n\n' },
    { text: 'Avancement', style: 'subheader', alignment: 'center' },
    { text: '\n\n' },
    { 
      columns: [
        { width: '*', text: '' },
        { width: 'auto', table: createTable(grid2).table, layout: createTable(grid2).layout },
        { width: '*', text: '' },
      ]
    }
  ],
  styles: {
    header: {
      fontSize: 20,
      bold: true
    },
    subheader: {
      fontSize: 16,
      bold: true
    },
    boldBorders: {
      border: [true, true, true, true],
      bold: true
    },
    normalBorders: {
      border: [true, true, true, true]
    }
  },
  defaultStyle: {
    fontSize: 18, // Augmenter la taille de la police
    bold: false
  }
};
pdfMake.createPdf(docDefinition).download('sudoku_difficile.pdf');}
if(nature_grill ==3 ){
var docDefinition = {
  content: [
    { text: 'Grille sudoku : Diabolique', style: 'header', alignment: 'center' },
    { text: '\n\n' },
    { 
      columns: [
        { width: '*', text: '' },
        { width: 'auto', table: createTable(grid).table, layout: createTable(grid).layout },
        { width: '*', text: '' },
      ]
    },
    { text: '\n\n' },
    { text: 'Avancement', style: 'subheader', alignment: 'center' },
    { text: '\n\n' },
    { 
      columns: [
        { width: '*', text: '' },
        { width: 'auto', table: createTable(grid2).table, layout: createTable(grid2).layout },
        { width: '*', text: '' },
      ]
    }
  ],
  styles: {
    header: {
      fontSize: 20,
      bold: true
    },
    subheader: {
      fontSize: 16,
      bold: true
    },
    boldBorders: {
      border: [true, true, true, true],
      bold: true
    },
    normalBorders: {
      border: [true, true, true, true]
    }
  },
  defaultStyle: {
    fontSize: 18, // Augmenter la taille de la police
    bold: false
  }
};
pdfMake.createPdf(docDefinition).download('sudoku_diabolique.pdf');}



}

else {
                // Rien ne se passe
            }
// Ou
//pdfDoc.download('sudoku.pdf'); // Télécharger le PDF
})
// Fonction pour créer le fichier PDF avec le tableau Sudoku
/*
function genererPDF(grilleSudoku) {
  // Création d'un nouveau document PDF
  var doc = new jsPDF();

  // Définition des paramètres du tableau
  var coordX = 10; // Position X du tableau
  var coordY = 10; // Position Y du tableau
  var largeurCellule = 10; // Largeur des cellules du tableau
  var hauteurCellule = 10; // Hauteur des cellules du tableau

  // Parcourir la grille Sudoku et générer le tableau
  for (var i = 0; i < grilleSudoku.length; i++) {
    var ligne = grilleSudoku[i];
    for (var j = 0; j < ligne.length; j++) {
      var valeur = ligne[j];

      // Dessiner la cellule avec la valeur correspondante
      doc.rect(coordX, coordY, largeurCellule, hauteurCellule);
      doc.text(coordX + 2, coordY + 7, valeur !== '-' ? valeur : '');

      // Déplacer la position X pour la cellule suivante
      coordX += largeurCellule;
    }

    // Réinitialiser la position X et déplacer la position Y pour la ligne suivante
    coordX = 10;
    coordY += hauteurCellule;
  }

  // Enregistrer le fichier PDF avec un nom spécifié (exemple : sudoku.pdf)
  doc.save("sudoku.pdf");
}

// Conversion de la grille Sudoku au format requis
var board = board.map(ligne => ligne.split(''));

// Appel de la fonction pour générer le fichier PDF
genererPDF(grilleConvertie);*/
});

function transformSudokuGrid(grid) {
    // Vérifier que la grille contient exactement 81 caractères
    if (grid.length !== 81) {
        throw new Error("La grille doit contenir exactement 81 caractères.");
    }

    var transformedGrid = [];
    
    // Diviser la grille en lignes de 9 caractères
    for (var i = 0; i < 9; i++) {
        transformedGrid.push(grid.slice(i * 9, (i + 1) * 9));
    }

    return transformedGrid;
}
