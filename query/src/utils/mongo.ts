import { Collection } from "mongodb";
import { RedditPostDoc, UserDoc } from "../models/mongo.models.js";

class MongoConnection {
    postsCollection: Collection<RedditPostDoc>;
    usersCollection: Collection<UserDoc>;
    async connect() {
        
    }
}