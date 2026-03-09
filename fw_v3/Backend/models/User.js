const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin", "superadmin"], default: "user" },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
}, { timestamps: true });

// Auto-approve super admin
userSchema.pre("save", function(next) {
  // Super admin: bhoomika7444@gmail.com
  if (this.email === "bhoomika7444@gmail.com") {
    this.role = "superadmin";
    this.status = "approved";
  } else if (this.role === "user") {
    this.status = "pending";
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
