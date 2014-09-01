$ = require("zepto");
_ = require("underscore");

$(function(){
  var sudokuBoard = [
    [2,3,4,0,7,5,5,8,5],
    [4,8,3,3,4,6,7,9,0],
    [9,5,4,5,3,5,6,4,9],
    [2,3,4,0,7,5,5,8,5],
    [4,8,3,3,4,6,7,9,0],
    [9,5,4,5,3,5,6,4,9],
    [2,3,4,0,7,5,5,8,5],
    [4,8,3,3,4,6,7,9,0],
    [9,5,4,5,3,5,6,4,9],
  ];

  var template = "";
  var tdTemplate = _.template("<td class='<%= classes %>'><input name='x[<%=x%>]y[<%=y%>]' type='tel' maxlength='1'></input></td>");

  for(var y = 0; y < sudokuBoard.length; y++){
    template += "<tr>";
    for(var x = 0; x < sudokuBoard[y].length; x++){
      var classes = [];
      if(x < 8){ classes.push("b-right") }
      if(y < 8){ classes.push("b-bottom") }
      if(x === 2){ classes.push("b-right-heavy") }
      if(x === 5){ classes.push("b-right-heavy") }
      if(y === 2){ classes.push("b-bottom-heavy") }
      if(y === 5){ classes.push("b-bottom-heavy") }

      template += tdTemplate({classes: classes.join(" "), x:x, y:y});
    }
    template += "</tr>";
  }
  $("#game-board table").append(template);
  
  var $sudokuCells = $("#game-board input[type='tel']");
  var $sudokuBoard = [];
  for(var y = 0; y < sudokuBoard.length; y++){
    var $cells = []
    for(var x = 0; x < sudokuBoard[y].length; x++){
      $cells.push($("#game-board input[name='x["+x+"]y["+y+"]']"))
    }
    $sudokuBoard.push($cells);
  }
  $sudokuBoard[0][0].val(2);
  $sudokuBoard[0][0][0].readOnly = true;

});
