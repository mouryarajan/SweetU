// const formidable = require('formidable');
// const fileSystem = require('fs');
// var {getVideoDurationInSeconds}=require("get-video-duration");
const fileHelper = require('../util/file');
const fs = require('fs');
const add = require('../models/m-add');

exports.getAdd = (req,res,next)=>{
    res.render('add', {
        pageTitle:"Addvertisement"
    });
}
exports.postAdd = (req, res, next) =>{
    const video = req.file;
    const title = req.body.inputTitle;
    const description = req.body.inputDescription;
    console.log(video);
    const x = video.filename;
    const videoUrl = "images/" + x;
    const Add = new add({
        video: videoUrl,
        title: title,
        description: description
    });
    Add.save()
    .then(result=>{
        res.redirect('/get-add');
    })
    .catch(err=>{
        console.log(err);
    })
    // var formData = new formidable.IncomingForm();
    // formData.maxFileSize = 1000*1024*1024;
    // formData.parse(req, function (error, files){
    //     var title = req.body.inputTitle;
    //     var description = req.body.inputDescription;
    //     var oldPathThumbnail = req.body.inputThumbnail.path;
    //     var thumbnail = "images/thumbnail/" + new Date().getTime() + "-" + files.inputThumbnail.name;
    //     fileSystem.rename(oldPathThumbnail, thumbnail, function(error){

    //     });
    //     var oldPathVideo = files.inputVideo.path;
    //     var newPath = "images/videos/" + new Date().getTime() + "-" + files.inputVideo.name;
    //     fileSystem.rename(oldPathVideo, newPath, function(error){
    //         getVideoDurationInSeconds(newPath).then(function(duration){
    //             var hours = Math.floor(duration/60/60);
    //             var minuts = Math.floor(duration/60)-(hours * 60);
    //             var seconds = Math.floor(duration %60);
    //             const Add = new add({
    //                 filePath: newPath,
    //                 thumbnail: thumbnail,
    //                 title: title,
    //                 description: description,
    //                 minutes: minuts,
    //                 seconds: seconds,
    //                 hours: hours,
    //                 taps: 0
    //             })
    //             Add.save()
    //             .then(result=>{
    //                 if(result){
    //                     res.redirect('/get-add');
    //                 }
    //             })
    //             .catch(err=>{
    //                 console.log(err);
    //             })
    //         });
    //     });
    // });
}