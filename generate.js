//var GitHubApi = require("github");
var os = require('os');
var fs = require('fs');
var readlineSync = require('readline-sync');
var events = require('events');
var github = require('./auth.js')

var eventEmitter = new events.EventEmitter();

var owner = "github-for-unity";
var repo = "Unity";


github.events.on('authenticated', function(token) {
    getReleaseChangeLog();
})

github.login();

function getReleaseChangeLog()
{
    github.repos.getReleases({
        owner: owner,
        repo: repo,
        page: 1,
        per_page: 1
    }, function(err, releases) {
        var res = releases.data[0];
        //console.error(JSON.stringify(JSON.parse(JSON.stringify(res)),null,'\t'));
        var tag = res.tag_name;
        var date = res.created_at;

        github.gitdata.getTags({
            owner: owner,
            repo: repo,
        }, function(err, res) {
            
            var t = res.data.filter(function(el) {
                return el.ref == "refs/tags/" + tag;
            });
            
            var sha = t[0].object.sha;
            console.error("Previous release tag: " + tag);
            //console.error(JSON.stringify(JSON.parse(JSON.stringify(res)),null,'\t'));

            var list = "# Release Notes" + os.EOL + os.EOL;
            github.issues.getForRepo({
                owner: owner,
                repo: repo,
                state: "closed",
                labels: "feature",
                since: date
            }, function(err, res) {
                //console.error(JSON.stringify(res));
                var hasStuff = res.data.length;
                if (hasStuff)
                    list += "## Features" + os.EOL;
                for (var issue in res.data) {
                    if (issue != "meta")
                        list += "- #" + res.data[issue].number + " - " + res.data[issue].title + os.EOL;
                }


                github.issues.getForRepo({
                    owner: owner,
                    repo: repo,
                    state: "closed",
                    labels: "enhancement",
                    since: date
                }, function(err, res) {
                    //console.error(JSON.stringify(res));
                    
                    hasStuff = res.data.length;
                    if (hasStuff)
                        list += "## Enhancements" + os.EOL;
                    for (var issue in res.data) {
                        if (issue != "meta")
                            list += "- #" + res.data[issue].number + " - " + res.data[issue].title + os.EOL;
                    }

                    github.issues.getForRepo({
                        owner: owner,
                        repo: repo,
                        state: "closed",
                        labels: "bug",
                        since: date
                    }, function(err, res) {
                        //console.error(JSON.stringify(res));
                        
                        hasStuff = res.data.length;
                        if (hasStuff)
                            list += "## Fixes" + os.EOL;
                        for (var issue in res.data) {
                            if (issue != "meta")
                                list += "- #" + res.data[issue].number + " - " + res.data[issue].title + os.EOL;
                        }

                        list += os.EOL;

                        list += "=====" + os.EOL;
                        list += "Pull Requests" + os.EOL;
                        list += "=====" + os.EOL;
                        github.pullRequests.getAll({
                            owner: owner,
                            repo: repo,
                            state: "closed",
                            head: sha
                        }, function(err, res) {
                            //console.error(JSON.stringify(JSON.parse(JSON.stringify(res)),null,'\t'));
                            for (var pr in res.data) {
                                if (res.data[pr].merged_at > date)
                                    list += "- #" + res.data[pr].number + " - " + res.data[pr].title + os.EOL;
                            }
                            console.log(list);
                        });
                    });
                });
            });
        });
    });
}
