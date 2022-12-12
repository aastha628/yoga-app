
# Yoga App

This is a system that allows users to enroll for the yoga classes, select batch preferences, make payments and more. With this system I try to exercise my back-end development skills.
Tech stack used includes-
1. Node.js - For back-end with **express.js** framework.
2. PostgreSQL - As the **relational database** for the system.
3. Vanilla.js - For the front-end.

The is deployed over [Render](https://render.com/) and can be viewed here - https://yoga-app-cy0o.onrender.com/

## Features

### Project Requirements
1. Only people within the age limit of 18-65 can enroll for the monthly classes and they will be paying the fees on a month on month basis. I.e. an individual will have to pay the fees every month and he can pay it any time of the month.
2. They can enroll any day but they will have to pay for the entire month. The monthly fee is 500/- Rs INR. 
3. There are a total of 4 batches a day namely 6-7AM, 7-8AM, 8-9AM and 5-6PM. The participants can choose any batch in a month and can move to any other batch next month. I.e. participants can shift from one batch to another in different months but in same month they need to be in same batch.

### Implementation Details
1. On user registration page itself, we have provided a **seekbar** that only allows to set age between **18-65**. Even if anyhow, wrong age details reach the back-end, they are checked and status code **400 Bad Request** is sent.
2. We added a field `due_date` for every user, which defines when the user has to pay fees. After this date user is not allowed to view the online classes and a status code **402 Payment Required** is sent.
> Assumptions - Let's say a user registers on the app on **December 12, 2022**, then his initial due_date is set to **January 1, 2023**. This means he is allowed to view the content only till **December 31, 2022**, after which he has to make payments to attend the online classes.
3. A user is allowed to change the batch, but it comes into affect only after the current month. To handle this test case a field `end_date` is present for each user. **User can change his batch, but it will only affect his next batch** *(Except for the first time, when he needs to set the current batch)*.

### ER Diagram
Image upload on Github is not working, so I have uploaded the ER-Diagram as pdf into my drive.
You can find the PDF - https://drive.google.com/file/d/1iLgkYTFU_Mtw2IXYSUXh8mE8AEv0tjzF/view?usp=share_link

### Front-end Pages
The app constitutes of following front-end pages that help user to work inside the app-
1. Home Page `/index` - This is the landing page for the app through which users can navigate to register and login pages.
2. Register Page `/register` - If a new user comes, he can create an account for himself, or an already existing user can choose to navigate to the Login page.
3. Login Page `/login` - If the user is already registered than he can authenticate himself using email and password.
4. User Dashboard `/user-home` - Here user can see his details, as well as the details of the selected batch and payment status as well.
5. Batch Selection Page `/batch` - This contains list of all the batches that the yoga classes have to offer, and are dynamically rendered over the screen. This makes the app scalable as the batches can be added and removed when and as needed.
6. Payments Page `/payment` - User can use this page to make payments for their current batch in the yoga classes.

## Setting on Local Machine
### Database
1. Install [PostgreSQL](https://www.postgresql.org/download/) on your local machine.
2. Create database - `CREATE  DATABASE yoga_app_db;`
3. Create new user for this database with all privileges.
	```SQL
	CREATE USER yoga_app_user WITH  ENCRYPTED  PASSWORD  'some_secure_key';

	GRANT ALL PRIVILEGES ON  DATABASE messaging_app TO yoga_app_user;

	ALTER DEFAULT PRIVILEGES
	IN SCHEMA public 
	GRANT ALL PRIVILEGES ON TABLES TO yoga_app_user;

	ALTER DEFAULT PRIVILEGES
	IN SCHEMA public 
	GRANT ALL PRIVILEGES ON SEQUENCES TO yoga_app_user;
	```
4. Create following database tables - 
	a. batch
	```SQL
	CREATE  TABLE batch(
		id serial  PRIMARY  KEY,
		start_time int  NOT  NULL,
		duration int  NOT  NULL,
		instructor_name TEXT,
		batch_name TEXT,
		description  TEXT
	);
	```
	b. users
	```SQL
	CREATE  TABLE users(
		id serial  PRIMARY  KEY,
		name  TEXT  NOT  NULL ,
		email TEXT  NOT  NULL UNIQUE ,
		password  TEXT  NOT  NULL,
		age INT  NOT  NULL,
		gender TEXT  NOT  NULL ,
		curr_batch INT  REFERENCES batch (id) ON DELETE  SET  NULL,
		next_batch INT  REFERENCES batch (id) ON DELETE  SET  NULL,
		end_date DATE,
		due_date DATE  NOT  NULL
	);
	```
	c. payment
	```SQL
	CREATE  TABLE payment(
		id serial  PRIMARY  KEY,
		user_id  INT  REFERENCES users (id) ON DELETE  SET  NULL,
		amount INT  NOT  NULL ,
		payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);
	```
5. Populate `batch` table using the following SQL query - 
	```SQL
	insert into batch(
		batch_name,
		instructor_name,
		start_time,
		duration,
		description
	) values
	('Batch 1','Shilpa Shetty',0600,60,'This batch will help you get morning vibes'),
	('Batch 2','Baba Ram Dev',0700,60,'Yoga is the discipline that opens the door to inner freedom'),
	('Batch 3','Navneet Namdev',0800,60,'The wave uniting with its depth is yoga'),
	('Batch 4','Sri Sri Ravi Shankar',1700,60,'Yoga is, undoubtedly, the best app that everyone must download in their life');
	```
### Express Server
1. Create a new `.env` file and copy the content from the `.env.example` file, and set values for the variables. If you followed above commands to setup your database, then typical `.env` file would look like-
	```
	PORT=3000
	ENVIRONMENT="dev"
	DB_HOST="localhost"
	DB_PORT=5432
	DB_NAME="yoga_app_db"
	DB_USER="yoga_app_user"
	DB_PASSWORD="some_secret_key"
	JWT_KEY="secret"
	```
2. Install the dependencies, and run the server, using the command - `npm install && npm start`