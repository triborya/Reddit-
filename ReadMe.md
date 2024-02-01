# Reddit-like back

## Used:

- backpack-core
- jsonwebtoken
- body-parser
- mongoose
- express
- dotenv
- bcrypt
- faker
- cors

## How to use:

1. Clone this project.
2. Install dependencies using `npm i` (or yarn).
3. Create a .end file with your PORT, MongoDB connection string and JWT_SECRET.
4. Populate the DB with fake datas using `node seed.js`.
5. Use Postman or the db.rest file to make requests, for .rest files you need a extension named `REST Client`.

## Known issues (Work in progress)

Forbidden token.

## Find a bug?

If you found a bug or would like to submit an inprovement to this project, feel free.

## Structure

```bash
src/
┣ controllers/
┃ ┣ commentController.js
┃ ┣ postController.js
┃ ┣ subredditController.js
┃ ┗ userController.js
┣ middlewares/
┃ ┗ authenticateToken.js
┣ models/
┃ ┣ comment.js
┃ ┣ post.js
┃ ┣ subreddit.js
┃ ┗ user.js
┣ routes/
┃ ┣ commentRoutes.js
┃ ┣ postRoutes.js
┃ ┣ subredditRoutes.js
┃ ┗ userRoutes.js
┣ app.js
┣ db.rest
┣ index.js
┗ seed.js
```
