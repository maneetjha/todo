const mongoose  = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const user = new Schema({
    email: {type:String , unique:true},
    name: String,
    password: String
})


const todo=new Schema({
    title:String,
    done:Boolean,
    userID: ObjectId
})

const UserModel = mongoose.model('users', user)
const TodoModel = mongoose.model('todos' , todo)


module.exports = { 
    UserModel: UserModel,
    TodoModel: TodoModel
}
