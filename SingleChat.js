import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Platform,
    TextInput,
    View,
    Image,
    Alert,
    SectionList,
    AsyncStorage,
    Dimensions,
    RefreshControl,
    TouchableOpacity,
    NetInfo,
    ActivityIndicator,
    FlatList
} from 'react-native';

const window = Dimensions.get('window');
import { GiftedChat } from 'react-native-gifted-chat'
const GLOBAL = require('./Global');
import Svg, { Path } from "react-native-svg";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { FloatingAction } from "react-native-floating-action";
import Button from 'react-native-button';
import ImagePicker from 'react-native-image-picker';

const actions = [

    {
        text: "Create Topic",
        icon: require("./play.png"),
        name: "bt_language",
        position: 1
    },

];
const options = {
    title: 'Select Avatar',

    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {DrawerActions, NavigationActions, StackActions} from "react-navigation";
type Props = {};
export default class SingleChat extends Component {
    state = {
        text: '',
        passwordtext :'',
        isSecure : true,
        username: '',
        msg :'',
        password: '',
        refreshing:false,
        live :'',
        ipAdd : '',
        name:'',
        isFetching: false,
        status :false,
        description:'',
        height:0,
        comment :['sd'],
        messages: [
            {
                _id: 1,
                text: 'Hello developer',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'React Native',
                    avatar: 'https://placeimg.com/140/140/any',
                },
            },
        ],

        newsHeading :[],
        loading:'',
        states:'',
        results: [],
        avatarSource:'',

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
    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
    }



    getChats =()=>{
//        alert(GLOBAL.another)

        const url = GLOBAL.BASE_URL +  'chat_history'


        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                reciever_id : GLOBAL.another,
                sender_id : GLOBAL.user_id,



            }),
        }).then((response) => response.json())
            .then((responseJson) => {

//alert(JSON.stringify(responseJson))
                if (responseJson.status == true){
                    this.setState({live:true})
  //                  this.setState({msg:''})
                    this.setState({comment:responseJson.chat_history})
                //    this._onRefresh()
                 this.getChats()
                }else{

                    this.setState({live:false})
                }


            })
            .catch((error) => {
                console.error(error);
            });

    }



    getChat =()=>{


        if (this.state.msg == ''){
            alert('Please enter Message')
            return
        }
        const url = GLOBAL.BASE_URL +  'last_chat_insert'


        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                reciever_id : GLOBAL.another,
                sender_id : GLOBAL.user_id,
                message :this.state.msg,
                news_id : '0'


            }),
        }).then((response) => response.json())
            .then((responseJson) => {
              //  alert(JSON.stringify(responseJson))

                if (this.state.status == true){
                    this.setState({msg:''})
                    this.setState({live:true})
                    this.setState({comment:responseJson.chat_history})
                }else{

                }


            })
            .catch((error) => {
                console.error(error);
            });

    }



    getNewsUpdate(){
        const url = GLOBAL.BASE_URL +  'group_post_detail'


        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                group_id : GLOBAL.groupId,


            }),
        }).then((response) => response.json())
            .then((responseJson) => {

                if (responseJson.status == true){
                    GLOBAL.post_id = responseJson.detail.post_id
                    this.setState({newsHeading: responseJson.detail})

                    this.getChats()

                } else {

                }


            })
            .catch((error) => {
                console.error(error);
            });

    }

    showLoading() {
        this.setState({loading: true})
    }
    changeImage=()=>{
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };

                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    avatarSource: source,
                });
            }
        });

    }

    _renderItemCategs = (items,index)=>{
        var item = items.item


        return (

            <View>

                {item.is_user == 1 && item.type == "normal" && (
                    <View>
                        <View style={[styles.item, styles.itemOut]}>
                            <View style={[styles.balloon, {backgroundColor: '#efefef'}]}>
                                <Text style={{paddingTop: 5, color: 'black'}}>{item.message}</Text>
                                <Text style={{paddingTop: 5, color: 'black'}}>{item.added_on}</Text>
                                <View
                                    style={[
                                        styles.arrowContainer,
                                        styles.arrowRightContainer,
                                    ]}
                                >

                                </View>

                            </View>

                        </View>

                    </View>
                )}


                {item.is_user != 1 &&  item.type == "normal" &&(
                    <View>
                        <View style={[styles.item, styles.itemIn]}>
                            <View style={[styles.balloon, {backgroundColor: '#efefef'}]}>
                                <Text style={{paddingTop: 5, color: 'black'}}>{item.message}</Text>
                                <Text style={{paddingTop: 5, color: 'grey'}}>{item.sender_name}</Text>
                                <Text style={{paddingTop: 5, color: 'black'}}>{item.added_on}</Text>
                                <View
                                    style={[
                                        styles.arrowContainer,
                                        styles.arrowRightContainer,
                                    ]}
                                >

                                </View>

                            </View>

                        </View>

                    </View>
                )}


                { item.type == "news" &&(
                    <View>
                        <TouchableOpacity
                            onPress={() =>this.shares(item,index)}>
                            <View style={[styles.item, styles.itemIn]}>
                                <View style={[styles.balloon, {backgroundColor: '#efefef'}]}>


                                    <Image style = {{width :180 ,height : 100,borderRadius:20  }}
                                           source={{uri :item.image}}/>


                                    <Text style={{paddingTop: 5, color: 'black',width:180,textAlign:'center'}}>{item.news_title}</Text>



                                </View>

                            </View>
                        </TouchableOpacity>

                    </View>
                )}

            </View>

        )
    }

    _handleStateChange = state => {
        this.setState({newsHeading:GLOBAL.array})

    };
    buttonClickListener = () =>{
        var memberid = "";
        for (let i = 0; i< GLOBAL.array.length ;i++){
            memberid = memberid + GLOBAL.array[i]["user_id"] + '|'
        }


        if (this.state.name == ''){
            alert('Please Enter Name')
        } else if (this.state.description == ''){
            alert('Please Enter Description')
        }


        else {
            //   this.showLoading()
            const url = GLOBAL.BASE_URL +  'create_group'
            const data = new FormData();
            data.append('user_id', GLOBAL.user_id);
            data.append('title', this.state.name);
            data.append('description', this.state.description);
            data.append('flag',1);
            data.append('member_ids', memberid);
            // you can append anyone.
            data.append('image', {
                uri: this.state.avatarSource,
                type: 'image/jpeg', // or photo.type
                name: 'image.png'
            });
            fetch(url, {
                method: 'post',
                body: data,
                headers: {
                    'Content-Type': 'multipart/form-data',
                }

            }).then((response) => response.json())
                .then((responseJson) => {
                    //       this.hideLoading()

                    const { navigation } = this.props;
                    navigation.goBack();





                });
        }

    }
    delete = (index) => {

        let { newsHeading } = this.state;
        let targetPost = newsHeading[index];

        // Flip the 'liked' property of the targetPost


        var array = [...this.state.newsHeading]; // make a separate copy of the array

        if (index !== -1) {
            array.splice(index, 1);
            this.setState({newsHeading: array});
            GLOBAL.array = array
        }

    }

    _renderItemCateg = (item,index)=>{


        return (

            <View>
                <TouchableOpacity
                    onPress={() => this.delete(item.index)}>

                    <View style = {{marginLeft :10 ,marginRight:10,marginTop:2, marginBottom:20,width:100,
                        backgroundColor:'white',padding:5}}>
                        <Image style = {{width :80 ,height : 80 ,padding:12,margin:5 ,borderRadius:40 }}
                               source={require('./splash.png')}/>
                        <Text style = {{fontSize: 16,marginBottom:2,fontWeight:'bold',alignSelf:'center'}}>
                            {item.item}
                        </Text>

                    </View>
                </TouchableOpacity>



            </View>

        )
    }

    _handleStateChange = state => {
        // this.getNewsUpdate()
    }

    handleLoadMore = () => {


      //  alert('dd')


        setTimeout(
            ()=>{this.setState({
                comment: this.state.comment,
            })},
            2000);

        if (!this.state.loading) {
            this.page = this.page + 1; // increase page by 1
            // method for API call
        }
    };

    componentWillMount() {
        this.props.navigation.addListener('willFocus',this._handleStateChange);
        // this.getNewsUpdate()
        this.getChats()

        this.setState({newsHeading:GLOBAL.array})
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

    _onRefresh=()=> {

        this.setState({refreshing: false})


        const url = GLOBAL.BASE_URL +  'list_group_comment_list'


        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                group_id : GLOBAL.groupId,
                user_id : GLOBAL.user_id,
                limit_from :this.state.comment.length + 1


            }),
        }).then((response) => response.json())
            .then((responseJson) => {

                this._onRefresh()
                this.setState({refreshing: false})

                if (responseJson.status == true){

                    const interest = [...this.state.comment, ...responseJson.chat_list];




                    this.setState({comment:interest})
                }else{


                }


            })
            .catch((error) => {
                console.error(error);
            });



    }

    hideLoading() {
        this.setState({loading: false})
    }

    componentDidMount(){
        this.props.navigation.addListener('willFocus',this._handleStateChange);
        this.setState({newsHeading:GLOBAL.array})
    }

    single = (item) => {

        GLOBAL.comment_id = item.comment_id
        this.props.navigation.navigate('SingleGroupChat')
    }
    shares = (item,index) => {
        GLOBAL.newsid = item.news_id
        this.props.navigation.navigate('NewsDetail')
    }

    likes = (item,index) => {


        if (item.is_user_like == 0) {

            const url = GLOBAL.BASE_URL + 'like_group_comment'


            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: GLOBAL.user_id,
                    comment_id: item.comment_id,

                }),
            }).then((response) => response.json())
                .then((responseJson) => {

                    if (responseJson.status == true) {
                        let {comment} = this.state;
                        let targetPost = comment[index];
                        var a = parseInt(item.total_likes) + 1
                        var b = a.toString()

                        targetPost.is_user_like = 1;
                        targetPost.total_likes = b
                        comment[index] = targetPost;
                        this.setState({comment: comment})


                        //   this.setState({news:responseJson.news})

                    } else {
                        alert('No Data Found')
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }else {
            const url = GLOBAL.BASE_URL +  'dislike_group_comment'


            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id : GLOBAL.user_id,
                    comment_id: item.comment_id,

                }),
            }).then((response) => response.json())
                .then((responseJson) => {

                    if (responseJson.status == true) {
                        let { comment } = this.state;
                        let targetPost = comment[index];
                        var a = parseInt(item.total_likes) - 1
                        var b = a.toString()

                        targetPost.is_user_like = 0;
                        targetPost.total_likes = b
                        comment[index] = targetPost;
                        this.setState({ comment: comment})


                        //   this.setState({news:responseJson.news})

                    }else {
                        alert('No Data Found')
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }

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

    render() {


        return (
            <View style={styles.container}>


 <View style = {{width:window.width ,backgroundColor:'#efefef'}}>
                    <View style = {{flexDirection:'row',width:window.width-20,marginTop:20,justifyContent:'space-between',backgroundColor:'#efefef',height:50}}>

                        <View style = {{flexDirection:'row',marginTop:12}}>

                        <TouchableOpacity style = {{width :30 ,height : 30 }}
                                          onPress={() => this.props.navigation.goBack()}>

                            <Image style = {{width :20 ,height : 20 ,marginLeft: 10,resizeMode: 'contain'}}
                                   source={require('./arrow.png')}/>

                        </TouchableOpacity>

                        <Text style = {{marginLeft:40,fontSize: 20,color:'#c13e44',fontWeight: 'bold', width:'70%'}}>
                            {GLOBAL.anotherUsername }
                        </Text>
                        </View>

                        <TouchableOpacity style = {{width :30 ,height : 30 }}
                                          onPress={() => this.navigateToScreen1()}>

                                <Image style = {{width :30 ,height : 30,marginRight:15,marginTop:12 }}
                                       source={require('./information.png')}/>


                        </TouchableOpacity>

</View>
                    </View>

                    <KeyboardAwareScrollView contentContainerStyle={{flex:1}}
                                             keyboardShouldPersistTaps = 'always'
                                             scrollEnabled ={true}

                    >
                        <KeyboardAwareScrollView
                            contentContainerStyle = {{height:window.height - 70}}
                            keyboardShouldPersistTaps = 'always'
                        >

                            <FlatList style= {{marginTop:5, marginBottom: 42,backgroundColor:'transparent'}}
                                      data={this.state.comment}
                                      showsHorizontalScrollIndicator={false}
                                      keyExtractor = { (item, index) => index.toString() }
                                      extraData={this.state}
                                      renderItem={this._renderItemCategs}
                                      ref={ref => this.flatList = ref}
                                      onContentSizeChange={() => this.flatList.scrollToEnd({animated: false})}
                                      onLayout={() => this.flatList.scrollToEnd({animated: false})}

                            />


                        </KeyboardAwareScrollView>

                        <View style={[{marginLeft:10,height: 45,padding: 2,width:window.width -20,borderRadius:12,borderWidth:1,borderColor:'black',position:'absolute',bottom:0,backgroundColor :'#efefef',flexDirection:'row',justifyContent:'space-between',marginBottom:2}, {height: Math.max(45, this.state.height + 2 )}]}>


                            <TextInput
                                multiline={true}
                                autoCorrect = {false}
                                placeholder = {'Send Message...'}
                                value = {this.state.msg}
                                onContentSizeChange={(event) => {
                                    this.setState({height: event.nativeEvent.contentSize.height});
                                }}

                                onChangeText={(text) => this.setState({msg:text})}
                                style={[{height: 45,borderWidth: 0.0,borderColor: '#0f0f0f',fontSize: 16,padding: 2,width:window.width - 150}, {height: Math.max(45, this.state.height)}]}
                                defaultValue={this.state.value}
                            />


                            <Button
                                style={{ fontSize: 18, color: 'black',marginRight:2 }}
                                containerStyle={{ width:70,padding: 2, height: 45, overflow: 'hidden' ,marginLeft:2, marginRight:5, marginTop:5}}

                                onPress={() => this.getChat()}
                            >
                                SEND
                            </Button>
                        </View>
                    </KeyboardAwareScrollView>









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
    },
    bottomView: {
        width: '100%',
        height: 50,
        backgroundColor: '#EE5407',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
    },

    textStyle: {
        color: '#fff',
        fontSize: 18,
    },
    item: {
        marginVertical: moderateScale(7, 2),
        flexDirection: 'row'
    },
    itemIn: {
        marginLeft: 20
    },
    itemOut: {
        alignSelf: 'flex-end',
        marginRight: 20
    },
    balloon: {
        maxWidth: moderateScale(250, 2),
        paddingHorizontal: moderateScale(10, 2),
        paddingTop: moderateScale(5, 2),
        paddingBottom: moderateScale(7, 2),
        borderRadius: 20,
    },
    arrowContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        flex: 1
    },
    arrowLeftContainer: {
        justifyContent: 'flex-end',
        alignItems: 'flex-start'
    },

    arrowRightContainer: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },

    arrowLeft: {
        left: moderateScale(-6, 0.5),
    },

    arrowRight: {
        right:moderateScale(-6, 0.5),
    }
})
