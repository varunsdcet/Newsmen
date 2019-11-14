
import React, {Component} from 'react';
import {StyleSheet, Text, View,SafeAreaView, Button, TouchableOpacity, Image, Dimensions, Alert} from 'react-native';
import Backend from "./Backend.js";
import { GiftedChat } from "react-native-gifted-chat";
import MessageText from "react-native-gifted-chat/lib/MessageText";
import Bubble from "react-native-gifted-chat/lib/Bubble";
const window = Dimensions.get('window');
var randomString = require('random-string');
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
const GLOBAL = require('./Global');
type Props = {};
export default class Chat extends Component<Props> {
  state = {
    messages: [],
      texts:'',
      memberlist:[],
  };
  renderMessageText(props) {

    return (
        <View>

<Text></Text>



        </View>


    );
  }
//   _onPressButton = (qq,index) => {
//
// alert(qq)
//     if (typeof qq !== 'undefined') {
//       // Backend.updateMessage(qq);
//       //
//       // Backend.update(message => {
//       //   this.setState(previousState => {
//       //     return {
//       //       messages: GiftedChat.append(previousState.messages, message)
//       //     };
//       //   });
//       // });
//     }
//
//

 // }
    renderBubble = (props,index) => {


        var seen = props.currentMessage.seen
        var seenArray = seen.split('|')
        var finalSeenArray = [];
        for (var i = 0 ; i< seenArray.length; i++){
            if (seenArray[i] == GLOBAL.user_id){

            }else{
                if (seenArray[i] == ""){

                } else {
                    finalSeenArray.push(seenArray[i])
                }
            }
        }
        const uniqueset= new Set(finalSeenArray)
        const backToArray = [...uniqueset]
        var length = this.state.memberlist.length - 1
        var judge ;

        if (length == backToArray.length){
            judge = 0

        }else if (backToArray.length == 0){
            judge = 1
        }else{
            if (GLOBAL.guid == "0"){
                judge = 0
            }else {
                judge = 2
            }
        }


        return (
            <View>
                {props.currentMessage.news_id==''&& (
                    <TouchableOpacity onPress={()=>this.whoseen(props.currentMessage, index)}>
                        <View style={{paddingRight: 12}}>




                            <Bubble {...props} />
                            {props.currentMessage.user_id == GLOBAL.user_id &&(
                                <View>
                                    {judge == 1 && (
                                        <Image style={{width:15, height:15, resizeMode:'contain', alignSelf:'flex-end'}}
                                               source={require('./unseen.png')}/>
                                    )}

                                    {judge == 2 && (
                                        <Image style={{width:15, height:15, resizeMode:'contain', alignSelf:'flex-end'}}
                                               source={require('./greytick.png')}/>
                                    )}

                                    {judge == 0 && (
                                        <Image style={{width:15, height:15, resizeMode:'contain', alignSelf:'flex-end'}}
                                               source={require('./seen.png')}/>
                                    )}

                                </View>




                            )}


                        </View>
                    </TouchableOpacity>

                )}

                {props.currentMessage.news_id!='' && (

                    <TouchableOpacity onPress={()=>this._onPressButton(props.currentMessage,index)}>
                        <View style={{paddingRight: 12}}>




                            <Bubble {...props} />
                            {props.currentMessage.user_id == GLOBAL.user_id &&(
                                <View>
                                    {judge == 1 && (
                                        <Image style={{width:15, height:15, resizeMode:'contain', alignSelf:'flex-end'}}
                                               source={require('./unseen.png')}/>
                                    )}

                                    {judge == 2 && (
                                        <Image style={{width:15, height:15, resizeMode:'contain', alignSelf:'flex-end'}}
                                               source={require('./greytick.png')}/>
                                    )}

                                    {judge == 0 && (
                                        <Image style={{width:15, height:15, resizeMode:'contain', alignSelf:'flex-end'}}
                                               source={require('./seen.png')}/>
                                    )}

                                </View>




                            )}


                        </View>
                    </TouchableOpacity>

                )}
            </View>
        )
    }



  _YesLogout=()=>{

      const url = GLOBAL.BASE_URL +  'block_user'
//      this.showLoading()
      fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              block_by : GLOBAL.user_id,
              block_id : GLOBAL.another,
          }),
      }).then((response) => response.json())
          .then((responseJson) => {

//    alert(JSON.stringify(responseJson))
              //     this.hideLoading()
              if (responseJson.status == true) {

                  this.props.navigation.goBack()
                  // AsyncStorage.removeItem('userID');
                  //
                  // this.props
                  //     .navigation
                  //     .dispatch(StackActions.reset({
                  //         index: 0,
                  //         actions: [
                  //             NavigationActions.navigate({
                  //                 routeName: 'Login',
                  //                 params: { someParams: 'parameters goes here...' },
                  //             }),
                  //         ],
                  //     }))
                  //
                  //
                  // this.props.navigation.dispatch(DrawerActions.closeDrawer())

              }else {
                  alert('Something Went Wrong.')
              }
          })
          .catch((error) => {
              console.error(error);
          });
  }
  navigateToScreen1 = () => {

      Alert.alert('Block User!','Are you sure you want to Block?',
          [{text:"Cancel"},
              {text:"Yes", onPress:()=>this._YesLogout()
              },
          ],
          {cancelable:false}
      )

  }

  _onPressButton = (props,index) => {


      var x = index.hasOwnProperty("news_id")
      if (x == true && index.news_id!=''){
          GLOBAL.newsid = index.news_id
          this.props.navigation.navigate('NewsDetail')
      }
  }



  groupMember()
{
    const url = GLOBAL.BASE_URL +  'group_member_list'


    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
    group_id : GLOBAL.groupId,
    user_id :GLOBAL.user_id


}),
}).then((response) => response.json())
    .then((responseJson) => {


        if (responseJson.status == true){


        this.setState({memberlist:responseJson.member_list})
            var s ='';
            for (var i = 0;i <this.state.memberlist.length;i++){
                s = s + this.state.memberlist[i].user_id + '|'
            }
            Backend.updateTyping('',s)


        }else{

        }


    })
    .catch((error) => {
        console.error(error);
    });
}


    whoseen=(whosaw, index)=>{
        if(whosaw.user_id == GLOBAL.user_id){
            var seen = whosaw.seen
            var seenArray = seen.split('|')
            var finalSeenArray = [];
            for (var i = 0 ; i< seenArray.length; i++){
                if (seenArray[i] == GLOBAL.user_id){

                }else{
                    if (seenArray[i] == ""){

                    } else {
                        finalSeenArray.push(seenArray[i])
                    }
                }
            }

            const uniqueset= new Set(finalSeenArray)
            const backToArray = [...uniqueset]

            GLOBAL.whohasseen = backToArray.join('|')
            this.props.navigation.navigate('Seen')
        }else{

        }
//  alert(JSON.stringify(whosaw))
    }


  componentWillMount() {
      if (GLOBAL.guid != "0") {
          this.groupMember()
      }
  }
  render() {

    return (
        <View style = {{flex:1}}>

        <View style = {{width:window.width ,backgroundColor:'#efefef'}}>
            <View style = {{flexDirection:'row',width:window.width-20,marginTop:20,justifyContent:'space-between',backgroundColor:'#efefef',height:50}}>

                <View style = {{flexDirection:'row',marginTop:12}}>

                    <TouchableOpacity style = {{width :30 ,height : 30 }}
                                      onPress={() => this.props.navigation.goBack()}>

                        <Image style = {{width :20 ,height : 20 ,marginLeft: 10,resizeMode: 'contain',marginTop:4}}
                               source={require('./arrow.png')}/>

                    </TouchableOpacity>

                    <Text style = {{marginLeft:22,fontSize: 20,color:'#c53b41',fontWeight: 'bold', width:'75%',marginTop:1}}>
                        {GLOBAL.anotherUsername}
                    </Text>


                </View>

{GLOBAL.guid == "0" &&(
  <TouchableOpacity style = {{width :30 ,height : 30 }}
                    onPress={() => this.navigateToScreen1()}>

      <Image style = {{width :30 ,height : 30,marginRight:15,marginTop:12 }}
             source={require('./informations.png')}/>


  </TouchableOpacity>

)}

{GLOBAL.guid!="0" &&(
  <TouchableOpacity style = {{width :30 ,height : 30 }}
                    onPress={() => this.props.navigation.navigate('MemberList')}>

      <Image style = {{width :30 ,height : 30,marginRight:15,marginTop:12 }}
             source={require('./informations.png')}/>


  </TouchableOpacity>

)}



            </View>
            <Text style = {{fontSize: 12,color:'#c53b41',alignSelf:'center',marginTop:-10,height:20}}>
                {this.state.texts}
            </Text>

        </View>

    <GiftedChat
        messages={this.state.messages}
        extraData={this.state}
        onInputTextChanged = {text =>{
            Backend.updateTyping(text,"")

            // alert(text)

        }

        }

        onSend={message => {

          if(GLOBAL.guid == "0") {


            const url = GLOBAL.BASE_URL +  'last_chat_insert'


            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reciever_id : GLOBAL.another,
                    sender_id : GLOBAL.user_id,
                    message :message[0].text,
                    news_id : '0',
                    chat_group_id:GLOBAL.muid,


                }),
            }).then((response) => response.json())
                .then((responseJson) => {


                    if (this.state.status == true){
                        // this.getChats()
                    }else{

                    }


                })
                .catch((error) => {
                    console.error(error);
                });

}else{
  const url = GLOBAL.BASE_URL +  'submit_group_comment'


  fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          group_id : GLOBAL.groupId,
          user_id : GLOBAL.user_id,
          comment :message[0].text,
          post_id : '0'


      }),
  }).then((response) => response.json())
      .then((responseJson) => {

if (this.state.status == true){
  //this.setState({msg:''})
//  this.setState({live:true})
//        this.setState({comment:responseJson.comment_list})
}else{

}


      })
      .catch((error) => {
          console.error(error);
      });

}

          Backend.sendMessage(message);
        }}
        renderBubble={this.renderBubble}

        onPress ={this._onPressButton}
        user={{
          _id: GLOBAL.user_id,
          name: GLOBAL.myname,
        }}
      />


</View>

    );
  }


  componentDidMount() {





      Backend.loadMessages(message => {


          if (message.update == true) {


              for (var i = 0; i < this.state.messages.length; i++) {

                  if (this.state.messages[i]._id == message._id) {
                      this.state.messages[i] = message



                  }


              }
              this.setState({message:this.state.messages})



              return {
                  messages: GiftedChat.append(this.state.messages)


              };

          } else {

              this.setState(previousState => {


                  return {
                      messages: GiftedChat.append(previousState.messages, message)


                  };
              });
          }
    });





      Backend.loadMessagess(message => {
        //  alert(JSON.stringify(message))

          if (message.userid == GLOBAL.user_id){
              this.setState({texts:''})
          }else{
              if (message.typinganother == true){
                  var s = message.name +  ' is typing ...'
                  this.setState({texts:s})
              }else{
                  this.setState({texts:''})
              }

          }



           this.setState({texts:s})
          // }

      })

      if ( GLOBAL.newsWhich == "1") {
          this.timeoutHandle = setTimeout(() => {


              var x = randomString({
                  length: 20,
                  numeric: true,
                  letters: true,
                  special: false,
                  exclude: ['a', 'b']
              });

              var array = [];
              var users = {
                  _id: GLOBAL.user_id,
                  name: GLOBAL.myname,
              }
              var today = new Date();
              /* today.setDate(today.getDate() - 30);
              var timestamp = new Date(today).toISOString(); */
              var timestamp = today.toISOString();
              var dict = {
                  text: GLOBAL.newsTitle,
                  user: users,
                  createdAt: timestamp,
                  _id: x,
                  image: GLOBAL.newsImage,
                  news_id : GLOBAL.newsid,
                  // etc.
              };
              array.push(dict)
              //Backend.load()


              Backend.sendMessage(array)

          }, 3000);

      }






  }
  componentWillUnmount() {
    Backend.closeChat();
  }
}
