## BACKEND GUIDE
#### Open server
First you need to have MySQL server up, if this is not true server will throw an error. Once you have done this, write this on terminal (on Backend path).
``
npm start
``

#### Obtain data
To obtain data you need to make request to de ip address + port + endpoint. 
Example:  ``localhost:8000/get/post/1``

Once you made the request, you will recieve an object with two parameters: "data", and "status". If status is false, data will contain an error message. Otherwise, if status is true, data will contain the data you requested for (Or just a feedfack for a login request).

#### Get images
Images are stored in the backend server. An image filename will be provided to you when you request for one, to retrieve that image from the server you will need to access like it was a request. It's important you access first to "images" and then specify what type of image is Example:
``
<img src="localhost:8000/images/profile/$2$10SDAdsaxase324dsa4dsaE2DFA2343.jpg" />
<img src="localhost:8000/images/post/$2$10SDSAD23dsaE2DFADSADSADSxasdSDAD23QA_1.jpg" />
<img src="localhost:8000/images/post/$2$10SDSAD23dsaE2DFADSADSADSxasdSDAD23QA_2.jpg" />
``
Notice that before the filename I writed "profile", this is just to create an order in server files. If you want to access to a profile picture, access through "profile". If you want to acces to a post image, access through "post" and also indicate the number, because maybe there is more than one image.

#### Make login request
To make the request to login you just need to make a post request to auth/login endpoint. You need to make sure the data object passed through POST has "email" and "password" parameters. Otherwise it will not work.