
import React, {Component} from 'react';
import {StyleSheet, Text,SafeAreaView, View, Button, TouchableOpacity, Image, Dimensions} from 'react-native';
import Backend from "./Backend.js";
import { GiftedChat } from "react-native-gifted-chat";
import MessageText from "react-native-gifted-chat/lib/MessageText";
import Bubble from "react-native-gifted-chat/lib/Bubble";
const window = Dimensions.get('window');
var randomString = require('random-string');
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
const GLOBAL = require('./Global');
type Props = {};
export default class Chats extends Component<Props> {
  state = {
    messages: []
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

    return (
        <TouchableOpacity onPress={()=>this._onPressButton(props.currentMessage,index)}>
        <View style={{paddingRight: 12}}>




          <Bubble {...props} />



        </View>
        </TouchableOpacity>
    )
  }

  _onPressButton = (props,index) => {


      var x = index.hasOwnProperty("news_id")
      if (x == true){
          GLOBAL.newsid = index.news_id
          this.props.navigation.navigate('NewsDetail')
      }
  }
  componentWillMount() {}
  render() {

    return (
        <SafeAreaView>
        <View>

        <View style = {{width:window.width ,backgroundColor:'#efefef'}}>
            <View style = {{flexDirection:'row',width:window.width-20,marginTop:20,justifyContent:'space-between',backgroundColor:'#efefef',height:50}}>

                <View style = {{flexDirection:'row',marginTop:16}}>

                    <TouchableOpacity style = {{width :30 ,height : 30 }}
                                      onPress={() => this.props.navigation.goBack()}>

                        <Image style = {{width :20 ,height : 20 ,marginLeft: 10,resizeMode: 'contain',marginTop:4}}
                               source={require('./arrow.png')}/>

                    </TouchableOpacity>

                    <Text style = {{marginLeft:12,fontSize: 20,color:'#c13e44',fontWeight: 'bold',marginTop:1}}>
                        {GLOBAL.anotherUsername }
                    </Text>
                </View>

                <TouchableOpacity style = {{width :30 ,height : 30 }}
                                  onPress={() => this.navigateToScreen1()}>

                    <Image style = {{width :30 ,height : 30,marginRight:15,marginTop:12 }}
                           source={require('./informations.png')}/>


                </TouchableOpacity>





            </View>
        </View>

    <GiftedChat
        messages={this.state.messages}


        onSend={message => {


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
                    news_id : '0'


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



          Backend.sendMessage(message);
        }}
        renderBubble={this.renderBubble}

        onPress ={this._onPressButton}
        user={{
          _id: GLOBAL.user_id,
          name: 'ccw',
        }}
      />


</View>
        </SafeAreaView>

    );
  }


  componentDidMount() {




      Backend.loadMessages(message => {
      this.setState(previousState => {




        return {
          messages: GiftedChat.append(previousState.messages,message)


        };
      });
    });


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
                  name: 'ccw',
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
