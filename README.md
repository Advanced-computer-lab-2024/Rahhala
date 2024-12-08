
# Rahhala

This project is a MERN stack virtual trip planner web app where users can book trips and itineraries, buy goods and souvenirs, and look up information about historic sites.

## Motivation

This project is part of the coursework of the Advanced Computer Lab university course, aiming at engaging the students in building a full stack project on their own through multiple sprints, encouraging self-study and trial and error. 

## Build Status

There are misnavigations for some user dashboards, inconsistencies in design and wording problems around the system. Otherwise, the flow of the system is smooth.

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

The application has seven user types. They are:
1. Tourists:
  - They can book itineraries and activities.
  - They can view museums.
  - They have wallets on the system that they can add money to.
  - They can buy products.
  - They can redeem points.
  - They can file complaints about the system.
    
2. Guests:
  - They have limited access to system.
  - They can view itineraries and activities, but cannot book them.
    
3. Admins:
  - They can add new admins and tourism governors.
  - They can view sales reports of products, itineraries and activities.
  - They can accept and delete accounts from the system.
  - They can view and respond to complaints.
  - They can add new products, preference tags and activity categories.
  - They can flag inappropriate itineraries.

4. Sellers:
  - They can add, edit, and archive products.
    
5.  Tour Guides:
  - They can add new itineraries.
  - They can view sales reports of they itineraries.
  - They can file account deletion requests.
    
6.  Advertisers:
  - They can add, edit and delete activities.
  - They can file account deletion requests.
    
7. Tourism Governors:
  - They can add and view museums.
  - They can add, view and delete museum tags.

All users can edit details of their profiles, and some can have OTPs sent to their emails to change their passwords.

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
Yahya Al-Azhary
Youssef Hazem
Mahmoud Ayman 
Abdelrahman Gaballa
Youssef Hendawy
Mohamed Hefny
Omar Elsherif
Moazz Ahmed Abdellatif
Marawan Tawhed Fathy Abdelhady
## License

[MIT](https://choosealicense.com/licenses/mit/)

