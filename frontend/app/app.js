var $ = require("zepto");
var _ = require("underscore");
var Sudoku = require("./sudoku"); //3rd party sudoku generator
var util2 = require("./util2");

//a better cross browser way to set font-size, instead of using vh / vw
var fontFix = function () {
    var width = window.innerWidth || document.documentElement.clientWidth;
    var height = window.innerHeight || document.documentElement.clientHeight;

    var fontSize;
    if(width>768){
      fontSize = 0.037 * height;
    }else if(width > 480){
      fontSize = 0.034 * height;
    }else{
      fontSize = 0.045 * width;
    }
    document.body.style.fontSize = fontSize + "px";
};
window.addEventListener('resize', fontFix);
window.addEventListener('load', fontFix);

$(function(){

  //sets up a new sudoku board
  var setupNewGame = function(){
    var sudoku = new Sudoku();
    sudoku.level = 0;
    sudoku.newGame()
    var sudokuBoard = util2.arrayToMatrix(sudoku.matrix, 9)
    sudoku.solveGame();
    console.log("Solution:", JSON.stringify(util2.arrayToMatrix(sudoku.matrix, 9)));
    
    createGameBoard($("#game-board table"), sudokuBoard);

    var $sudokuCells = $("#game-board input");
    var $sudokuBoard = [];
    for(var y = 0; y < sudokuBoard.length; y++){
      var $cells = []
      for(var x = 0; x < sudokuBoard.length; x++){
        $cells.push($("#game-board input[name='y["+y+"]x["+x+"]']"))
      }
      $sudokuBoard.push($cells);
    }

    $sudokuCells.click(function(){
      if(!this.readOnly){
        this.select();
      }
    });
    $sudokuCells.on("input", function(){
      checkGameBoard($sudokuBoard, $sudokuCells);
    });
    
  };
  //checks for duplicate number occurances and invalid values
  var checkGameBoard = function($sudokuBoard, $sudokuCells){
    $sudokuCells.parent().removeClass("highlighted");
    var validCounter = 0; //counts valid squares
    var boxes = [[{},{},{}],[{},{},{}],[{},{},{}]]; //3x3 box counter
    for(var y = 0; y < $sudokuBoard.length; y++){
      var counter = {}; //horizontal counter
      var counter2 = {}; //vertical counter

      for(var x = 0; x < $sudokuBoard.length; x++){
        var value = $sudokuBoard[y][x].val();
        if(isNaN(value) || value === "0"){
          $sudokuBoard[y][x].parent().addClass("highlighted");
        }else if(value !== ""){
          validCounter++;
        }
        //checks 3x3's
        var yQuad = Math.floor(y/3);
        var xQuad = Math.floor(x/3);

        boxes[yQuad][xQuad][value] = boxes[yQuad][xQuad][value] || [];
        boxes[yQuad][xQuad][value].push($sudokuBoard[y][x]);

        //checks horizontals
        counter[value] = counter[value] || [];
        counter[value].push($sudokuBoard[y][x]);

        //checks verticals
        var value2 = $sudokuBoard[x][y].val();
        counter2[value2] = counter2[value2] || [];
        counter2[value2].push($sudokuBoard[x][y]);
      }

      for(var key in counter){
        if(counter[key].length > 1 && key !== ""){
          _.each(counter[key], function($el){
            $el.parent().addClass("highlighted");
            validCounter--;
          })
        }
      }
      for(var key in counter2){
        if(counter2[key].length > 1 && key !== ""){
          _.each(counter2[key], function($el){
            $el.parent().addClass("highlighted");
            validCounter--;
          })
        }
      }
    }
    _.each(util2.matrixToArray(boxes), function(counter){
      for(var key in counter){
        if(counter[key].length > 1 && key !== ""){
          _.each(counter[key], function($el){
            $el.parent().addClass("highlighted");
            validCounter--;
          })
        }
      }
    });
    if(validCounter === $sudokuBoard.length * $sudokuBoard.length){
      console.log("win!!");
      $("#win-menu").show();
      $("input").prop("disabled", true);
    }
  }
  //creates the basic sudoku game board w/ prefilled numbers
  var createGameBoard = function($el, sudokuBoard){
    var template = "";
    var tdTemplate = _.template("<td class='<%= classes %>'><input name='y[<%=y%>]x[<%=x%>]' type='tel' maxlength='1' value='<%= value %>' <%= inputAttr %>></input></td>");

    for(var y = 0; y < sudokuBoard.length; y++){
      template += "<tr>";
      for(var x = 0; x < sudokuBoard.length; x++){
        var classes = []; //classes on td
        if(x < sudokuBoard.length){ classes.push("b-right") }
        if(y < sudokuBoard.length){ classes.push("b-bottom") }
        if(x === 2){ classes.push("b-right-heavy") }
        if(x === 5){ classes.push("b-right-heavy") }
        if(y === 2){ classes.push("b-bottom-heavy") }
        if(y === 5){ classes.push("b-bottom-heavy") }
        var value = sudokuBoard[y][x] || null;
        var inputAttr = "";
        if(value){ 
          inputAttr = "readonly";
          classes.push("read-only")
        }
        template += tdTemplate({classes: classes.join(" "), x:x, y:y, value: value, inputAttr: inputAttr});
      }
      template += "</tr>";
    }
    $el.children().detach();
    $el.append(template);
  };
  setupNewGame();
  $("input").prop("disabled", true); //disables board while menu is out
  $("#start-menu .start-btn").click(function(e){
    e.preventDefault();
    $(this).parent().hide();
    $("input").prop("disabled", false);
  });
  $("#pause-menu .start-btn, #win-menu .start-btn").click(function(e){
    e.preventDefault();
    setupNewGame();
    $(this).parent().hide();
    $("input").prop("disabled", false);
  });
  $("#pause-menu .exit-btn").click(function(e){
    e.preventDefault();
    $(this).parent().hide();
    $("input").prop("disabled", false);
  });  
  $(".options-btn").click(function(e){
    e.preventDefault();
    if($("#start-menu").css('display') === 'none' && $("#win-menu").css('display') === 'none'){
      $("#pause-menu").show();
      $("input").prop("disabled", true);
    }
  }); 
});
