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
    ActivityIndicator,
    FlatList
} from 'react-native';
const GLOBAL = require('./Global');
const window = Dimensions.get('window');
import Button from 'react-native-button';
import { NavigationActions,StackActions,DrawerActions } from 'react-navigation';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
type Props = {};
export default class Profile extends Component {
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
        author : [],

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


    _handleCategorySelect=(item,index)=>{
//        alert(JSON.stringify(item))
        // GLOBAL.groupName = item.g_name
        // GLOBAL.groupId =  item.group_id
        GLOBAL.groupName = item.g_name
        GLOBAL.groupId =  item.group_id
        GLOBAL.muid = 'g'+item.group_id
        GLOBAL.newsWhich = "2";
        GLOBAL.anotherUsername = item.g_name
        GLOBAL.guid ="1";

        this.props.navigation.navigate('Chat')

//        alert(item.group_id)
        // GLOBAL.array =   [...GLOBAL.array,  item]
//        this.props.navigation.navigate('ChatGroup')
    }


    onClickEditGroup=(item, index)=>{
//      alert(JSON.stringify(item))
        GLOBAL.editGroup = item
        this.props.navigation.navigate('EditGroup')
    }


    _renderItemCateg = (item,index)=>{

        //  alert(item.item.is_member)
        return (

            <View>

                <TouchableOpacity
                    onPress={() => this._handleCategorySelect(item.item,index)}>
                    <View style = {{marginLeft :10 ,marginRight:10,marginTop:2, marginBottom:20,width:100,
                        backgroundColor:'transparent',padding:5}}>
                        <Image style = {{width :80 ,height : 80 ,padding:12,margin:5 ,borderRadius:40 }}
                               source={{uri: item.item.image}}/>
                        <Text style = {{fontSize: 16,marginBottom:2,fontWeight:'bold',alignSelf:'center', width:80, height:'auto', textAlign:'center', width:'100%'}}>
                            {item.item.g_name}
                        </Text>
                        {item.item.is_member=='0' && (
                            <TouchableOpacity style={{position: 'absolute', top:1, width: 20, height: 20, right: 2}}
                                              onPress={()=> this.onClickEditGroup(item.item, index)}>
                                <Image style={{width: 18, height: 18, resizeMode: 'contain'}} source={require('./pencil.png')}/>
                            </TouchableOpacity>
                        )}
                    </View>
                </TouchableOpacity>



            </View>

        )
    }

    componentWillMount() {
        this.props.navigation.addListener('willFocus',this._handleStateChange);
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);

        NetInfo.isConnected.fetch().done(
            (isConnected) => { this.setState({ status: isConnected });

            }
        );
    }
    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
    }


    _handleStateChange = state => {
        this.getNewsUpdate()
        this.getNewsUpdates()
        this.getNewsUpdatess()

    };

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
        this.getNewsUpdatess()
    }
    getNewsUpdates(){
        const url = GLOBAL.BASE_URL +  'group_list'


        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id : GLOBAL.user_id,


            }),
        }).then((response) => response.json())
            .then((responseJson) => {

                //    alert(JSON.stringify(responseJson))


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


    author = (item,index) => {



        if (item.type == "news"){
            GLOBAL.newsid = item.news_id
            this.props.navigation.navigate('NewsDetail')
        } else if( item.type == "normal") {
            GLOBAL.another = item.receiver_id
            this.props.navigation.navigate('SingleChat')
        }else{
            GLOBAL.groupId = item.group_id
            GLOBAL.groupName = item.group_name

            this.props.navigation.navigate('ChatGroup')
        }

    }

    _renderItemCategsssss = (item,index)=>{




        return (
            <TouchableOpacity
                onPress={() => this.author(item.item,index)}>

                {item.item.type == 'normal' && (
                    <View style = {{margin :10 ,backgroundColor:'transparent',width:window.width,
                        flexDirection:'row'}}>
                        <Image style = {{width :40 ,height : 40 ,padding:4,borderRadius:20,margin:10 }}
                               source={{uri :item.item.receiver_image}}/>

                        <View style = {{flexDirection:'column',width:'75%',marginLeft:10,marginTop:10,marginBottom:5}}>
                            <Text style = {{fontSize:18,fontWeight:'bold'}}>
                                {item.item.receiver_name}
                            </Text>

                            <Text style = {{color:'#cdcdcd'}}>
                                {item.item.message}
                            </Text>

                        </View>
                    </View>
                )}

                {item.item.type == 'group_post' && (
                    <View style = {{margin :10 ,backgroundColor:'transparent',width:window.width,
                        flexDirection:'row'}}>
                        <Image style = {{width :40 ,height : 40 ,padding:4,borderRadius:20,margin:10 }}
                               source={{uri :item.item.image}}/>

                        <View style = {{flexDirection:'column',width:'75%',marginLeft:10,marginTop:10,marginBottom:5}}>
                            <Text style = {{fontSize:18,fontWeight:'bold'}}>
                                {item.item.group_name}
                            </Text>

                            <Text style = {{color:'#cdcdcd'}}>
                                {item.item.comment}
                            </Text>

                        </View>

                    </View>
                )}

                {item.item.type == 'news' && (
                    <View style = {{margin :10 ,backgroundColor:'transparent',width:window.width,
                        flexDirection:'row'}}>

                        <Image style = {{width :40 ,height : 40 ,padding:4,borderRadius:20,margin:10 }}
                               source={{uri :item.item.image}}/>

                        <View style = {{flexDirection:'column',width:'75%',marginLeft:10,marginTop:10,marginBottom:5}}>
                            <Text style = {{fontSize:18,fontWeight:'bold'}}>
                                {item.item.news_title}
                            </Text>

                            <Text style = {{color:'#cdcdcd'}}>
                                {item.item.comment}
                            </Text>

                        </View>
                    </View>
                )}


                <View style={{height:1, backgroundColor:'grey', width:window.width-20,marginLeft:10,marginTop:-10}}>
                </View>


            </TouchableOpacity>


        )
    }
    getNewsUpdatess(){
        const url = GLOBAL.BASE_URL +  'recent_activity_history'


        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id : GLOBAL.user_id,
                types :'news'

            }),
        }).then((response) => response.json())
            .then((responseJson) => {




                if (responseJson.status == true) {
                    this.setState({author:responseJson.history})
                    //
                    // this.setState({tag:responseJson.tags_list})



                }else {
                    alert('No Data Found')
                }
            })
            .catch((error) => {
                console.error(error);
            });

    }
    getNewsUpdate(){
        const url = GLOBAL.BASE_URL +  'get_profile'


        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id : GLOBAL.user_id,

            }),
        }).then((response) => response.json())
            .then((responseJson) => {

//              alert(JSON.stringify(responseJson))
                if (responseJson.status == true) {
                    GLOBAL.wallets = responseJson.user_detail.wallet


                    this.setState({results:responseJson.user_detail})

                }else {
//                    alert('No News Found')
                }
            })
            .catch((error) => {
                console.error(error);
            });

    }


    buttonClickListener=()=>{
        this.props.navigation.replace('Login')
    }


    _YesLogout=()=>{

        const url = GLOBAL.BASE_URL +  'logout'
//      this.showLoading()
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id : GLOBAL.user_id,
            }),
        }).then((response) => response.json())
            .then((responseJson) => {

//    alert(JSON.stringify(responseJson))
                //     this.hideLoading()
                if (responseJson.status == true) {
                    GLOBAL.user_id='';
                    AsyncStorage.removeItem('userID');

                    this.props
                        .navigation
                        .dispatch(StackActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({
                                    routeName: 'Login',
                                    params: { someParams: 'parameters goes here...' },
                                }),
                            ],
                        }))


//                    this.props.navigation.dispatch(DrawerActions.closeDrawer())

                }else {
                    alert('Something Went Wrong.')
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }
    navigateToScreen1 = (route) => {

        Alert.alert('Logout!','Are you sure you want to Logout?',
            [{text:"Cancel"},
                {text:"Yes", onPress:()=>this._YesLogout()
                },
            ],
            {cancelable:false}
        )

    }


    render() {


        return (

            <View style={styles.container}>

                <Image style = {{width :window.width ,height : window.height}}
                       source={require('./background.png')}/>
                <View style={{marginTop:-window.height,width:window.width,flex:1}}>
                    {GLOBAL.user_id == '' &&(
                        <View style={{marginTop:window.width/2+50,}}>

                            <Image style = {{width :100 ,height :100 ,borderRadius:50,marginLeft: window.width/2 - 50,marginTop:20, marginBottom:20}}
                                   source={require('./user_guest.png')}/>

                            <Text style = {{fontSize: 22,fontWeight: 'bold',alignSelf:'center', width:'80%', textAlign:'center', width:250, height:'auto'}}>
                                Hello Guest User!{'\n'}
                                Login first to view profile
                            </Text>

                            <Button
                                style={{ fontSize: 18, color: 'white' }}
                                containerStyle={{width:220,padding: 10, height: 45,marginTop:30, overflow: 'hidden', borderRadius: 20, backgroundColor: '#c13e44', alignSelf:'center',}}

                                onPress={() => this.buttonClickListener()}
                            >
                                Log In
                            </Button>

                        </View>

                    )}
                    {GLOBAL.user_id != '' && (
                        <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>

                            <View style = {{flexDirection:'row',width:window.width,justifyContent:'space-between',marginTop:52}}>

                                <Text style = {{fontSize: 34,color:'black',fontWeight: 'bold',margin:10, width:130}}>
                                    Profile
                                </Text>

                                <View style={{flexDirection:'row', marginTop:5}}>
                                    <TouchableOpacity
                                        onPress={() => this.props.navigation.navigate('EditProfile')}>

                                        <Image style = {{width :25 ,height : 25,alignSelf:'flex-end',marginRight:10,marginTop:15}}
                                               source={require('./pencil.png')}/>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={()=>this.navigateToScreen1('Login')}>

                                        <Image style = {{width :25 ,height : 25,alignSelf:'flex-end',marginRight:10,marginTop:15, marginLeft:10}}
                                               source={require('./logout_profile.png')}/>
                                    </TouchableOpacity>
                                </View>

                            </View>


                            <Image style = {{width :100 ,height :100 ,borderRadius:50,marginLeft: window.width/2 - 50,marginTop:20}}
                                   source={{uri: this.state.results.image}}/>
                            <Text style = {{fontSize: 22,fontWeight: 'bold',margin:10,alignSelf:'center', width:'80%', textAlign:'center'}}>
                                {this.state.results.name}
                            </Text>

                            <Text style = {{fontSize: 22,fontWeight: 'bold',margin:5,alignSelf:'center', width:'80%', textAlign:'center'}}>
                                {this.state.results.username}
                            </Text>



                            <View style = {{flexDirection:'row',justifyContent:'space-between',marginTop:10,alignSelf:'center', width:'85%'}}>
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('Bookmark')}>
                                    <View style = {{flexDirection:'column'}}>
                                        <Image style = {{width :60 ,height :60, shadowColor: 'black',
                                            shadowOffset: { width: 0, height: 2 },alignSelf:'center',
                                            shadowOpacity: 0.2,
                                            shadowRadius: 2, }}
                                               source={require('./bookss.png')}/>
                                        <Text style= {{fontSize:16,color:'#cdcdcd',marginTop:8,alignSelf:'center',fontWeight:'bold', width:100, textAlign:'center'}}>
                                            Bookmarks
                                        </Text>



                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('History')}>
                                    <View style = {{flexDirection:'column'}}>
                                        <Image style = {{width :60 ,height :60, shadowColor: 'black',
                                            shadowOffset: { width: 0, height: 2 },alignSelf:'center',
                                            shadowOpacity: 0.2,
                                            shadowRadius: 2, }}
                                               source={require('./history.png')}/>
                                        <Text style= {{fontSize:16,color:'#cdcdcd',marginTop:8,alignSelf:'center',fontWeight:'bold',width:80, textAlign:'center'}}>
                                            History
                                        </Text>



                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('Wallet')}>
                                    <View style = {{flexDirection:'column'}}>
                                        <Image style = {{width :60 ,height :60, shadowColor: 'black',
                                            shadowOffset: { width: 0, height: 2 },alignSelf:'center',
                                            shadowOpacity: 0.2,
                                            shadowRadius: 2, }}
                                               source={require('./messages.png')}/>
                                        <Text style= {{fontSize:16,color:'#cdcdcd',marginTop:8,alignSelf:'center',fontWeight:'bold', width:80, textAlign:'center'}}>
                                            Wallet
                                        </Text>



                                    </View>
                                </TouchableOpacity>

                            </View>

                            <View style = {{width:window.width,backgroundColor: 'grey',height:1,marginTop:20}}>

                            </View>

                            <Text style = {{fontSize: 24,color:'black',fontWeight: 'bold',margin:10}}>
                                My Groups
                            </Text>

                            <FlatList style= {{flexGrow:0,marginTop:0}}
                                      data={this.state.news}

                                      horizontal
                                      showsHorizontalScrollIndicator={false}
                                      keyExtractor = { (item, index) => index.toString() }
                                      extraData={this.state}
                                      renderItem={this._renderItemCateg}
                            />


                            <Text style = {{fontSize: 20,color:'black',fontWeight: 'bold',margin:10}}>
                                Recent Activities
                            </Text>







                            <FlatList style= {{marginTop:2, marginBottom: 10,}}
                                      data={this.state.author}


                                      showsHorizontalScrollIndicator={false}
                                      keyExtractor = { (item, index) => index.toString() }
                                      extraData={this.state}
                                      renderItem={this._renderItemCategsssss}
                            />



                        </KeyboardAwareScrollView>

                    )}


                </View>

            </View>
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
        flex: 1,

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