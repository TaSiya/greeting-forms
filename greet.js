function Greeting(storedData){
    var namesGreeted = {};
    var user = '';
    var language = "";
  
    function setName(value){ user = value; }
  
    function checking(){
       if(storedData){
          namesGreeted = storedData;
       }
       if(user !== ''){
          if(namesGreeted[user] === undefined){
            namesGreeted[user] = 0;
          }
       }
    }
    //To get the length of the names greeted
    function countGreeted(){ return Object.keys(storedData).length; }
  
    function getMap(){ return namesGreeted ; }
    function getName(){ return user; }
  
    return {
      userMap : getMap,
      checked : checking,
      userLength :countGreeted,
      setNames : setName,
      users : getName
    }
  }