const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");

const User = require("./src/models/user");
const Subreddit = require("./src/models/subreddit");
const Post = require("./src/models/post");
const Comment = require("./src/models/comment");

mongoose.connect(
  "mongodb://localhost:27017/reddit_clone" || process.env.MONGODB_URI
);

const seedDatabase = async () => {
  try {
    // Add fake users
    const users = [];
    for (let i = 0; i < 5; i++) {
      const hashedPassword = await bcrypt.hash("password123", 10);
      const user = new User({
        username: faker.internet.userName(),
        password: hashedPassword,
      });
      await user.save();
      users.push(user);
    }

    // Add fake subreddits
    const subreddits = [];
    for (let i = 0; i < 3; i++) {
      const subreddit = new Subreddit({
        name: faker.lorem.word(),
        description: faker.lorem.sentence(),
        moderators: [users[i % users.length]._id],
      });
      await subreddit.save();
      subreddits.push(subreddit);
    }

    // Add fake posts and comments
    for (let i = 0; i < subreddits.length; i++) {
      const subreddit = subreddits[i];
      for (let j = 0; j < 5; j++) {
        const post = new Post({
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraph(),
          author: users[j % users.length]._id,
        });
        await post.save();
        subreddit.posts.push(post);

        for (let k = 0; k < 3; k++) {
          const comment = new Comment({
            content: faker.lorem.sentence(),
            author: users[k % users.length]._id,
            post: post._id,
          });
          await comment.save();
          post.comments.push(comment);
        }
      }
      await subreddit.save();
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.disconnect();
  }
};

seedDatabase();
