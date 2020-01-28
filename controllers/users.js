const JWT = require('jsonwebtoken');
const User = require('../models/User');
const { secret } = require('../config/database');

// const removeUser = () => {
//     Comment.remove({ user_id: 5 })
//         .then(() => {
//             return Post.remove({ user_id: 5 });
//         })
//         .then(() => {
//             return User.findOneAndRemove({ id: 5 });
//         })
//         .catch(error => {
//             console.log('There was an error: ', error);
//         });
// };


// const removeUser = async () => {
//     try {
//         await Comment.remove({ user_id: 5 });
//         await Post.remove({ user_id: 5 });
//         await User.findOneAndRemove({ id: 5 });
//     } catch (error) {
//         console.log('There was an error: ', error);
//     }
// };

module.exports = {
    signUp: async (req, res, next) => {

        let newUser = new User(
            { email, password } = req.value.body
        );

        User.addUser(newUser, (err, user) => {
            if (err) {
                let message = "";
                if (err.errors.username) message = "Username is already taken.";
                if (err.errors.email) message += "Email already taken.";
                return res.json({
                    success: false,
                    message
                });
            } else {
                const token = JWT.sign({
                    type: "user",
                    data: user
                }, secret, {
                    expiresIn: 604800 // for 1 week timein milliseconds
                });

                return res.json({
                    success: true,
                    token: 'JWT ' + token,
                    message: "User registration successful."
                })
            }
        });
    },

    signIn: async (req, res, next) => {

        // Generate the token
        const token = JWT.sign({
            type: "user",
            data: req.user
        }, secret, {
            expiresIn: 604800 // for 1 week timein milliseconds
        });

        res.status(200).json({
            success: true,
            token: 'JWT ' + token,
            message: "User logged in successfully.",
            user: req.user
        });
    },

    secret: async (req, res, next) => {
        res.json({ 'msg': 'secret UserController' });
        console.log('secret UserController');
    },

    custom: async (req, res, next) => {
        let { name, priority, description, duedate } = req.body;
        try {

            let newTodo = await Todo.create({
                name,
                priority: parseInt(priority),
                description,
                duedate
            }, {
                fields: ["name", "priority", "description", "duedate"]
            });

            if (newTodo) {
                res.json({
                    success: true,
                    data: newTodo,
                    message: `Register Successfuly`
                });
            } else {
                res.json({
                    success: false,
                    message: `Insert a new Todo failed!`
                });
            }

        } catch (error) {
            res.json({
                success: false,
                message: `Insert a new Todo failed! Error:${error}`
            });
        }
        res.json({ 'msg': 'custom UserController' });
        console.log('custom UserController');
    },

    update: async (req, res, next) => {

        const { id } = req.params;
        let { name, priority, description, duedate } = req.body;

        try {

            let todos = await Todo.findAll({
                attributes: ["name", "priority", "description", "duedate"],
                where: { id }
            });

            if (todos.length > 0) {

                todos.forEach(async todo => {
                    await todo.update({
                        name: name ? name : todo.name,
                        priority: priority ? priority : todo.priority,
                        description: description ? description : todo.description,
                        duedate: duedate ? duedate : todo.duedate
                    });
                });

                res.json({
                    success: true,
                    data: todos,
                    message: `Update a Todo successfuly`
                });

            } else {
                res.json({
                    success: false,
                    message: `Cannot find Todo to update!`
                });
            }

        } catch (error) {
            res.json({
                success: false,
                message: `Cannot update a Todo! Error:${error}`
            });
        }

    },

    destroy: async (req, res, next) => {

        const { id } = req.params;

        try {

            await Task.destroy({ where: { todoId: id } });
            let numberOfDeletedRows = await Todo.destroy({ where: { id } });

            res.json({
                success: true,
                count: numberOfDeletedRows,
                message: `Delete a Todo successfuly`
            });

        } catch (error) {
            res.json({
                success: false,
                message: `Delete a Todo failed! Error:${error}`
            });
        }

    },

    index: async (req, res, next) => {

        try {

            let todos = await Todo.findAll({
                attributes: ["name", "priority", "description", "duedate"],
                order: [
                    ['name', 'ASC']
                ]
            });

            res.json({
                success: true,
                data: todos,
                message: `Query list of todos successfuly`
            });

        } catch (error) {
            res.json({
                success: false,
                message: `Query list of todos failed! Error:${error}`
            });
        }

    },

    show: async (req, res, next) => {

        const { id } = req.params;

        try {

            let todo = await Todo.findAll({
                attributes: ["name", "priority", "description", "duedate"],
                where: { id },
                include: {
                    model: Task,
                    as: 'tasks',
                    required: false
                }
            });

            if (todos.length > 0) {
                res.json({
                    success: true,
                    data: todos[0],
                    message: `Query list of todos successfuly`
                });
            } else {
                res.json({
                    success: false,
                    message: `Can't find Todo to show!`
                });
            }

        } catch (error) {
            res.json({
                success: false,
                message: `Query list of todos(by id) failed! Error:${error}`
            });
        }

    },

}