import { Types } from "mongoose";
import { User } from "./user.model";

export class UserRepository {

    async getAllUsers(page: number, limit: number) {
        const skip = (page - 1) * limit;
            const [users, total] = await Promise.all([
                User.find()
                .select("-password")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

                User.countDocuments(),
            ]);

            return {
                users,
                pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                },
            };
    }

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