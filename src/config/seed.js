module.exports = {
    seed: function () {
        console.log('seeding database ...');
        var tasktemplate = require('../models/task-template').model;
        var t = new tasktemplate();
        t.creator = 'Gavin Gregory';
        t.name = 'Verify';
        t.description = 'Verify meta-data obtained through normal bootlegger channels ...';
        t.imageUrl = 'img/template1.png';
        t.refImageReq = true;
        t.showVideo = true;
        t.save(function (err) {
            if (err)    console.log(err);
        });
        var t2 = new tasktemplate();
        t2.creator = 'Gavin Gregory';
        t2.name = 'Add';
        t2.description = 'Add meta-data to a shoot by asking operators to tag items they see in the reference images you supply.';
        t2.imageUrl = 'img/template2.png';
        t2.refImageReq = true;
        t2.showVideo = true;
        t2.save(function (err) {
            if (err) console.log(err);
        });
        var t3 = new tasktemplate();
        t3.creator = 'Gavin Gregory';
        t3.name = 'Quality';
        t3.description = 'Verify quality of audio and video.';
        t3.imageUrl = 'img/template3.png';
        t3.refImageReq = false;
        t3.showVideo = true;
        t3.save(function (err) {
            if (err) console.log(err);
        });
        var t4 = new tasktemplate();
        t4.creator = 'Gavin Gregory';
        t4.name = 'Subjective';
        t4.description = 'Ask operators to tag videos with subjective meta-data. Questions such as do you find this video funny?';
        t4.imageUrl = 'img/template4.png';
        t4.showVideo = true;
        t4.save(function (err) {
            if (err) console.log(err);
        });
    }
}
