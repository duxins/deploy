exports.global = {
  "defaultLocalReposPath": "/tmp/repos",
  "defaultTargetPath": "/tmp/targets"
};

exports.projects = {
  "test" : {
    "branch": "master",
    "repository": "git@github.com:duxins/deploy.git",
    "wwwroot": "/var/www/test",
    "makeTarget": ""
  }
};
