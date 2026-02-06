// User Model
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const bcrypt = require("bcryptjs");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 50],
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "manager", "staff", "visitor"),
      defaultValue: "staff",
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    position: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    departmentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Department",
        key: "id",
      },
    },
    profileImage: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "User profile image path",
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "User biography/description",
    },
    qualifications: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Professional qualifications",
    },
    licenseNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Professional license number (for veterinarians)",
    },
    licenseExpiry: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    emergencyContact: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    emergencyPhone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    postalCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM("Male", "Female", "Not Specified"),
      allowNull: true,
    },
    nationalId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "National ID/Passport number",
    },
    loginAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: "Failed login attempts counter",
    },
    lockedUntil: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Account locked until timestamp",
    },
    twoFactorEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    twoFactorSecret: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    preferences: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "User preferences (theme, language, etc.)",
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Soft delete timestamp",
    },
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(
            parseInt(process.env.BCRYPT_ROUNDS) || 10,
          );
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(
            parseInt(process.env.BCRYPT_ROUNDS) || 10,
          );
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  },
);

User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  delete values.refreshToken;
  return values;
};

module.exports = User;
