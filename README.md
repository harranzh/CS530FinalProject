# CS530FinalProject

-	My dictionary application is implemented with Node and Express js, the database used to store user information and data that has been searched by the user is MongoDB, with the use of Mongoose to model my application data. 

- The registration and login authentication are implemented by using Passport js. In order to register into the application, the user only needs to provide its name, email and 8-character password, which the system stores and checks every time the user tries to log into the application. 

-	The application uses dictionary API provided by Merriam - Webster Dictionary to retrieve data and post it on a show page that the site reroutes the user to every time they request a definition of a word. An image is provided if found in the API, otherwise a no image tag is provided to the user if no image is found. 

  o	If user enters invalid English word or doesn’t search anything at all, a simple error message is produced to let the user know of the issue. Javascripts 
  check-word library was used to properly do the check.
