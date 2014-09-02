exports.createMatrix = function(width, height){
  var matrix = [];
  for(var i = 0; i<height; i++){
    var row = new Array(width);
    row.clear();
    matrix.push(row);
  }
  return matrix;
}
exports.arrayToMatrix = function(array, width){
  var matrix = [];
  var row = [];
  for(var i = 0; i<array.length; i++){
    if(i % width === 0){
      row = [];
    }
    row.push(array[i]);
    if(i % width === width-1){
      matrix.push(row);
    }
  }
  return matrix;
}
exports.matrixToArray = function(matrix){
  var array = [];
  for(var i = 0; i<matrix.length; i++){
    array = array.concat(matrix[i]);
  }
  return array;
}