$ = require("zepto");
_ = require("underscore");

$(function(){
  
  var setupNewGame = function(){
    var sudokuBoard = [
      [2, null,4,0,7,5,5,8,5],
      [4,8,3,3,4,6,7,9,0],
      [9,5,4,5,3,5,6,4,9],
      [2,3,4,0,7,5,5,8,5],
      [4,8,3,3,4,6,7,9,0],
      [9,5,4,5,3,5,6,4,9],
      [2,3,4,0,7,5,5,8,5],
      [4,8,3,3,4,6,7,9,0],
      [9,5,4,5,3,5,6,4,9],
    ];
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
      console.log("change!!");

      checkGameBoard($sudokuBoard, $sudokuCells);
    });
    
  };
  //checks for duplicate number occurances and invalid values
  var checkGameBoard = function($sudokuBoard, $sudokuCells){
    $sudokuCells.removeClass("highlighted");
    $sudokuCells.parent().removeClass("highlighted");
    for(var y = 0; y < $sudokuBoard.length; y++){
      var counter = {}; //horizontal counter
      var counter2 = {}; //vertical counter

      for(var x = 0; x < $sudokuBoard.length; x++){
        var value = $sudokuBoard[y][x].val();
        if(isNaN(value) || value === 0){
          $sudokuBoard[y][x].addClass("highlighted");
          $sudokuBoard[y][x].parent().addClass("highlighted");
        }
        //checks horizontals
        counter[value] = counter[value] || [];
        counter[value].push($sudokuBoard[y][x]);

        //checks verticals
        var value2 = $sudokuBoard[x][y].val();
        counter2[value2] = counter2[value2] || [];
        counter2[value2].push($sudokuBoard[x][y]);
      }

      for(var key in counter){
        if(counter[key].length > 1){
          _.each(counter[key], function($el){
            $el.addClass("highlighted");
            $el.parent().addClass("highlighted");
          })
        }
      }
      for(var key in counter2){
        if(counter2[key].length > 1){
          _.each(counter2[key], function($el){
            $el.addClass("highlighted");
            $el.parent().addClass("highlighted");
          })
        }
      }
    }
  }
  //creates the basic sudoku game board w/ prefilled numbers
  var createGameBoard = function($el, sudokuBoard){
    var template = "";
    var tdTemplate = _.template("<td class='<%= classes %>'><input name='y[<%=y%>]x[<%=x%>]' type='tel' maxlength='1' value='<%= value %>' <%= inputAttr %>></input></td>");

    for(var y = 0; y < sudokuBoard.length; y++){
      template += "<tr>";
      for(var x = 0; x < sudokuBoard.length; x++){
        var classes = [];
        if(x < sudokuBoard.length){ classes.push("b-right") }
        if(y < sudokuBoard.length){ classes.push("b-bottom") }
        if(x === 2){ classes.push("b-right-heavy") }
        if(x === 5){ classes.push("b-right-heavy") }
        if(y === 2){ classes.push("b-bottom-heavy") }
        if(y === 5){ classes.push("b-bottom-heavy") }
        var value = sudokuBoard[y][x];
        var inputAttr = value ? "readonly" : "";
        template += tdTemplate({classes: classes.join(" "), x:x, y:y, value: value, inputAttr: inputAttr});
      }
      template += "</tr>";
    }
    $el.children().detach();
    $el.append(template);
  };

  setupNewGame();
  

});
