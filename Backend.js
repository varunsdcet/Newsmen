
import firebase from "firebase";
const GLOBAL = require('./Global');
class Backend {
  uid = "12";
  messagesRef = null;
  messagesRefs = null;
  messagesRefss = null;
  // initialize Firebase Backend
  constructor() {
    firebase.initializeApp({
      apiKey: "AIzaSyAI2qHnZVfktTB7eN0g2CouEt5WLQ0pUAU",
      authDomain: "newsmen.firebaseapp.com",
      databaseURL: "https://newsmen.firebaseio.com",
      projectId: "newsmen",
      storageBucket: "",
    });

  }
  setUid(value) {
    this.uid = value;
  }
  getUid() {
    return this.uid;
  }




  updateGroup(callbacks) {
    // alert(JSON.stringify(callbacks))

    this.messagesRefss =  firebase.database().ref().child("chat/" + GLOBAL.muid + 'group');
    if (this.messagesRefss.length == 0) {
      this.messagesRefss.push({
        member: '',

      });


    }



    const onReceivess = data => {
      // alert(JSON.stringify(data))
      this.messagesRefss.once("value").then(function(snapshot) {
        const message = snapshot.val();




        i
          callbacks({
            name: message.name,
            typinganother: message.typinganother,

          })



      })


    };

    this.messagesRefss
        .orderByChild("createdAt")
        //.startAt(d)
        //.endAt("2017-11-27T06:51:47.851Z")
        .on("child_changed", onReceivess);

  }










  loadMessagess(callbacks) {
    // alert(JSON.stringify(callbacks))

    this.messagesRefs =  firebase.database().ref().child("chat/" + GLOBAL.muid + 'type');
    if (this.messagesRefs.length == 0) {
      this.messagesRefs.push({
        typinguser: false,
        typinganother: false,
        name :'harshit',
        groupMember:'',

      });


    }



    const onReceives = data => {
      // alert(JSON.stringify(data))
      this.messagesRefs.once("value").then(function(snapshot) {
        const message = snapshot.val();




        if (message.userid == GLOBAL.user_id){
          callbacks({
            name: message.name,
            typinganother: message.typinganother,
            userid:message.userid

          })
        }else{
          callbacks({
            name: message.name,
            typinganother: message.typinguser,

          })
        }


      })


    };

    this.messagesRefs
        .orderByChild("createdAt")
        //.startAt(d)
        //.endAt("2017-11-27T06:51:47.851Z")
        .on("child_changed", onReceives);

  }


  load(callback) {

    this.messagesRef =  firebase.database().ref().child("chat/" + GLOBAL.muid);


    this.messagesRef.off(); //Detaches a callback previously attached with on()
    const onReceive = data => {
      const message = data.val();
      callback({
        _id: data.key,
        text: message.text,
        //createdAt: new Date(message.createdAt),
        createdAt: message.createdAt,
        image :message.image,
        news_id :message.newsid,
        user: {
          _id: message.user._id,
          name: message.user.name
        }
      });
    };

    var d = this.getLimit();
    console.log(d);
    //Generates a new Query object limited to the last specific number of children.
    //this.messagesRef.limitToLast(10).on("child_added", onReceive);

  }





  loadMessages(callback) {


    this.messagesRef =  firebase.database().ref().child("chat/" + GLOBAL.muid);


    this.messagesRef.off(); //Detaches a callback previously attached with on()

// if (GLOBAL.guid == "") {
//
//   var query = this.messagesRef.orderByChild('user_id').equalTo(GLOBAL.user_id)
//   query.on('value', function (snapshot) {
//     snapshot.forEach(function (weekSnapshot) {
//       console.log(weekSnapshot.val());
//       alert(JSON.stringify(weekSnapshot))
//       weekSnapshot.ref.update({status: true});
//     });
//   });
// }else{
    var query = this.messagesRef.orderByChild('group').equalTo(GLOBAL.guid)
    query.on('value', function (snapshot) {
      snapshot.forEach(function (weekSnapshot) {

        var s = weekSnapshot.val().seen
        var d = '|' + GLOBAL.user_id + '|'
        if (s.includes(d) == true){

        }else{
          var e = s + GLOBAL.user_id + '|'
          weekSnapshot.ref.update({seen: e});
        }


      });
    });
//}

    const onReceives = data => {
    //  this.getData()

      const message = data.val();





      // alert(JSON.stringify(message))

      callback({
        _id: data.key,
        text: message.text,
        news_id :message.news_id,
        user_id:message.user_id,
        seen:message.seen,
        status:message.status,
        update:true,

        //createdAt: new Date(message.createdAt),
        createdAt: message.createdAt,
        image :message.image,
        user: {
          _id: message.user._id,
          name: message.user.name
        }
      });
    };

    const onReceive = data => {
      const message = data.val();
      callback({
        _id: data.key,
        text: message.text,
        news_id :message.news_id,
        user_id:message.user_id,
        seen:message.seen,
        status:message.status,
        update:false,

        //createdAt: new Date(message.createdAt),
        createdAt: message.createdAt,
        image :message.image,
        user: {
          _id: message.user._id,
          name: message.user.name
        }

      });
    };

    var d = this.getLimit();
    console.log(d);
    //Generates a new Query object limited to the last specific number of children.
    //this.messagesRef.limitToLast(10).on("child_added", onReceive);
    this.messagesRef
        .orderByChild("createdAt")
        //.startAt(d)
        //.endAt("2017-11-27T06:51:47.851Z")
        .on("child_added", onReceive);
    this.messagesRef
  .orderByChild("createdAt")
    //.startAt(d)
    //.endAt("2017-11-27T06:51:47.851Z")
        .on("child_changed", onReceives);
  }



  // retrieve the messages from the Backend
  loadMessages1(callback) {


    this.messagesRef =  firebase.database().ref().child("chat/" + GLOBAL.muid);


    this.messagesRef.off(); //Detaches a callback previously attached with on()

// if (GLOBAL.guid == "") {
//
//   var query = this.messagesRef.orderByChild('user_id').equalTo(GLOBAL.user_id)
//   query.on('value', function (snapshot) {
//     snapshot.forEach(function (weekSnapshot) {
//       console.log(weekSnapshot.val());
//       alert(JSON.stringify(weekSnapshot))
//       weekSnapshot.ref.update({status: true});
//     });
//   });
// }else{
  var query = this.messagesRef.orderByChild('group').equalTo(GLOBAL.guid)
  query.on('value', function (snapshot) {
    snapshot.forEach(function (weekSnapshot) {

      var s = weekSnapshot.val().seen
      var d = '|' + GLOBAL.user_id + '|'
      if (s.includes(d) == true){

      }else{
        var e = s + GLOBAL.user_id + '|'
        weekSnapshot.ref.update({seen: e});
      }


    });
  });
//}

    const onReceives = data => {
      this.getData()

      const message = data.val();





      // alert(JSON.stringify(message))

      // callback({
      //   _id: data.key,
      //   text: message.text,
      //   // //createdAt: new Date(message.createdAt),
      //   // createdAt: message.createdAt,
      //   seen:message.seen,
      //   // user_id:message.user_id,
      //   // anotherid:message.anotherid,
      //   //
      //   // user: {
      //   //     _id: message.user._id,
      //   //     name: message.user.name
      //   // }
      // });
    };

    const onReceive = data => {
      const message = data.val();
      callback({
        _id: data.key,
        text: message.text,
        news_id :message.news_id,
        user_id:message.user_id,
        seen:message.seen,
        status:message.status,

        //createdAt: new Date(message.createdAt),
        createdAt: message.createdAt,
        image :message.image,
        user: {
          _id: message.user._id,
          name: message.user.name
        }

      });
    };

    var d = this.getLimit();
    console.log(d);
    //Generates a new Query object limited to the last specific number of children.
    //this.messagesRef.limitToLast(10).on("child_added", onReceive);
    this.messagesRef
        .orderByChild("createdAt")
        //.startAt(d)
        //.endAt("2017-11-27T06:51:47.851Z")
        .on("child_added", onReceive);
    this.messagesRef
        .orderByChild("createdAt")
        //.startAt(d)
        //.endAt("2017-11-27T06:51:47.851Z")
        .on("child_changed", onReceives);
  }


  getData (){
  var recentPostsRef = firebase.database().ref().child("chat/" + GLOBAL.muid);
  recentPostsRef.once('value').then(snapshot => {




      const message = snapshot.val();
     // alert(JSON.stringify(snapshot.text))
      callback({
        _id: snapshot.key,
        text: message.text,
        news_id :message.news_id,
        user_id:message.user_id,
        seen:message.seen,
        status:message.status,

        //createdAt: new Date(message.createdAt),
        createdAt: message.createdAt,
        image :message.image,
        user: {
          _id: message.user._id,
          name: message.user.name
        }

      });


   // alert(JSON.stringify(snapshot.val()))
  // snapshot.val() is the dictionary with all your keys/values from the '/store' path
//  this.setState({ stores: snapshot.val() })
})
}

  // send the message to the Backend
  sendMessage(message) {


    //console.log(new Date(firebase.database.ServerValue.TIMESTAMP));
    var today = new Date();
    /* today.setDate(today.getDate() - 30);
    var timestamp = new Date(today).toISOString(); */
    var timestamp = today.toISOString();
    for (let i = 0; i < message.length; i++) {

      var z = "";
      var m = "";

      var k = message[i].hasOwnProperty('image')
      if (k == true){
        z = message[i].image;
        m = message[i].news_id;

      } else {
        z = "";
        m = "";
      }
     var another = ""
      var group  = ""
    if(GLOBAL.guid == ""){
      group = ""
      another = ""

    }else{
      another = GLOBAL.another
      group = GLOBAL.guid
    }
      if (GLOBAL.another){

      }else{
        another = "qwerty"
      }
        this.messagesRef.push({
         news_id :m,
         image: z,
          user_id:GLOBAL.user_id,
         text: message[i].text,
         user: message[i].user,
         createdAt: timestamp,
         status: false,
         seen:'',
         another:another,
         group:group
       });
     }
    this.messagesRefs.update({ typinguser: false, typinganother: false ,name :GLOBAL.myname,userid:GLOBAL.user_id});

  }
  // close the connection to the Backend
  closeChat() {
    if (this.messagesRef) {
      this.messagesRef.off();
    }
  }

  updateTyping(text,texts){
    this.messagesRefs =  firebase.database().ref().child("chat/" + GLOBAL.muid + 'type');
    if (text.length == 0 && texts == ""){
      this.messagesRefs.update({ typinguser: false, typinganother: false,name :GLOBAL.myname,userid:GLOBAL.user_id,member:'' });
      //  this.messagesRefs[0].typinguser = false

    }else if (text.length == 0 && texts != ""){
      this.messagesRefs.update({ typinguser: false, typinganother: false,name :GLOBAL.myname,userid:GLOBAL.user_id,member:texts });
      //  this.messagesRefs[0].typinguser = false

    }

    else{
      this.messagesRefs.update({ typinguser: true, typinganother: false,name :GLOBAL.myname ,userid:GLOBAL.user_id,member:''});
      //  this.messagesRefs[0].typinguser = true
    }
  }

  getLimit() {
    var today = new Date();
    //var milliseconds = Date.parse(today);
    //var changed = milliseconds - 86400000; //10 minutes (- 900000) -  86400000 1 day
    today.setDate(today.getDate() - 31); // last 30 Days
    //console.log(today);
    var changedISODate = new Date(today).toISOString();
    //var changedISODate = today.toISOString();
    console.log(changedISODate);
    return changedISODate;
  }
}

export default new Backend();
