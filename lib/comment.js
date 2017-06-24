
var Comment = function(){
  Object.defineProperty(this, 'value', {
    set: function(val){
      this.value = val;
    },
    get: function(){
      return this.toString();
    }
  });
};

Comment.prototype.toString = function(){
  var commentString = '*\n * ';
  commentString += this.name;
  commentString += '\n * ';
  for(let p of this.params)
    commentString += '@param ' + p.name + '\n * ';
  if(this.async){
    commentString += '@async ' + this.async;
    commentString += '\n * ';
  }
  if(this.rTypes.length > 0){
    commentString += '@return {' + this.rTypes.join('|') + '}';
    commentString += '\n * '
  }
  if(this.tTypes.length > 0){
    commentString += '@throws {' + this.tTypes.join('|') + '}';
    commentString += '\n * ';
  }

  return commentString;
};

module.exports = Comment;
