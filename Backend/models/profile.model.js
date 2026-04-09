import mongoose from "mongoose";

const profileSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    bio: {
      type: String,
      default: ""
    },

    currentPost: {
      type: String,
      default: ""
    },

    education: [
      {
        degree: {
          type: String,
          default: ""
        },

        college: {
          type: String,
          default: ""
        },

        year: {
          type: String,
          default: ""
        }
      }
    ],

    experience: [
      {
        role: {
          type: String,
          default: ""
        },

        company: {
          type: String,
          default: ""
        },

        duration: {
          type: String,
          default: ""
        }
      }
    ]
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;