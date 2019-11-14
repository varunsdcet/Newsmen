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
    TouchableOpacity,
    SafeAreaView,
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
type Props = {};
export default class MyChatGroup extends Component {
    state = {
        text: '',
        passwordtext :'',
        isSecure : true,
        username: '',
        msg :'',
        password: '',
        live :'',
        ipAdd : '',
        name:'',
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

        const url = GLOBAL.BASE_URL +  'list_group_comment_list'


        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                group_id : GLOBAL.groupId,
                user_id : GLOBAL.user_id,
                limit_from :'0'


            }),
        }).then((response) => response.json())
            .then((responseJson) => {


                if (responseJson.status == true){
                    this.setState({live:true})
                    this.setState({msg:''})
                    this.setState({comment:responseJson.chat_list})
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
        const url = GLOBAL.BASE_URL +  'submit_group_comment'


        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                group_id : GLOBAL.groupId,
                user_id : GLOBAL.user_id,
                comment :this.state.msg,
                post_id : '0'


            }),
        }).then((response) => response.json())
            .then((responseJson) => {

                if (this.state.status == true){
                    this.setState({msg:''})
                    this.setState({live:true})
                    this.setState({comment:responseJson.comment_list})
                }else{

                }


            })
            .catch((error) => {
                console.error(error);
            });

    }



    getNewsUpdate(){
        const url = GLOBAL.BASE_URL +  'post_detail'


        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                post_id : GLOBAL.post_id,


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

    _renderItemCategs = (item,index)=>{


        return (

            <View>

                <TouchableOpacity
                    onPress={() => this.delete(item.index)}>
                    <View style = {{marginLeft :10 ,marginRight:10,marginTop:1,
                    }}>
                        <Image style = {{width :60 ,height : 60,borderRadius:30  }}
                               source={{uri :item.item.image}}/>

                        <Image style = {{width :20 ,height : 20 ,marginLeft:40,marginTop:-20 }}
                               source={require('./cross.png')}/>


                    </View>

                </TouchableOpacity>

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
        this.getNewsUpdate()
    }
    componentWillMount() {
        this.props.navigation.addListener('willFocus',this._handleStateChange);
        this.getNewsUpdate()

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
                        alert('No News Found')
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

    shares = (item,index) => {
        GLOBAL.newsid = item.news_id
        this.props.navigation.navigate('NewsDetail')
    }
    render() {


        return (
            <SafeAreaView>
            <View >

                <Image style = {{width :window.width ,height : window.height}}
                       source={require('./background.png')}/>


                <View style={{marginTop:-window.height,width:window.width,height:window.height}}>

                    <KeyboardAwareScrollView contentContainerStyle={{flex:1}}
                                             keyboardShouldPersistTaps = 'always'
                    >
                        <KeyboardAwareScrollView
                            contentContainerStyle = {{height:window.height - 70}}
                            keyboardShouldPersistTaps = 'always'

                        >

                            <View style = {{flexDirection:'row',width:window.width,marginTop:50,justifyContent:'space-between'}}>

                                <TouchableOpacity style = {{width :30 ,height : 30 }}
                                                  onPress={() => this.props.navigation.goBack()}>

                                    <Image style = {{width :20 ,height : 20 ,marginLeft: 20,resizeMode: 'contain'}}
                                           source={require('./arrow.png')}/>

                                </TouchableOpacity>

                                <Text style = {{marginLeft:40,fontSize: 20,color:'#c13e44',fontWeight: 'bold'}}>
                                    {GLOBAL.groupName }
                                </Text>

                                <TouchableOpacity style = {{width :30 ,height : 30 }}
                                                  onPress={() => this.props.navigation.navigate('MemberList')}>
                                    <View style = {{flexDirection:'row',marginRight:20,alignSelf: "flex-end",width:40,height:40,borderRadius:20}}>
                                        <Image style = {{width :40 ,height : 40,borderRadius:20 }}
                                               source={require('./splash.png')}/>

                                    </View>
                                </TouchableOpacity>






                            </View>




                            {this.state.live == false && (
                                <SectionList style = {{marginTop :20}}
                                             ListHeaderComponent={<View>

                                                 {this.state.newsHeading.description != ''  && (
                                                     <View>

                                                         <Image style = {{width :window.width ,height : 200}}
                                                                source={{uri:this.state.newsHeading.image}}/>
                                                         <Text style = {{marginTop:20,marginLeft:40,fontSize: 26,color:'black',fontWeight: 'bold',alignSelf:'center',width:window.width - 80}}>
                                                             {this.state.newsHeading.description}
                                                         </Text>
                                                     </View>
                                                 )}

                                             </View>

                                             }

                                             renderItem={({item, index, section}) =>
                                                 <View/>





                                             }
                                             renderSectionHeader={({section: {title}}) => (

                                                 <View>


                                                 </View>


                                             )}
                                             sections={[
                                                 {title: 'Title1', data: ['Hello']},

                                             ]}
                                             keyExtractor={(item, index) => item + index}
                                />
                            )}
                            {this.state.live == true && (
                                <SectionList style = {{marginTop :20}}
                                             ListHeaderComponent={<View>

                                                 {this.state.newsHeading.description != ''  && (
                                                     <View>

                                                         <Image style = {{width :window.width ,height : 200}}
                                                                source={{uri:this.state.newsHeading.image}}/>
                                                         <Text style = {{marginTop:20,marginLeft:40,fontSize: 26,color:'black',fontWeight: 'bold',alignSelf:'center',width:window.width - 80}}>
                                                             {this.state.newsHeading.description}
                                                         </Text>
                                                     </View>
                                                 )}

                                             </View>

                                             }

                                             renderItem={({item, index, section}) =>

                                                 <View>

                                                     {item.is_user == 1 && item.type == "normal" && (
                                                         <View>
                                                             <View style={[styles.item, styles.itemOut]}>
                                                                 <View style={[styles.balloon, {backgroundColor: '#1084ff'}]}>
                                                                     <Text style={{paddingTop: 5, color: 'white'}}>{item.comment}</Text>
                                                                     <Text style={{paddingTop: 5, color: 'black'}}>{item.name}</Text>
                                                                     <View
                                                                         style={[
                                                                             styles.arrowContainer,
                                                                             styles.arrowRightContainer,
                                                                         ]}
                                                                     >
                                                                         <Svg style={styles.arrowRight} width={moderateScale(15.5, 0.6)} height={moderateScale(17.5, 0.6)} viewBox="32.485 17.5 15.515 17.5"  enable-background="new 32.485 17.5 15.515 17.5">
                                                                             <Path
                                                                                 d="M48,35c-7-4-6-8.75-6-17.5C28,17.5,29,35,48,35z"
                                                                                 fill="#1084ff"
                                                                                 x="0"
                                                                                 y="0"
                                                                             />
                                                                         </Svg>
                                                                     </View>

                                                                 </View>

                                                             </View>
                                                             <View style={{marginTop:3,height:30 ,flexDirection:'row',marginLeft:window.width - 200}}>
                                                                 <TouchableOpacity style = {{width :30 ,height : 30 }}
                                                                                   onPress={() => this.props.navigation.goBack()}>

                                                                     {item.is_user_like == 0 && (
                                                                         <TouchableOpacity
                                                                             onPress={() =>this.likes(item,index)}>
                                                                             <Image style = {{height:20,width:20 ,resizeMode:'contain'}}
                                                                                    source={require('./heart1.png')}/>
                                                                         </TouchableOpacity>



                                                                     )}
                                                                 </TouchableOpacity>

                                                                 {item.is_user_like == 1 && (
                                                                     <TouchableOpacity
                                                                         onPress={() =>this.likes(item,index)}>
                                                                         <Image style = {{height:20,width:20 ,resizeMode:'contain'}}
                                                                                source={require('./heart.png')}/>
                                                                     </TouchableOpacity>

                                                                 )}


                                                                 <TouchableOpacity
                                                                     onPress={() =>this.likes(item,index)}>
                                                                     <Text style = {{marginLeft:2,color:'#cdcdcd'}}>
                                                                         {item.total_likes} Like
                                                                     </Text>
                                                                 </TouchableOpacity>

                                                                 <TouchableOpacity
                                                                     onPress={() =>this.single(item)}>
                                                                     <Image style = {{height:20,width:20 ,resizeMode:'contain',marginLeft:20}}
                                                                            source={require('./ellip.png')}/>

                                                                 </TouchableOpacity>
                                                                 <TouchableOpacity
                                                                     onPress={() => this.single(item)}>
                                                                     <Text style = {{marginLeft:2,color:'#cdcdcd'}}>
                                                                         {item.total_comments} Comments
                                                                     </Text>
                                                                 </TouchableOpacity>

                                                             </View>
                                                         </View>
                                                     )}


                                                     {item.is_user != 1 &&  item.type == "normal" &&(
                                                         <View>
                                                             <View style={[styles.item, styles.itemIn]}>
                                                                 <View style={[styles.balloon, {backgroundColor: 'grey'}]}>
                                                                     <Text style={{paddingTop: 5, color: 'white'}}>{item.comment}</Text>
                                                                     <Text style={{paddingTop: 5, color: 'black'}}>{item.name}</Text>
                                                                     <View
                                                                         style={[
                                                                             styles.arrowContainer,
                                                                             styles.arrowRightContainer,
                                                                         ]}
                                                                     >
                                                                         <Svg style={styles.arrowLeft} width={moderateScale(15.5, 0.6)} height={moderateScale(17.5, 0.6)} viewBox="32.484 17.5 15.515 17.5"  enable-background="new 32.485 17.5 15.515 17.5">
                                                                             <Path
                                                                                 d="M38.484,17.5c0,8.75,1,13.5-6,17.5C51.484,35,52.484,17.5,38.484,17.5z"
                                                                                 fill="grey"
                                                                                 x="0"
                                                                                 y="0"
                                                                             />
                                                                         </Svg>
                                                                     </View>

                                                                 </View>

                                                             </View>
                                                             <View style={{marginLeft:7,marginTop:3,height:30 ,flexDirection:'row',width:window.width - 200}}>



                                                                 {item.is_user_like == 0 && (
                                                                     <Image style = {{height:20,width:20 ,resizeMode:'contain'}}
                                                                            source={require('./heart1.png')}/>

                                                                 )}

                                                                 {item.is_user_like == 1 && (
                                                                     <Image style = {{height:20,width:20 ,resizeMode:'contain'}}
                                                                            source={require('./heart.png')}/>

                                                                 )}
                                                                 <Text style = {{marginLeft:2,color:'#cdcdcd'}}>
                                                                     {item.total_likes} Like
                                                                 </Text>

                                                                 <TouchableOpacity
                                                                     onPress={() =>this.single(item)}>
                                                                     <Image style = {{height:20,width:20 ,resizeMode:'contain',marginLeft:20}}
                                                                            source={require('./ellip.png')}/>
                                                                 </TouchableOpacity>
                                                                 <TouchableOpacity
                                                                     onPress={() =>this.single(item)}>
                                                                     <Text style = {{marginLeft:2,color:'#cdcdcd'}}>
                                                                         {item.total_comments} Comments
                                                                     </Text>
                                                                 </TouchableOpacity>

                                                             </View>
                                                         </View>
                                                     )}


                                                     { item.type == "news" &&(
                                                         <View>
                                                             <TouchableOpacity
                                                                 onPress={() =>this.shares(item,index)}>
                                                                 <View style={[styles.item, styles.itemIn]}>
                                                                     <View style={[styles.balloon, {backgroundColor: '#d9d9d9'}]}>


                                                                         <Image style = {{width :180 ,height : 100,borderRadius:20  }}
                                                                                source={{uri :item.image}}/>


                                                                         <Text style={{paddingTop: 5, color: 'black',width:180,textAlign:'center'}}>{item.news_title}</Text>



                                                                     </View>

                                                                 </View>
                                                             </TouchableOpacity>

                                                         </View>
                                                     )}

                                                 </View>





                                             }
                                             renderSectionHeader={({section: {title}}) => (

                                                 <View>


                                                 </View>


                                             )}
                                             sections={[
                                                 {title: 'Title1', data: this.state.comment},

                                             ]}
                                             keyExtractor={(item, index) => item + index}
                                />

                            )}








                        </KeyboardAwareScrollView>

                        <View style={[{height: 40,padding: 4,width:window.width ,position:'absolute',bottom:0,backgroundColor :'#dbdad6',flexDirection:'row',justifyContent:'space-between'}, {height: Math.max(40, this.state.height + 2 )}]}>


                            <TextInput
                                multiline={true}
                                autoCorrect = {false}
                                placeholder = {'Send Message ...'}
                                value = {this.state.msg}
                                onContentSizeChange={(event) => {
                                    this.setState({height: event.nativeEvent.contentSize.height});
                                }}

                                onChangeText={(text) => this.setState({msg:text})}
                                style={[{height: 40,borderWidth: 0.0,borderColor: '#0f0f0f',fontSize: 16,padding: 4,width:window.width - 100}, {height: Math.max(40, this.state.height)}]}
                                defaultValue={this.state.value}
                            />


                            <Button
                                style={{ fontSize: 18, color: 'black',alignSelf:'flex-end',marginRight:2 }}
                                containerStyle={{ marginLeft:15,width:70,padding: 10, height: 45, overflow: 'hidden' ,marginLeft:15}}

                                onPress={() => this.getChat()}
                            >
                                SEND
                            </Button>
                        </View>
                    </KeyboardAwareScrollView>
                    <View style = {{position:'absolute',bottom:70,right:5}}>
                        <FloatingAction
                            actions={actions}
                            onPressItem={name => {
                                this.props.navigation.navigate('Topic')
                            }}
                        />

                    </View>






                </View>

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