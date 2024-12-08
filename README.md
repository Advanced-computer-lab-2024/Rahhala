
# Rahhala

This project is a MERN stack virtual trip planner web app where users can book trips and itineraries, buy goods and souvenirs, and look up information about historic sites.

## Motivation

This project is part of the coursework of the Advanced Computer Lab university course, aiming at engaging the students in building a full stack project on their own through multiple sprints, encouraging self-study and trial and error. 

## Build Status
## Code Style

The backend is divided into 3 main parts:
- Models: database models
- Controllers: CRUD and functions needed for application
- Routes: assigning controllers names, methods and tokens if necessary.
There is also middlware file for user verifications.

The frontend consists of dashboards for every type of users.

## Screenshots
## Technologies Used

Frontend:
- React.js
- Axios
- Tailwind.js

Backend:
- node.js
- express.js

Database:
- MongoDB Atlas

Authentication:
- JSON Web Tokens

## Features

## Installations

### Prerequisites
Ensure all the following technologies are installed on your device:
- Node.js
- Git
- npm

### Installation Steps
1. Copy the repository URL link. Open VS Code and clone the repository using the URL you copied.
2. Create a new file called .env and store the following values in it.
```javascript
MONGO_URI=mongodb+srv://Yahya:rHgkAP86GQwz2DE@rahhala.tazze.mongodb.net/rahhala?retryWrites=true&w=majority&appName=Rahhala
Port=4000
JWT_SECRET=secret
MAILTRAP_USER=a6da4721eb679a
MAILTRAP_PASS=bf79d4c9ae2efe
```  
3. Open a terminal window. Navigate to the backend folder and install the dependencies needed.
```shell-script
cd backend
npm install
```

4. Open another terminal window. Navigate to the my-app folder and install the dependencies needed.
```shell-script
cd my-app
npm install
```

5. In the first terminal window, start the backend using this command:
 ```shell-script
npm run dev
```  
6. In the first terminal window, start the application using this command:
 ```shell-script
npm start
```  
## API Reference
## Credits
## License

[MIT](https://choosealicense.com/licenses/mit/)

