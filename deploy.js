var config = require('./config'),
    fs = require('fs'),
    argv = require('optimist')
          .demand(['p'])
          .argv,
    cfg = {},
    async = require('async'),
    colors = require('colors'),
    now = new Date(),
    spawn = require('child_process').spawn,
    projectName = argv.p;


if ( !config.projects[projectName] ) {
  console.log('Project '+projectName+' doesn\'t exist');
  process.exit(1);
}

cfg  = config.projects[projectName];
cfg.localrepos = cfg.localrepos || config.global.defaultLocalReposPath + '/' + projectName;
cfg.target = cfg.target || config.global.defaultTargetPath + '/' + projectName;
cfg.target += '/' + now.getFullYear() + '-'
            + now.getMonth() + '-' 
            + now.getDate() + '-'
            + now.getHours() + '-'
            + now.getMinutes() + '-'
            + now.getSeconds();

cfg.tmpTarget = cfg.target + '.tmp';

var runCmd = function(cmd, args, opts, callback){
  var child = spawn(cmd, args, opts),
      result = '';

  child.stdout.on('data', function(data){
    process.stdout.write(data.toString());
    result += data.toString();
  });

  child.stderr.on('data', function(data){
    process.stderr.write(data.toString());
    result += data.toString();
  })

  child.on('close', function(code){
    callback(code, result);
  })
};

async.series([
  function(cb){
    runCmd('bash',[
      './tasks/clone.sh',
      cfg.repository,
      cfg.branch,
      cfg.localrepos
    ],{
      "cwd": __dirname
    }, function(err){
      cb(err);
    });
  },

  function(cb){
    runCmd('bash',[
      './tasks/archive.sh',
      cfg.localrepos,
      cfg.branch,
      cfg.tmpTarget
    ],{
      "cwd": __dirname
    }, function(err){
      fs.renameSync(cfg.tmpTarget, cfg.target);
      cb(err);
    });
  },

  function(cb){
    if(typeof cfg.makeTarget == 'undefined'){
      cb(null);
      return;
    }

    runCmd('bash',[
      './tasks/make.sh',
      cfg.target,
      cfg.makeTarget
    ],{
      "cwd": __dirname
    }, function(err){
      cb(err);
    });
  },

  function(cb){
    if(!cfg.wwwroot){
      cb(null);
      return;
    }

    runCmd('bash',[
      './tasks/link.sh',
      cfg.target,
      cfg.wwwroot
    ],{
      "cwd": __dirname
    }, function(err){
      cb(err);
    });
  }

], function(err, result){
  if(err){
    console.log('Failed.'.red);
    process.exit(1);
  }
});

