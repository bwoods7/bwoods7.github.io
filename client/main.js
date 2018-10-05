import React from 'react';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import ReactDom from 'react-dom';
import './main.html';
import { HTTP } from 'meteor/http';



Router.route('/', function () {
  this.render('Home');
});

Router.route('/callback/', function () {
  this.render("app");
});


let starts = [];
let stops = [];
let intervals = [];
let clicks = 0;
let totalTime = 0;
let averageTime = 0;
let bpmCalc = 10;

Template.app.onCreated(function hi(){

  //initialize bpm number
  this.number = new ReactiveVar(0);
  this.userInfo = new ReactiveVar("nothing yet");

  //do post request to get Access token
  let refString = window.location.hash;
  let refStart = refString.indexOf("=") + 1;
  let refEnd = refString.indexOf("&");
  let aToken = refString.substring(refStart,refEnd);

  console.log(refStart, refEnd, aToken);
//  console.log(window.location.hash);
  let mR = new XMLHttpRequest();
  mR.open('GET', "https://api.spotify.com/v1/me", true);
  mR.setRequestHeader('authorization', "Bearer " + aToken);

  mR.send();

  mR.addEventListener("readystatechange", processUser, false);
    function processUser(e) {
      if(mR.readyState == 4 && mR.status == 200){
        mRtxt = JSON.parse(mR.responseText);
        userInfo = "Hello " + mRtxt.display_name;
        console.log(userInfo);
      }
    }

  // $.ajax({
  //   type: "GET",
  //   url: "https://api.spotify.com/v1/me",
  //   headers: {
  //     'authorization': "Bearer " + aToken
  //   },
  //   success: function(data) {
  //     console.log(data);
  //     //do something when request is successfull
  //   },
  //   dataType: "json"
  // });

});

Template.app.helpers({
    number(){
        return Template.instance().number.get();
    },
    userInfo(){
        return Template.instance().userInfo.get();
    }
    // ,

    // 'loginCred': function(){
    //     return "55";
    // }
});

Template.app.events({
    'mousedown #bpmButton' (event, instance){
      if (starts === undefined || starts.length == 0){
          starts.push(new Date());
          clicks++;
      } else {
          starts.push(new Date());
          stops.push(new Date());
          intervals.push(stops[clicks - 1] - starts[clicks - 1] );
          totalTime += stops[clicks - 1] - starts[clicks - 1] ;
          averageTime = totalTime / intervals.length ;
          bpmCalc =  Math.round(60000 / averageTime);
          instance.number.set(bpmCalc);
          instance.userInfo.set("Hello " + mRtxt.display_name);
          clicks++;
      }
        console.log(
          intervals, averageTime, bpmCalc,
        );
    }
});



Meteor.startup(function(){
//ReactDom.render(<App />, document.getElementById('app'));﻿
});

//
// var app = express();
// app.get('/callback', function(req, res) {
//
//   // your application requests refresh and access tokens
//   // after checking the state parameter
//
//   var code = req.query.code || null;
//   var state = req.query.state || null;
//   var storedState = req.cookies ? req.cookies[stateKey] : null;
//
//   if (state === null || state !== storedState) {
//     res.redirect('/#' +
//       querystring.stringify({
//         error: 'state_mismatch'
//       }));
//   } else {
//     res.clearCookie(stateKey);
//     var authOptions = {
//       url: 'https://accounts.spotify.com/api/token',
//       form: {
//         code: code,
//         redirect_uri: redirect_uri,
//         grant_type: 'authorization_code'
//       },
//       headers: {
//         'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
//       },
//       json: true
//     };
//
//     request.post(authOptions, function(error, response, body) {
//       if (!error && response.statusCode === 200) {
//
//         var access_token = body.access_token,
//             refresh_token = body.refresh_token;
//
//         var options = {
//           url: 'https://api.spotify.com/v1/me',
//           headers: { 'Authorization': 'Bearer ' + access_token },
//           json: true
//         };
//
//         // use the access token to access the Spotify Web API
//         request.get(options, function(error, response, body) {
//           console.log(body);
//         });
//
//         // we can also pass the token to the browser to make requests from there
//         res.redirect('/#' +
//           querystring.stringify({
//             access_token: access_token,
//             refresh_token: refresh_token
//           }));
//       } else {
//         res.redirect('/#' +
//           querystring.stringify({
//             error: 'invalid_token'
//           }));
//       }
//     });
//   }
// });
