import { config } from "@libs/environment"
import { Sequelize, DataTypes, Model } from "sequelize"
import mysql2 from "mysql2"

const sequalize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    dialect: "mysql",
    dialectModule: mysql2,
    host: config.db.host,
    port: config.db.port,
  }
)

export interface UserInstance extends Model {
  id: string
  name: string
  pushToken?: string
}

const User = sequalize.define<UserInstance>(
  "user",
  {
    id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
    name: { type: DataTypes.STRING },
    pushToken: { type: DataTypes.STRING },
  },
  { underscored: true }
)

export interface DayEntryInstance extends Model {
  userId: string
  date: string
  attemptsCount: number
  attemptsDetails: string
  word: string
  number: number
  createdAt: string
}

const DayEntry = sequalize.define<DayEntryInstance>(
  "day_entry",
  {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "compositeIndex",
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: "compositeIndex",
    },
    attemptsCount: { type: DataTypes.INTEGER },
    attemptsDetails: { type: DataTypes.STRING },
    word: { type: DataTypes.STRING },
    number: { type: DataTypes.INTEGER },
  },
  { underscored: true }
)

interface FriendshipInstance extends Model {
  userId: string
  friendId: string
}

const Friendship = sequalize.define<FriendshipInstance>(
  "friendship",
  {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "compositeIndex",
    },
    friendId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "compositeIndex",
    },
  },
  { underscored: true }
)

User.hasMany(DayEntry, { foreignKey: "userId" })
DayEntry.belongsTo(User, { foreignKey: "userId" })
User.belongsToMany(User, {
  through: Friendship,
  as: "friends",
  foreignKey: "userId",
})
User.belongsToMany(User, {
  as: "userFriends",
  foreignKey: "friendId",
  through: Friendship,
})

const models = { User, Friendship, DayEntry }

let isConnected = false

export const connectToDb = async () => {
  if (isConnected) {
    console.log("already connected, using existing connection")
    return models
  }
  console.log("creating connection to db")
  await sequalize.sync({ alter: true })
  await sequalize.authenticate()
  isConnected = true
  console.log("connected to db")
  return models
}
