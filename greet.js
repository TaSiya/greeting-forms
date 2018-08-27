module.exports = function Greeting () {
    var namesGreeted = {};
    var counter = 0;
  
    function checking (value) {
      let flag = false;
       if(value !== ''){
          if(namesGreeted[value] === undefined){
            namesGreeted[value] =counter;
            counter ++;
            flag = true;
          }
       }
       return flag;
    }
    //To get the length of the names greeted
    function countGreeted(){ return Object.keys(storedData).length; }
  
    function getMap(){ return namesGreeted ; }
    function getCount(){ return counter;}
  
    return {
      userMap : getMap,
      checked : checking,
      userLength :countGreeted,
      getCount
    }
  }