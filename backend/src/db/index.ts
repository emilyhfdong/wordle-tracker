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

interface UserInstance extends Model {
  id: string
  name: string
}

const User = sequalize.define<UserInstance>("User", {
  id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
  name: { type: DataTypes.STRING },
})

interface DayEntryInstance extends Model {
  userId: string
  date: string
  attempts: number
  details: string
}

const DayEntry = sequalize.define<DayEntryInstance>("DayEntry", {
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
  attempts: { type: DataTypes.INTEGER },
  details: { type: DataTypes.TEXT },
})

interface FriendshipInstance extends Model {
  userId: string
  date: string
  attempts: number
  details: string
}

const Friendship = sequalize.define<FriendshipInstance>("Friendship", {
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
})

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
  await sequalize.sync()
  await sequalize.authenticate()
  isConnected = true
  console.log("connected to db")
  return models
}
