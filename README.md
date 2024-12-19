![Rahhala](https://github.com/user-attachments/assets/cdb7bcf7-9938-4f8b-a4ab-5674a03a54b6)
# Rahhala 🌍✈️

A comprehensive MERN stack virtual trip planner web application that enables users to book trips, purchase souvenirs, and explore historic sites.


## 🎯 Motivation

Part of the Advanced Computer Lab university course curriculum, this project challenges students to develop a full-stack application independently across multiple sprints, fostering self-learning and problem-solving skills.


## 🚀 Build Status

Current Status: Beta
- Minor navigation issues in user dashboards
- Design inconsistencies being addressed
- Payment not secure and does not support bank cards
- no hotel or flight reservation functionality yet
- UI and UX to be improved


## 💻 Code Architecture

### Backend Structure
- 📁 Models: MongoDB schema definitions
- 🎮 Controllers: Business logic and CRUD operations  
- 🛣️ Routes: API endpoint definitions with JWT authentication
- 🔒 Middleware: User verification and request processing

### Frontend Structure
- 🎨 Component-based architecture
- 📱 Responsive dashboard designs for all user types
- 🔐 Role-based access control

## 📸 Screenshots

<details>
<summary>1. Landing Page</summary>

![Landing Page](https://github.com/user-attachments/assets/49006f17-3900-4a17-b808-5209614089c3)

</details>

<details>
<summary>2. Signup Page</summary>

![Signup Page](https://github.com/user-attachments/assets/64962de3-95b5-48a4-a8b3-9ec3d5ed1bb2)

</details>

<details>
<summary>3. Login Page</summary>

![Login Page](https://github.com/user-attachments/assets/debdad32-bb36-424f-80d6-a5b0d43547f3)

</details>

<details>
<summary>4. Reset Password</summary>

![Reset Password](https://github.com/user-attachments/assets/a616187f-9aa6-47d1-b4fc-74ffa8071d45)

</details>

<details>
<summary>5. Guest Page</summary>

![Guest Page](https://github.com/user-attachments/assets/4454f787-dc65-4784-8422-216f5f6211b0)

</details>

<details>
<summary>6. Terms & Conditions</summary>

![Terms & Conditions](https://github.com/user-attachments/assets/8595b76f-20b6-4e29-989d-7f09d6ad04e3)

</details>

<details>
<summary>7. Tourist Profile</summary>

![Tourist Profile](https://github.com/user-attachments/assets/a838e36c-c275-4827-95b0-baa386262f3a)

</details>

<details>
<summary>8. Tourist Dashboard</summary>

![Tourist Dashboard](https://github.com/user-attachments/assets/1f08f652-2bc4-4310-8ba1-6215f5294601)

</details>

<details>
<summary>9. Tourists Purchase a Product</summary>

![Tourists Purchase a Product](https://github.com/user-attachments/assets/f35ab929-bda8-4dfd-8acb-fe2e9bcb605c)

</details>

<details>
<summary>10. Tourist Reviewing a Product</summary>

![Tourist Reviewing a Product](https://github.com/user-attachments/assets/2a4bdfcf-ac28-4596-ad5b-150c6b62b16c)

</details>

<details>
<summary>11. Seller Profile</summary>

![Seller Profile](https://github.com/user-attachments/assets/05e8b4b4-8061-4e38-bb8d-f366a87a66f4)

</details>

<details>
<summary>12. Governor Dashboard</summary>

![Governor Dashboard](https://github.com/user-attachments/assets/61dbc46f-f4b5-476f-a1bf-eaaa133e5214)

</details>

<details>
<summary>13. Sales Report</summary>

![Sales Report](https://github.com/user-attachments/assets/258a6f62-8484-4508-830e-a2db5d3f7282)

</details>

<details>
<summary>14. Admin Dashboard</summary>

![Admin Dashboard](https://github.com/user-attachments/assets/88393676-3a40-463a-abd9-9e07e7cb17bc)

</details>

<details>
<summary>15. Admin Management</summary>

![Admin Management](https://github.com/user-attachments/assets/0760da8a-6479-4ed3-bcf7-e6037922ef71)

</details>

<details>
<summary>16. Account Deletion Requests</summary>

![Account Deletion Requests](https://github.com/user-attachments/assets/08adea58-3877-4620-9d84-d7c361c4a3f7)

</details>

<details>
<summary>17. New Account Requests</summary>

![New Account Requests](https://github.com/user-attachments/assets/f68c4902-8e12-4b5d-9abe-b4ef075e4810)

</details>

<details>
<summary>18. Preference Tags</summary>

![Preference Tags](https://github.com/user-attachments/assets/5d06b2f0-40de-4a56-930a-44754d899472)

</details>

<details>
<summary>19. Products Page</summary>

![Products Page](https://github.com/user-attachments/assets/e8839d38-b451-4383-b654-c3394cb97013)

</details>

<details>
<summary>20. Complaints Page</summary>

![Complaints Page](https://github.com/user-attachments/assets/181a8777-36ec-456a-b6b8-361d20dd1920)

</details>

<details>
<summary>21. Add New Admin</summary>

![Add New Admin](https://github.com/user-attachments/assets/e25a1da1-3f7e-4ab6-b747-7d406a403700)

</details>

<details>
<summary>22. Notifications Page</summary>

![Notifications Page](https://github.com/user-attachments/assets/1fc275a7-cd03-400f-8e2b-ffb90851d6aa)

</details>



## 🛠️ Technologies and Frameworks Used

### Frontend
- React.js v18.3.1 - A JavaScript library for building user interfaces
- Axios v1.7.7 - Promise based HTTP client
- Tailwind CSS v3.4.14 - A utility-first CSS framework
- React Router DOM v6.28.0 - Declarative routing for React
- JWT Decode v4.0.0 - JWT token decoder

### Backend
- Node.js v18+ - JavaScript runtime
- Express.js v4.21.1 - Web application framework
- MongoDB v6.9.0 - NoSQL database
- Mongoose v8.7.0 - MongoDB object modeling
- JWT v9.0.2 - JSON Web Token implementation
- Nodemailer v6.9.16 - Email sending functionality
- Cors v2.8.5 - Cross-Origin Resource Sharing middleware

### Development Tools
- Nodemon v3.1.7 - Auto-reloading development server
- ESLint v9.11.1 - JavaScript linting utility
- Vite - Next generation frontend tooling


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
  - They can view sales reports of their products.
    
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

This is a link to the API reference document for all the APIs used in this project.
[Rahhala.postman_collection.json](https://github.com/user-attachments/files/18201513/Rahhala.postman_collection.json)


## 🤝 Contributing

We welcome contributions! If you'd like to contribute, please:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Credits

### 📚 Learning Resources

To help you understand the technologies used in this project, here are some recommended learning resources:

#### Node.js
- [Node.js Official Documentation](https://nodejs.org/docs/latest)
- [Node.js Crash Course by Traversy Media](https://www.youtube.com/watch?v=fBNz5xF-Kx4)
- [Learn Node.js on freeCodeCamp](https://www.freecodecamp.org/learn/apis-and-microservices/)

#### React.js
- [React Official Documentation](https://reactjs.org/docs/getting-started.html)
- [React Course by Codecademy](https://www.codecademy.com/learn/react-101)
- [Full React Tutorial by Net Ninja](https://www.youtube.com/playlist?list=PL4cUxeGkcC9gZD-Tvwfod2gaISzfRiP9d)

#### MongoDB
- [MongoDB University Free Courses](https://university.mongodb.com/)
- [MongoDB Crash Course](https://www.youtube.com/watch?v=pWbMrx5rVBE)
- [MongoDB with Node.js Tutorial](https://www.mongodb.com/docs/drivers/node/current/)

#### JWT Authentication
- [JWT.io Introduction](https://jwt.io/introduction)
- [JWT Authentication Tutorial](https://www.youtube.com/watch?v=7Q17ubqLfaM)
- [Implement JWT with Node.js](https://www.digitalocean.com/community/tutorials/nodejs-jwt-authentication-tutorial)

#### Express.js
- [Express.js Official Guide](https://expressjs.com/en/guide/routing.html)
- [Express.js Crash Course](https://www.youtube.com/watch?v=L72fhGm1tfE)
- [Learn Express.js on MDN](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs)

The project was created with the efforts of the developers:

- Yahya Al-Azhary

- Youssef Hazem

- Mahmoud Ayman 

- Abdelrahman Gaballa

- Youssef Hendawy

- Mohamed Hefny

- Omar Elsherif

- Moazz Ahmed Abdellatif

- Marawan Tawhed Fathy Abdelhady
  
- Youssef Allam


## License

[LICENSE.txt](https://github.com/user-attachments/files/18201642/LICENSE.txt)
