import { Inngest } from "inngest";
import User from "../models/User.js"
import Product from "../models/Product.js"
export const inngest = new Inngest({ id: "2nd-hand-e-commerce" });

// Inngest function to save user data to a database
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      image: image_url,
    };
    await User.create(userData);
  }
);

// Inngest function to delete user from database
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event, step }) => {
    const { id } = event.data;
    await step.log("recieved id", id)
    let res = await User.findByIdAndDelete(id);
    await step.log(res)
    let res2 = await Product.deleteMany({sellerId: id})
    await step.log(res2)

  }
);

// Inngest function to update user data in database
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      image: image_url,
    };
    await User.findByIdAndUpdate(id, userData);
  }
);

// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdation];
