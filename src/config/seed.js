module.exports = {
    seed: function () {
        console.log('seeding database ...');
        var tasktemplate = require('../models/task-template').model;
        var t = new tasktemplate();
        t.creator = 'Gavin Gregory';
        t.name = 'Verify';
        t.description = 'Verify meta-data obtained through normal bootlegger channels ...';
        t.imageurl = 'img/hand/256x256/tick.png';
        t.imagereq = true;
        t.showvideo = true;
        t.validationreq = true;
        t.metatype = 'static_meta';
        t.metafield = 'validation';
        t.save(function (err) {
            if (err)    console.log(err);
        });
        var t2 = new tasktemplate();
        t2.creator = 'Gavin Gregory';
        t2.name = 'Add';
        t2.description = 'Add meta-data to a shoot by asking operators to tag items they see in the reference images you supply.';
        t2.imageurl = 'img/hand/256x256/add.png';
        t2.imagereq = true;
        t2.showvideo = true;
        t2.validationreq = true;
        t2.metatype = 'static_meta';
        t2.metafield = 'things_found';
        t2.save(function (err) {
            if (err) console.log(err);
        });
        var t3 = new tasktemplate();
        t3.creator = 'Gavin Gregory';
        t3.name = 'Quality';
        t3.description = 'Verify quality of audio and video.';
        t3.imageurl = 'img/hand/256x256/movie.png';
        t3.imagereq = false;
        t3.showvideo = true;
        t3.validationreq = true;
        t3.metatype = 'static_meta';
        t3.metafield = 'subjective';
        t3.save(function (err) {
            if (err) console.log(err);
        });
        var t4 = new tasktemplate();
        t4.creator = 'Gavin Gregory';
        t4.name = 'Subjective';
        t4.description = 'Ask operators to tag videos with subjective meta-data. Questions such as do you find this video funny?';
        t4.imageurl = 'img/hand/256x256/user-woman.png';
        t4.showvideo = true;
        t.validationreq = true;
        t4.metatype = 'static_meta';
        t4.metafield = 'subjective';
        t4.save(function (err) {
            if (err) console.log(err);
        });
    }
}
