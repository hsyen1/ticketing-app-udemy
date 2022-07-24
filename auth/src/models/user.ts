import mongoose from "mongoose";
import { PasswordUtil } from "../services/utils/password-util";

// interface that describes the properties
// that are required to create a new user
interface UserAttrs {
  email: string;
  password: string;
}

// Workaround for option 2:
// interface that describes the properties
// that a User Model has
// with a custom define method "build" that returns the UserDoc type
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// interface that describes the properties
// that a User Document has
// this is so that after creating a user model
// we can access the user doc attributes in *that* model created
// Disclaimer: mongo will add extra attributes to our original model such as createdAt/updatedAt,
// hence to have a workaround for Typescript and mongo to work together, this interface solves it
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  /**
   * removes unwanted properties from the schema returned by mongoose
   * typically not a good practice to do it here, better approach would be
   * convert these into another model using some conversion method in a MVC pattern
   */
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

/**
 * Middleware that intercepts the request before saving the model into mongo
 * to store the hashed password instead of plain text
 *
 * Uses function instead of () => because the latter will override the "this" keyword to
 * reference this file instead of the "this.model" that is gonna be saved
 */
userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await PasswordUtil.toHash(this.get("password"));
    this.set("password", hashed);
  }

  done();
});

// option 2:
// define a custom static method in the schema under the statics method
// named "build" so that we can define the type of attributes we want to initialize
// but this only works in javascript, not in Typescript due to its typing constraints
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

// UserModel will be the return type of this line of code
// calling the .build static method will return the UserDoc type
const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

// option 1:
// downside - need to export two items everytime we need a model
const buildUser = (attrs: UserAttrs) => {
  return new User(attrs);
};

// Examples:
// variable user is now a UserDoc type returned by mongo with extra attributes
// without the interface, we cant access the extra attribute
// as typescript will complain that no such attribtue exists
// const user = User.build({
//     email: 'test',
//     password: 'test'
// });

// user.email
// user.password
// user.createdAt
// user.updatedAt

export { User };
