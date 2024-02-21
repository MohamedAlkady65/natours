const User = require("../model/usermodel.js");
const factory = require("../utils/factoryHandler.js");

exports.getAllUsers = factory.getAll(User);

exports.createUser = factory.create(User);

exports.getOneUser = factory.getOne(User);

exports.updateUser = factory.update(User);

exports.deleteUser = factory.delete(User);
