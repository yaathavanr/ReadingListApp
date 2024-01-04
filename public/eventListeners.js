//Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    //This function is called after the browser has loaded the web page
  
    //Login.hbs
    //add listener to buttons
    var connectButton = document.getElementById('connect_button');
    if (connectButton) {
      connectButton.addEventListener('click', loginWith);
    }
  
    var regButton = document.getElementById('reg_button');
    if (regButton) {
      regButton.addEventListener('click', hideDiv);
    }
  
    var registerButton = document.getElementById('register_button');
    if (registerButton) {
      registerButton.addEventListener('click', createUser);
    }
  
    var usersButton = document.getElementById('user_button');
    if (usersButton) {
      usersButton.addEventListener('click', handleUsers);
    }
  
    //Index.hbs
    var searchButton = document.getElementById('search_button');
    if (searchButton) {
      searchButton.addEventListener('click', getBook);
    }
  
    var addButton = document.getElementById('add_book');
    if (addButton) {
      addButton.addEventListener('click', addBook);
    }
    var viewButton = document.getElementById('viewList_button');
    if (viewButton) {
      viewButton.addEventListener('click', viewList);
    }
    var searchAuthorButton = document.getElementById('searchAuthor_button');
    if (searchAuthorButton) {
      searchAuthorButton.addEventListener('click', getBookbyAuthor);
    }
  })