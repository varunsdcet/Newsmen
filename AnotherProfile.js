import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Platform,
    TextInput,
    View,
    Image,
    Alert,
    AsyncStorage,
    Dimensions,
    TouchableOpacity,
    NetInfo,
    SafeAreaView,
    ActivityIndicator,
    FlatList
} from 'react-native';
const GLOBAL = require('./Global');
const window = Dimensions.get('window');
import Button from 'react-native-button';
import {
  SCLAlert,
  SCLAlertButton
} from 'react-native-scl-alert'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
type Props = {};
export default class AnotherProfile extends Component {
    state = {
        text: '',
        passwordtext :'',
        isSecure : true,
        username: '',
        password: '',
        status :'',
        ipAdd : '',
        newsHeading :['Video','HighFlyer','Movie',"Politics","Election"],
        loading:'',
        states:'',
        results: [],
        is_follow :'',

    };

    static navigationOptions = ({ navigation }) => {
        return {
            header: () => null,
            animations: {
                setRoot: {
                    waitForRender: false
                }
            }
        }
    }


    showLoading() {
        this.setState({loading: true})
    }


    _renderItemCategs = (item,index)=>{


        return (

            <View>


                <View style = {{marginLeft :10 ,marginRight:10,marginTop:2, marginBottom:20,width:window.width- 30,
                    backgroundColor:'white',padding:5}}>
                    <Image style = {{width :window.width- 30 ,height : 200  }}
                           source={require('./splash.png')}/>


                </View>



            </View>

        )
    }

    handleOpen = () => {
    this.setState({ show: true })
  }

  handleClose = () => {
    this.setState({ show: false })
  }

  handleCloseDone=()=>{
    this.setState({show :false})
    this.props.navigation.navigate('Login')
  }

    _handleCategorySelect=(item,index)=>{

        GLOBAL.groupName = item.g_name
        GLOBAL.groupId =  item.group_id

//        alert(item.group_id)
        // GLOBAL.array =   [...GLOBAL.array,  item]
        this.props.navigation.navigate('ChatGroup')
    }
    _renderItemCateg = (item,index)=>{


        return (

            <View>


                    <View style = {{marginLeft :10 ,marginRight:10,marginTop:2, marginBottom:20,width:100,
                        backgroundColor:'white',padding:5}}>
                        <Image style = {{width :80 ,height : 80 ,padding:12,margin:5 ,borderRadius:40 }}
                               source={{uri: item.item.image}}/>
                        <Text style = {{fontSize: 16,marginBottom:2,fontWeight:'bold',alignSelf:'center', textAlign:'center', width:80}}>
                            {item.item.g_name}
                        </Text>

                    </View>




            </View>

        )
    }

    componentWillMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);

        NetInfo.isConnected.fetch().done(
            (isConnected) => { this.setState({ status: isConnected });

            }
        );
    }
    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
    }

    handleConnectionChange = (isConnected) => {

        this.setState({ status: isConnected });
        if (this.state.status == false){
            alert('You are not connected to Internet')
        }
        console.log(`is connected: ${this.state.status}`);
    }



    hideLoading() {
        this.setState({loading: false})
    }

    componentDidMount(){
        this.getNewsUpdate()
        this.getNewsUpdates()
    }
    getNewsUpdates(){
        const url = GLOBAL.BASE_URL +  'group_list'


        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id : GLOBAL.another,


            }),
        }).then((response) => response.json())
            .then((responseJson) => {




                this.setState({news:responseJson.m_list})
                //
                // for (let order of responseJson.user_list) {
                //     if (food.id === order.user_id) {
                //         responseJson.user_list.splice(this.orders.indexOf(order), 1);
                //         break;
                //     }
                // }


            })
            .catch((error) => {
                console.error(error);
            });

    }


    unfollow(){
        const url = GLOBAL.BASE_URL +  'sd_user_follow_unfollow'


        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id : GLOBAL.user_id,
                follower_id :GLOBAL.another,
                is_what :"2",

            }),
        }).then((response) => response.json())
            .then((responseJson) => {



                if (responseJson.status == true) {

//is_follow
                    this.setState({is_follow:0})


                }else {
                    alert('No Data Found')
                }
            })
            .catch((error) => {
                console.error(error);
            });

    }


    follow(){



      if(GLOBAL.user_id ==''){
        this.setState({show: true})
//        alert('Please login first to continue..')
      }else{
        const url = GLOBAL.BASE_URL +  'sd_user_follow_unfollow'


        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id : GLOBAL.user_id,
                follower_id :GLOBAL.another,
                is_what :"1",

            }),
        }).then((response) => response.json())
            .then((responseJson) => {



                if (responseJson.status == true) {

//is_follow
                    this.setState({is_follow:1})


                }else {
                    alert('No Data Found')
                }
            })
            .catch((error) => {
                console.error(error);
            });

      }

    }

anotherChat=()=>{
  const url = GLOBAL.BASE_URL +  'create_chat_group'


  fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          user_id : GLOBAL.user_id,
          other_id :GLOBAL.another

      }),
  }).then((response) => response.json())
      .then((responseJson) => {



          if (responseJson.status == true) {
//                    alert(JSON.stringify(responseJson))
              GLOBAL.muid= responseJson.chat_group_id
                    this.props.navigation.navigate('Chat')
//is_follow
//              this.setState({is_follow:responseJson.user_detail.is_follow})

  //            this.setState({results:responseJson.user_detail})

          }else {
              alert('No News Found')
          }
      })
      .catch((error) => {
          console.error(error);
      });

}

    getNewsUpdate(){
        const url = GLOBAL.BASE_URL +  'get_profile_other'


        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id : GLOBAL.user_id,
                other_user_id :GLOBAL.another,

            }),
        }).then((response) => response.json())
            .then((responseJson) => {



                if (responseJson.status == true) {
//                    alert(JSON.stringify(responseJson))

//is_follow
                    this.setState({is_follow:responseJson.user_detail.is_follow})

                    this.setState({results:responseJson.user_detail})

                }else {
                    alert('No News Found')
                }
            })
            .catch((error) => {
                console.error(error);
            });

    }
    render() {


        return (
            <SafeAreaView>
            <View style={styles.container}>

                <Image style = {{width :window.width ,height : window.height}}
                       source={require('./background.png')}/>
                <View style={{marginTop:-window.height,width:window.width,height:window.height}}>
                    <KeyboardAwareScrollView>

                        <View style = {{flexDirection:'row',width:window.width,justifyContent:'space-between',marginTop:30}}>

                            <Text style = {{fontSize: 34,color:'black',fontWeight: 'bold',margin:10, width:120}}>
                                Profile
                            </Text>



                        </View>


                        <Image style = {{width :100 ,height :100 ,borderRadius:50,marginLeft: window.width/2 - 50,marginTop:20}}
                               source={{uri: this.state.results.image}}/>
                        <Text style = {{fontSize: 22,fontWeight: 'bold',margin:10,alignSelf:'center', width:'80%', textAlign:'center'}}>
                            {this.state.results.name}
                        </Text>

                        {this.state.is_follow == 0 && (

                            <TouchableOpacity
                                onPress={() => this.follow()}>
                        <View style = {{borderRadius :2,borderColor:'grey',borderWidth:1 ,height :30,width :150,alignSelf:'center'}}>
                            <Text style = {{fontSize: 14,fontWeight: 'bold',alignSelf:'center',padding:5, width:100, textAlign:'center'}}>
                                Follow

                            </Text>

                        </View>
                            </TouchableOpacity>
                        )}



                        {this.state.is_follow == 1 && (
                            <TouchableOpacity
                                onPress={() => this.unfollow()}>
                        <View style = {{borderRadius :2,borderColor:'white',borderWidth:1 ,height :30,width :150,alignSelf:'center',backgroundColor:'#ff0012'}}>
                            <Text style = {{fontSize: 14,fontWeight: 'bold',alignSelf:'center',padding:5,color:'white', textAlign:'center', width:120}}>
                                Unfollow

                            </Text>


                        </View>
                            </TouchableOpacity>
                        )}
                        {this.state.is_follow != 0 && (
                        <View style = {{flexDirection:'row',justifyContent:'space-between',marginTop:15,marginLeft:100,marginRight:100}}>



                            <TouchableOpacity
                                onPress={() => this.anotherChat()}>
                                <View style = {{flexDirection:'column',elevation:5,}}>
                                    <Image style = {{width :60 ,height :60, shadowColor: 'black',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.2,alignSelf:'center',
                                        shadowRadius: 2,resizeMode:'contain' }}
                                           source={require('./cha.png')}/>
                                    <Text style= {{fontSize:16,color:'#cdcdcd',marginTop:8,alignSelf:'center',fontWeight:'bold', width:70, textAlign:'center'}}>
                                        Chat
                                    </Text>



                                </View>
                            </TouchableOpacity>


                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('AnotherHistory')}>
                                <View style = {{flexDirection:'column',elevation:5,}}>
                                    <Image style = {{width :60 ,height :60, shadowColor: 'black',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.2,alignSelf:'center',
                                        shadowRadius: 2,resizeMode:'contain' }}
                                           source={require('./history.png')}/>
                                    <Text style= {{fontSize:16,color:'#cdcdcd',marginTop:8,alignSelf:'center',fontWeight:'bold', width:100, textAlign:'center'}}>
                                        History
                                    </Text>



                                </View>
                            </TouchableOpacity>



                        </View>
                        )}

                        <View style = {{width:window.width,backgroundColor: 'grey',height:1,marginTop:20}}>

                        </View>




                    </KeyboardAwareScrollView>

                </View>
                <SCLAlert
          show={this.state.show}
          onRequestClose={this.handleClose}
          theme="danger"
          title="Hello Guest User!"
          subtitle="Please Login First to Continue.."

        >
          <SCLAlertButton theme="danger" onPress={this.handleCloseDone}>Okay</SCLAlertButton>
          <SCLAlertButton theme="default" onPress={this.handleClose}>Cancel</SCLAlertButton>
        </SCLAlert>


            </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
    },
    loading: {
        position: 'absolute',
        left: window.width/2 - 30,

        top: window.height/2,

        opacity: 0.5,

        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {


    },
    slide1: {

        marginLeft : 50,

        width: window.width - 50,
        height:300,
        resizeMode:'contain',
        marginTop : window.height/2 - 200


    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9',
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    }
})
