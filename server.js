const http = require("http");
const mongoose = require('mongoose');
const Post = require('./model/post');
const dotenv = require('dotenv');
dotenv.config({ path: "./config.env" })
// console.log(process.env.PORT)
const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
)
mongoose.connect(DB)
    .then(() => {
        console.log('資料庫連線成功')
    })
    .catch((error) => {
        console, log('error', error)
    })



const requestListener = async (req, res) => {
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    }
    let body = "";
    req.on('data', chunk => {
        body += chunk
    })

    if (req.url == "/post" && req.method == "GET") {
        const posts = await Post.find();
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "success",
            "data": posts
        }))
        res.end();
    } else if (req.url == "/post" && req.method == "POST") {
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const newPost = await Post.create(
                    {
                        name: data.name,
                        content: data.content,
                        image: data.image,
                        tags: data.tages,
                        likes: data.likes
                    }
                )
                    .then(() => {
                        console.log("success", data)
                    })
                    .catch(error => {
                        console.log('error', error)
                    })
                res.writeHead(200, headers);
                res.write(JSON.stringify({
                    "status": "add  success",
                    "newPost": data
                }))
                res.end();


            }
            catch (error) {
                res.writeHead(400, headers);
                res.write(JSON.stringify({
                    "status": "false add ",
                    "message": "格式錯誤",
                    "error": error
                }))
                res.end();
                console.log(error);

            }
        })
    } else if (req.url == "/post" && req.method == "DELETE") {
        const post = await Post.deleteMany({})
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "delete  success",
            post: []
        }))
        res.end();
    } else if (req.url.startsWith('/post/') && req.method == "DELETE") {


        // const index = data.findIndex(e => e._id === id);
        const id = await req.url.split("/").pop();
        const deletePost = await Post.findByIdAndDelete(id);
        const data = await Post.find();
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "delete item  success",
            "id": data,
        }))
        res.end();
    } else if (req.url.startsWith('/post/') && req.method == "PATCH") {


        // const index = data.findIndex(e => e._id === id);
        const id = await req.url.split("/").pop();
        const data = JSON.parse(body);
        const patchPost = await Post.findByIdAndUpdate(id,
            {
                $set:
                {
                    "name": data.name,
                    "content": data.content,
                    "image": data.image,
                    "likes": data.likes,

                }
            });

        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "patch item  success",
            "data": patchPost,
        }))
        res.end();
    }
    else if (req.url == "/post" && req.method == "OPTIONS") {
        res.writeHead(200, headers);
        res.end()
    } else {
        res.writeHead(404, headers);
        res.write(JSON.stringify({
            "status": 'false',
            "message": "wrong path"
        }));
        res.end();
    }

}



// schema

// const testPost = new Post(
//     {
//         name: "elliot",
//         content: "test",
//         image: "rfoeroiegjoiwegjoiwetjgoiqegoiwe4jgoiqejroigjwriotjhorwijhoij",
//         tags: 44,
//         likes: 757575757575757575757575757575757
//     },

// )
// testPost.save()
//     .then(() => {
//         console.log('新增資料成功')
//     })
//     .catch(error => {
//         console.log(error)
//     })


const server = http.createServer(requestListener);
server.listen(process.env.PORT);