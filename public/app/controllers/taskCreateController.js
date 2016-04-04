angular.module('bootleggerApp')
.controller('taskCreateController', function ($location, $scope, $log, taskTemplateFactory, taskFactory, shootFactory, localStorage, $stateParams, Upload, $timeout) {

  // the initial state, used for reset
  var initialTask = {
    job_count: 50,
    meta_value: 'lead_singer',
    name: 'locate lead_singer',
    description: 'Please locate the lead singer',
    support_email: 'g.i.gregory@ncl.ac.uk',
    passes: 1,
    segment_size: 15,
    creator: localStorage.getObject('me').profile.displayName,
    shoot_id: $stateParams.shoot_id,
    template_id: $stateParams.template_id,
    cml: '<img src="https://crowd.bootlegger.tv/crowd/image/{{task_id}}/0"/>\n<iframe src="https://crowd.bootlegger.tv/crowd/video/{{video_path}}/{{video_start}}/{{video_end}}" frameBorder="0" width="100%" height="100%" style="height: 320px; width: 100%;" ></iframe>\n<cml:radios label="Have you found what you are looking for in the video footage?" validates="required">\n<cml:radio label="Yes" value="true" />\n<cml:radio label="No" value="false" />\n<cml:radio label="I am unable to verify" value="na" />\n</cml:radios>',
    css: 'body { color: black }',
    js: "require(['jquery-noconflict'], function($) {\n//Ensure MooTools is where it must be\nWindow.implement('$', function(el, nc){\nreturn document.id(el, nc, this.document);\n});\nvar $ = window.jQuery;\n//jQuery goes here\n});  ',",
    instructions: 'Please observe the reference image and then watch the video from start to finish. If you locate the person/object shown in the image at any point within the video, please answer YES, otherwise answer NO.',
    cent_per_job: 1,
  };

  // the form data
  $scope.formData = angular.copy(initialTask);
  // template (fetched from factory)
  $scope.template = {};
  // array of videos + meta data (fetched from factory)
  $scope.videos = {};
  // regex for meta field
  $scope.metaRegex = /[a-zA-Z\,]/;

  /*****************************
   * FILE UPLOAD
   **/
  $scope.submitForm = function(files) {
    $scope.formData.videos = $scope.videos;

    // create a new task
    taskFactory.createTask($stateParams.shoot_id, $scope.formData)
      .success(function (data) {
        // if successful, upload the reference image(s)
        files.upload = Upload.upload({
          url: '/api/v1/shoots/' + $stateParams.shoot_id + '/tasks/' + data.data._id + '/upload-image',
          method: 'POST',
          arrayKey: '',
          file:

        }).then(function (resp) {
           window.location.replace('#/dashboard/shoots/' + $stateParams.shoot_id + '/tasks/' + data.data._id);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
      })
      .error(function (data, status, headers, config) {
        $log.log(data + ' ' + status);
      });
   }

  // load template
  taskTemplateFactory.getTemplate($stateParams.template_id)
    .success(function (data) {
      $scope.template = data;
      $scope.formData.meta_object = data.meta_object;
      $scope.formData.meta_key = data.meta_key;
    })
    .error(function (data, status, headers, config) {
      $log.log(data.errors + ' ' + status);
    });

  shootFactory.getShoot($stateParams.shoot_id)
    .success(function (data) {
      $scope.videos = data;
    })
    .error(function (data, status, headers, config) {
      $log.log(data.errors + ' ' + status);
    });

  // reset form
  $scope.reset = function () {
    $scope.formData = angular.copy(initialTask);
    if ($scope.taskForm)
      $scope.taskForm.$setPristine(true);
  }

  // submit form
  $scope.submit = function (task) {
    // upload the files in fileloader
    taskFactory.createTask(task)
      .success(function (data) {
        console.log(data);
      })
      .error(function (data, status, headers, config) {
        $log.log(data.errors + ' ' + status);
      });
  };

  // call reset to init formData
  $scope.reset();
});
