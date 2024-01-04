var clientName = "";
//Function checks username entered is valid
function userNameChecker(enteredUserName){
    let validUsername = false //Boolean to check if username is valid or not
    //Set of characters which are valid
    let numberSet = ['0','1','2','3','4','5','6','7','8','9']
    let letterSet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','G','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']

    //Checks whether entered Username first character is a letter
    if(letterSet.includes(enteredUserName[0])){
    
    //Loops through entire username to check to see if all characters are valid
      for(let i = 1; i<enteredUserName.length; i++){
        
        let checkElement = enteredUserName[i]
        if(letterSet.includes(checkElement) || numberSet.includes(checkElement)){
          validUsername = true
          console.log("VALID")
        }
  
        else{
          //console.log(enteredUserName[i]);
          console.log("Invalid Username")
          validUsername = false
          break;
        }
    
      }
  
    }
  
    else{
      console.log("Invalid Username")
      validUsername = false
    }
    return validUsername
  
  }
  //Function called when login is pressed, sends request to server to check login credentials and uses response to accordingly manipulate page
  function loginWith(){
    let userName = document.getElementById('username').value.trim()
    let password = document.getElementById('password').value.trim()
    let userCredentials = {
      userName,password
      
    };
    let userRequestJSON = JSON.stringify(userCredentials);
    
    let xhr = new XMLHttpRequest()
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)
            if(response === false){
              let loginDiv = document.getElementById('loginLine');
              loginDiv.innerHTML+='<p>Incorrect credentials</p>'
            }
            else{
              clientName = userName;
              window.location.href = "/index.html";
              
            }

        }
      }
      xhr.open('POST', `/handleLogin`, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(userRequestJSON);
  }

  //Function called when book search is performed, sends request to server to get a series of books and show client
  function getBook(){
    
    let query = document.getElementById('searchTitle').value.trim();
    console.log(query);
    if(query === '') {
        return alert('Please enter a title')
    }

    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
          let response = xhr.responseText;

          document.getElementById('searchTitle').value = '';
          document.getElementById('bookResults').innerHTML = response

        }
      else if (xhr.status == 404) {
        console.log("Went here")
      }
    }
    xhr.open('GET', `/books?title=${query}`, true);
    xhr.send();

  }
  //Used to activate the register Div in order to allow new users to register
  function hideDiv(){
    var registerDiv = document.getElementById('registerLine');
    var loginDiv = document.getElementById('loginLine');

    if(loginDiv){
      loginDiv.hidden = true;
    }
    if(registerDiv){

      registerDiv.removeAttribute('hidden');
    }
  }
  //Function called when an action to register a user is performed, sends request to server
  function createUser(){

    let userName = document.getElementById('registerUsername').value.trim()
    let password = document.getElementById('registerPassword').value.trim()
    
    console.log(userName);
    console.log(password);

    let userNameValidity = userNameChecker(userName)
    console.log(userNameValidity);
    if(userNameValidity){
      let userCredentials = {
        userName,password
        
      }; 
      
      let userRequestJSON = JSON.stringify(userCredentials);
      
      let xhr = new XMLHttpRequest()
      xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)
            console.log("ZAMN",response);
            if(response === true){
              
              clientName = userName;
              window.location.href = "/index.html";
              //Gets it to a landing page of some sort
            }
        else if(xhr.readyState == 4 && xhr.status ==401){
            console.log("User already exists.")
            var registerDiv = document.getElementById('registerLine');
            registerDiv.innerHTML+='<p>Username already exists</p>'
            document.getElementById('registerUsername').value = ''
            document.getElementById('registerPassword').value = ''
            }
        }
      }
      xhr.open('POST', `/register`, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(userRequestJSON);
    }

    else{
      console.log("Invalid Username")
      document.getElementById('registerUsername').value = ''
      document.getElementById('registerPassword').value = ''
    }
  
  }
  //Function called when view users button is called, showing users to those only with admin access
  function handleUsers(){
    
    window.location.href = "/users";

  }
  //Function called when needing to add a book to a reading list of a user
  function addBook(){

    let windowURL = window.location.href;
    console.log(windowURL);
    let userCredentials = {
      windowURL
      
    };

    let userRequestJSON = JSON.stringify(userCredentials)
    console.log(userRequestJSON);
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) 
      {
        return alert('Book added successfully');
      }
    }
    xhr.open('POST', `/addBook`, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(userRequestJSON);

  }

  function viewList(){

    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
          
          let response = xhr.responseText;
          document.getElementById('userReadingList').innerHTML = response
      }
    }
    xhr.open('GET', `/viewList`, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();

  }

  function getBookbyAuthor(){

    let query = document.getElementById('searchTitle').value.trim();
    console.log(query);
    if(query === '') {
        return alert('Please enter an author')
    }

    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
          let response = xhr.responseText;

          document.getElementById('searchTitle').value = '';
          document.getElementById('bookResults').innerHTML = response

        }
      else if (xhr.status == 404) {
        console.log("Went here")
      }
    }
    xhr.open('GET', `/author?title=${query}`, true);
    xhr.send();

  }

