import { Types } from "mongoose";
import { User } from "./user.model";

export class UserRepository {
    async findUserById(userId: string) {
        const user = await User.findById(userId)
        return user
    }

    async groupUsersByInterests() {
        return await User.aggregate([
            {
             $unwind: "$interests",
            },
            {
             $group: {
                _id: "$interests",
                users: {
                    $push: {
                        id: "$_id",
                        name: "$name",
                        email: "$email",
                    },
                },
              },
            },
            {
              $sort: {
                _id: 1,
              },
            },
         ]);
    }

    async getUserWithPosts(userId: string) {
      return await User.aggregate([
          {
              $match: {
                  _id: new Types.ObjectId(userId),
              },
          },
          {
              $lookup: {
                  from: "posts",
                  localField: "_id",
                  foreignField: "author",
                  as: "posts",
              },
          },
      ]);
    }
}