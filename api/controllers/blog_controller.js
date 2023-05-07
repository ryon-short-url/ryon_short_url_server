'use strict';

var utils = require("../../untils/utils");
const { MongoClient } = require('mongodb');
const MONGODB_URI = 'mongodb+srv://ryonlink:DMtpq8nsbfU1tXdt@ryon01.kswslff.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const { google } = require('googleapis');
const key = require("../../untils/key");
const CONSTANT = require("../../constant/constant");
const blogger = google.blogger({
    version: 'v3',
    params: {
        key: key.apiKey
    }
});


// //get validate code
// exports.get_mapping_blog = async function (req, res) {
//     var originalUrl = await getMappingBlog(req.body.urlId);
//     if (originalUrl == null) {
//         res.json("error");
//     }
//     else {
//         res.send(originalUrl.blogId);
//     }
// };

// exports.create_mapping_blog = async function (req, res) {
//     var x = {
//         _id: req.body.urlId,
//         blogId: req.body.blogId,
//     }
//     await createMappingBlog(x, async (status) => {
//         if (status == 0) {
//             res.json(x);
//         }
//         else {
//             res.json("error");
//         }
//     });
// };

//delete
// exports.delete_mapping_blog = async function (req, res) {
//     var originalUrl = await deleteMappingBlog(req.body.urlId);
//     res.send(originalUrl);
// };
//
exports.get_posts = async function (req, res) {
    try {
        // const blogsResponse = await blogger.blogs.get({
        //     userId: 'self'
        // });

        //const blogId = blogsResponse.data.items[0].id;
        const postsResponse = await blogger.posts.list({
            blogId: "6147814081732795284",
            fetchBodies: "false",
            fetchImages: "true",
            maxComments: "0"
        });

        const posts = postsResponse.data.items;

        const blog_posts = new Map();

        var technology = [],
            culture = [],
            fashion = [],
            lifestyle = [],
            art = [],
            cuisine = [],
            newlist = []

        posts.forEach(async (item) => {
            var post_item = {
                id: item.id,
                blogId: item.blog.id,
                published: item.published,
                updated: item.updated,
                url: item.url,
                selfLink: item.selfLink,
                title: item.title,
                image: '',
                author: item.author,
                labels: item.labels,

            }
            if (item.images != null) {
                post_item.image = item.images[0].url
            }

            if (item.labels != null) {
                item.labels.forEach((label) => {
                    //technology
                    if (label == CONSTANT.typelist.technology) {
                        technology.push(post_item)
                    }
                    //culture
                    if (label == CONSTANT.typelist.culture) {
                        culture.push(post_item)

                    }
                    //fashion
                    if (label == CONSTANT.typelist.fashion) {
                        fashion.push(post_item)

                    }
                    //lifestyle
                    if (label == CONSTANT.typelist.lifestyle) {
                        lifestyle.push(post_item)

                    }
                    //art
                    if (label == CONSTANT.typelist.art) {
                        art.push(post_item)

                    }
                    //cuisine
                    if (label == CONSTANT.typelist.cuisine) {
                        cuisine.push(post_item)

                    }
                    //newlist
                    if (label == CONSTANT.typelist.newlist) {
                        newlist.push(post_item)

                    }

                    blog_posts[CONSTANT.typelist.technology] = technology;
                    blog_posts[CONSTANT.typelist.culture] = culture;
                    blog_posts[CONSTANT.typelist.fashion] = fashion;
                    blog_posts[CONSTANT.typelist.lifestyle] = lifestyle;
                    blog_posts[CONSTANT.typelist.art] = art;
                    blog_posts[CONSTANT.typelist.cuisine] = cuisine;
                    blog_posts[CONSTANT.typelist.newlist] = newlist;

                }

                )
            }
        });

        res.send(blog_posts);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};


///////////////Fuction///////////////////////////////////////
// create url
// const createMappingBlog = async (obj, callback) => {
//     await client.connect();
//     const collection = client.db("ryon01").collection("blog");
//     collection.insertOne(obj, function (err, res) {
//         if (err) {
//             //  console.log('Error occurred while inserting');
//             callback(err.code);
//             // return 
//         } else {
//             //  console.log('inserted record');
//             callback(0);
//             // return 
//         }
//     });
// }




// const getMappingBlog = async (urlId) => {
//     await client.connect();
//     const collection = client.db("ryon01").collection("blog");
//     var url = collection.findOne({ "_id": urlId });
//     return url
// }

// const deleteMappingBlog = async (urlId) => {
//     await client.connect();
//     const collection = client.db("ryon01").collection("blog");
//     var url = collection.deleteOne({ "_id": urlId });
//     return url
// }