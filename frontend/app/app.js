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
  var tdTemplate = _.template("<td class='<%= classes %>'><input type='tel' maxlength='1' value='<%= value %>'></input></td>");

  for(var y = 0; y < sudokuBoard.length; y++){
    template += "<tr>";
    for(var x = 0; x < sudokuBoard[y].length; x++){
      var classes = [];
      if(y === 0){ classes.push("b-top") }
      if(x === 0){ classes.push("b-left") }
      if(x === 8){ classes.push("b-right") }
      if(y === 8){ classes.push("b-bottom") }
      if(x === 2){ classes.push("b-right") }
      if(x === 5){ classes.push("b-right") }
      if(y === 2){ classes.push("b-bottom") }
      if(y === 5){ classes.push("b-bottom") }

      template += tdTemplate({value: sudokuBoard[y][x], classes: classes.join(" ")});
    }
    template += "</tr>";
  }

  $("#game-board table").append(template);
});
