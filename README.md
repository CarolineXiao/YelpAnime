# YelpAnime
Production: https://yelp-anime.herokuapp.com/

## Overview
YelAnime is a website where anime lovers share their favorite anime series. Users can view others' posts and comment on them. They can also create, update and delete their own posts.

The app is built with Node.js, Express and MongoDB. 

## Technology used
### Front-end
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>jQuery</li>
  <li>Bootstrap</li>
  <li>Font Awesome</li>
  <li>Google Fonts</li>
</ul>

### Back-end
<ul>
  <li>Node.js</li>
  <li>Express</li>
  <li>EJS</li>
  <li>Moment.js</li>
  <li>Nodemailer</li>
  <li>Database:
    <ul>
      <li>MongoDB</li>
      <li>Mongoose</li>
      <li>MongoDB Altas</li>
    </ul>
  </li>
  <li>Authentication:
    <ul>
      <li>Passport</li>
    </ul>
  </li>
   <li>Other packages:
    <ul>
      <li>body-parser</li>
      <li>cloudinary</li>
      <li>method-override</li>
      <li>cloudinary</li>
      <li>async</li>
      <li>multer</li>
      <li>express-session</li>
      <li>passport-local</li>
      <li>passport-local-mongoose</li>
      <li>connect-flash</li>
      <li>dotenv</li>
    </ul>
  </li>
 </ul>
 
 ### Deployment
 * Heroku
 
## Features
* Responsive web design
* RESTful routes: show, create, edit, delete posts and comments
* Authentication
  + User signup with username, email and password
  + User login with username and password
  + User password reset with email
  + Admin user
* Authorization
  + User must login to create posts and comments
  + User can only edit or delete posts/comments that they created
  + Admin user can manage all posts and comments
  
