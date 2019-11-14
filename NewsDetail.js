import React, {Component} from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    Alert,
    View,
    Image,
    FlatList,
    TouchableOpacity,
    Dimensions,
    TextInput,
    Button,
    SafeAreaView,
    Linking,
    Share,
    WebView,
    ActivityIndicator
} from 'react-native';
import {
    SCLAlert,
    SCLAlertButton
} from 'react-native-scl-alert'

const { width, height } = Dimensions.get('window');
import ActionSheet from 'react-native-actionsheet'
const window = Dimensions.get('window');
const GLOBAL = require('./Global');
import MyWebView from 'react-native-webview-autoheight';
import SlidingUpPanel from 'rn-sliding-up-panel';
var randomString = require('random-string');
import Backend from "./Backend.js";
import {GiftedChat} from "react-native-gifted-chat";
//import AutoHeightWebView from 'react-native-autoheight-webview'

import Dialog, { SlideAnimation,DialogFooter, DialogButton, DialogContent, DialogTitle} from 'react-native-popup-dialog';


import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {NavigationActions, StackActions} from "react-navigation";

import Modal from "react-native-modal";
var conc='';
export default class NewsDetail extends Component<Props> {
    state = {
        news_description :[],
        news_title:'',
        related_news :[],
        comment :[],
        isBookmark :false,
        related_tags:[],
        islike :false,
        loading:false,
        texts: '',
        hide : false,
        visible :'',
        total_likes_news:0,
        shareLink :'',
        news:[],
        user:[],show:false,
        moviesList:[],
        visibleModal :false,



        array : ["1","2","3"],
        response: [
            {
                name:'first'
            },
            {
                name:'second'
            },
            {
                name:'third'
            },
            {
                name:'fourth'
            },
            {
                name:'fifth'
            },
            {
                name:'sixth'
            },
        ],
        selectedBoxes: [] // this array will hold the names of the items that were selected
    }
    showLoading() {
        this.setState({loading: true})
    }

    hideLoading() {
        this.setState({loading: false})
    }

    handleOpen = () => {
        this.setState({ show: true })
    }

    handleClose = () => {
        this.setState({ show: false })
    }

    handleCloseDone=()=>{
        this.setState({show :false})

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

    }

    getNewsIntially(){


        const url = GLOBAL.BASE_URL +  'news_description'

        this.showLoading()
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id : GLOBAL.user_id,
                news_id: GLOBAL.newsid,

            }),
        }).then((response) => response.json())
            .then((responseJson) => {
//              alert(JSON.stringify(responseJson.news_description.total_likes))
                this.hideLoading()
                if (responseJson.status == true) {


                    GLOBAL.newsImage = responseJson.news_description.image
                    GLOBAL.newsTitle = responseJson.news_description.news_title
//shareLink
                    this.setState({news_title : responseJson.news_description.news_title})
                    this.setState({news_description:responseJson.news_description})
                    this.setState({comment:responseJson.news_description.comment})
                    this.setState({total_likes_news : parseInt(responseJson.news_description.total_likes)})
                    this.setState({related_tags : responseJson.news_description.tags.split(',')})
                    this.setState({shareLink:responseJson.news_description.share_link})
                    if (responseJson.news_description.is_like == 1){
                        this.setState({islike:true})

                    }else{
                        this.setState({islike:false})
                    }

                    if (responseJson.news_description.is_bookmark == 1){
                        this.setState({isBookmark:true})
                    }else{
                        this.setState({isBookmark:false})
                    }
                    //   this.setState({news:responseJson.news})

                }else {
                    //      alert('No Data Found')
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }
    getReports() {
        var url = GLOBAL.BASE_URL + 'report_causes_list'

        return fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
//           alert(JSON.stringify(responseJson))
                if(responseJson.status ==true){
                    this.setState({moviesList: responseJson.list})

                }
                else{
                    alert('Something went wrong!')
                }
                //      return responseJson.movies;
            })
            .catch((error) => {
                console.error(error);
            });
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

    componentWillMount(){
        Linking.addEventListener('url', this.handleOpenURL);
        this.props.navigation.addListener('willFocus',this._handleStateChange);

    }

    _handleStateChange = state => {
        //alert('hoho')
//       this.getMoviesFromApiAsync()

        this.getNewsIntially()
        this.getNewsUpdates()
        this.apna()
this.getReports()
    };


    selectReportIssue = (item, index)=>{
//  alert(GLOBAL.user_id +" "+ item.report_id+ " "+GLOBAL.commentFlagId )
        //report_on_news_comment_added

        const url = GLOBAL.BASE_URL +  'report_on_news_comment_added'


        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id : GLOBAL.user_id,
                comment_id : GLOBAL.commentFlagId,
                report_id : item.report_id


            }),
        }).then((response) => response.json())
            .then((responseJson) => {
//        alert(JSON.stringify(responseJson))
                if(responseJson.status==true){
                    alert('Thanks for reporting! We take your reports seriously!')
                    this.setState({visible:false})
                    this.setState({is_flagged: '1'})

                }else if(responseJson.status ==false){
                    alert('You have already raised a report against this comment!')
                }
            })
            .catch((error) => {
                console.error(error);
                alert('Something went wrong! Please Check your Internet Connection!')
            });

    }

    renderReports=({item, index})=>{
//alert(JSON.stringify(item))
        return(
            <TouchableOpacity onPress={()=> this.selectReportIssue(item)}>
                <View style={{height:50,width:'100%', flexDirection:'column', borderBottomWidth:1.5, borderBottomColor:'#bfbfbf'}}>

                    <Text style={{width:'95%', height:'auto', margin:5,fontSize:15, alignSelf:'center'}}>{item.title}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    handleOpenURL(event) {
        console.log(event.url);

        const route = e.url.replace(/.*?:\/\//g, '');
        // do something with the url, in our case navigate(route)
    }
    _showResult = () => {
        this.setState({hide:false})
    }



    _fancyShareMessage=()=>{

        var a = this.state.shareLink

        Share.share({
                message:'' ,url:a
            },{
                tintColor:'green',
                dialogTitle:'Share this news via....'
            }
        ).then(this._showResult);
    }

    onUpdate = (name) => {
        this.setState(previous => {
            let selectedBoxes = previous.selectedBoxes;
            let index = selectedBoxes.indexOf(name) // check to see if the name is already stored in the array
            if (index === -1) {
                selectedBoxes.push(name) // if it isn't stored add it to the array
            } else {
                selectedBoxes.splice(index, 1) // if it is stored then remove it from the array
            }
            return { selectedBoxes }; // save the new selectedBoxes value in state
        }, () => alert(this.state.selectedBoxes)); // check that it has been saved correctly by using the callback function of state
    }

    newsLike = () =>{
        if(GLOBAL.user_id ==''){
//        alert('Please login first to continue..')
            this.setState({show:true})
        }
        else{
            let url = '';
            if (this.state.islike == false)
            {


                url = GLOBAL.BASE_URL + 'add_news_like'
                this.setState({total_likes_news : this.state.total_likes_news+1})
            }else {
                url = GLOBAL.BASE_URL + 'dislike_news_like'
                this.setState({total_likes_news : this.state.total_likes_news-1})

            }


            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id : GLOBAL.user_id,
                    news_id: GLOBAL.newsid,

                }),
            }).then((response) => response.json())
                .then((responseJson) => {
//alert(JSON.stringify(responseJson))
                    if (responseJson.status == true) {

                        this.setState({islike :!this.state.islike})
//                    this.setState({total_likes_news : this.state.total_likes_news})


                    }else {
                        //      alert('No Data Found')
                    }
                })
                .catch((error) => {
                    console.error(error);
                });


        }
    }

    bookmark = () =>{
        if(GLOBAL.user_id ==''){
            this.setState({show:true})
            //alert('Please login first to continue..')
        }
        else{
            let url = '';
            if (this.state.isBookmark == false)
            {


                url = GLOBAL.BASE_URL + 'add_news_bookmark'
            }else {
                url = GLOBAL.BASE_URL + 'delete_bookmark_news'
            }


            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id : GLOBAL.user_id,
                    news_id: GLOBAL.newsid,

                }),
            }).then((response) => response.json())
                .then((responseJson) => {

                    if (responseJson.status == true) {

                        this.setState({isBookmark :!this.state.isBookmark})



                    }else {
                        //      alert('No Data Found')
                    }
                })
                .catch((error) => {
                    console.error(error);
                });


        }
    }


    like = (item,index) =>{
        if(GLOBAL.user_id ==''){
            this.setState({show: true})
//        alert('Please login first to continue..')
        }
        else {
            const url = GLOBAL.BASE_URL +  'like_news_comment'


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
                        var a = parseInt(item.total_likes) + 1
                        var b = a.toString()

                        targetPost.is_user_like = 1;
                        targetPost.total_likes = b
                        comment[index] = targetPost;
                        this.setState({ comment: comment})


                        //   this.setState({news:responseJson.news})

                    }else {
                        //      alert('No Data Found')
                    }
                })
                .catch((error) => {
                    console.error(error);
                });


        }

    }

    comment  = (item,index) => {


        GLOBAL.comment_id = item.comment_id
        GLOBAL.comment = item.comment
//        alert('adasd')
        this.props.navigation.navigate('MyComment')


    }


    _handleCategorySelectss=(item,index)=>{

        GLOBAL.anotherUsername = item.second_user_name
        GLOBAL.another =  item.second_user_id;

        GLOBAL.muid = 'u'+GLOBAL.user_id + GLOBAL.another
        GLOBAL.newsWhich = "1";
        GLOBAL.guid ="0";

        const url = GLOBAL.BASE_URL +  'last_chat_insert'


        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sender_id : GLOBAL.user_id,
                reciever_id: item.second_user_id,
                news_id: GLOBAL.newsid,
                message :'',



            }),
        }).then((response) => response.json())
            .then((responseJson) => {
                //alert(JSON.stringify(responseJson))

                if (responseJson.status == true) {
                    this.setState({hide:false})
                  //  this._panel.hide()
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
                                GLOBAL.muid= responseJson.g_id
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


                    // this.props.navigation.navigate('Chat')


                    //   this.setState({news:responseJson.news})

                }else {
                    //      alert('No Data Found')
                }
            })
            .catch((error) => {
                console.error(error);
            });



//         GLOBAL.groupName = item.g_name
//         GLOBAL.groupId =  item.group_id
//
// //        alert(item.group_id)
//         // GLOBAL.array =   [...GLOBAL.array,  item]
//         this.props.navigation.navigate('ChatGroup')
    }
    _YesDeleteComment=(item)=>{
        const url = GLOBAL.BASE_URL +  'delete_news_comment'


        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                comment_id: item.comment_id

            }),
        }).then((response) => response.json())
            .then((responseJson) => {
//              alert(JSON.stringify(responseJson))
                if (responseJson.status == true) {
//                  alert('del')
                    // let { comment } = this.state;
                    // let targetPost = comment[index];
                    // var a = parseInt(item.total_likes) - 1
                    // var b = a.toString()
                    //
                    // targetPost.is_user_like = 0;
                    // targetPost.total_likes = b
                    // comment[index] = targetPost;
                    // this.setState({ comment: comment})
                    //
                    //
                    // //   this.setState({news:responseJson.news})
                    this.getNewsIntially()

                }else {
                    alert('Something went wrong!')
                }
            })
            .catch((error) => {
                console.error(error);
            });


    }

    deletecomment = (item,index) =>{
        if(GLOBAL.user_id ==''){
            this.setState({show: true})
//        alert('Please login first to continue..')
        }
        else{
            Alert.alert('Delete Comment!','Are you sure you want to Delete this Comment?',
                [{text:"Cancel"},
                    {text:"Yes", onPress:()=>this._YesDeleteComment(item)
                    },
                ],
                {cancelable:false}
            )

        }


    }




    onPressFlagPost=(item,index)=>{
        if(GLOBAL.user_id ==''){
            this.setState({show: true})
//        alert('Please login first to continue..')
        }
        else{
            GLOBAL.commentFlagId = item.comment_id
            this.setState({visible:true})
        }
    }

    _handleCategorySelect=(item,index)=>{



        const url = GLOBAL.BASE_URL +  'submit_group_comment_news'


        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id : GLOBAL.user_id,
                group_id: item.group_id,
                news_id: GLOBAL.newsid,

            }),
        }).then((response) => response.json())
            .then((responseJson) => {

//alert(JSON.stringify(responseJson))
                if (responseJson.status == true) {
                 //   this._panel.hide()
                    this.setState({hide:false})
                    GLOBAL.groupName = item.g_name
                    GLOBAL.groupId =  item.group_id
                    GLOBAL.muid = 'g'+item.group_id
                    GLOBAL.newsWhich = "1";
                    GLOBAL.anotherUsername = item.g_name
                    GLOBAL.guid ="1";

                    this.props.navigation.navigate('Chat')


                    //   this.setState({news:responseJson.news})

                }else {
//                    alert('No Data Found')
                }
            })
            .catch((error) => {
                console.error(error);
            });



//         GLOBAL.groupName = item.g_name
//         GLOBAL.groupId =  item.group_id
//
// //        alert(item.group_id)
//         // GLOBAL.array =   [...GLOBAL.array,  item]
//         this.props.navigation.navigate('ChatGroup')
    }

    unlike = (item,index) =>{
        const url = GLOBAL.BASE_URL +  'dislike_news_comment'


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

    _renderItemp=({item,index})=>{
//      alert(JSON.stringify(item))
        return(
            <View>
                <View style={{flexDirection:'row', marginTop:10, width:window.width, marginBottom:10}}>
                    <Image style={{height:40, width:40, borderRadius:20}} source={{uri:item.image}}/>

                    <View style={{flexDirection:'column',width:'90%'}}>

                        <View style={{flexDirection:'row', justifyContent:'space-between',width:'90%' }}>

                            <View style={{flexDirection:'column', marginLeft:10, width:'80%'}}>
                                <Text style={{color:'black', fontSize:18,fontWeight:'bold', width:'60%' }}>{item.user_name}</Text>
                                <View style={{flexDirection:'row', justifyContent:'space-between'}}>

                                    <Text style={{color:'grey', fontSize:11}}>{item.comment_time}</Text>
                                </View>
                            </View>

                            {item.comment_user_id!=GLOBAL.user_id &&(

                                <TouchableOpacity style={{width:35, height:45}}onPress={()=> this.onPressFlagPost(item,index)}>
                                    <Image style={{width:20, height:20, resizeMode:'contain', marginTop:5}} source={require('./flag_post.png')}/>
                                </TouchableOpacity>
                            )}
                        </View>

                        <Text style={{fontSize:15, color:'grey', marginLeft:-40, lineHeight:20, marginTop:15}}>{item.comment}</Text>
                    </View>


                </View>
                <View style={{flexDirection:'row', marginTop:3 }}>

                    <TouchableOpacity
                        onPress={() => this.like(item,index)}>
                        {item.is_user_like == 0 && (
                            <Image style={{width:18, height:18, resizeMode:'contain', marginLeft:5}} source={require('./thum.png')} />
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.unlike(item,index)}>
                        {item.is_user_like == 1 && (
                            <Image style={{width:18, height:18, resizeMode:'contain', marginLeft:5}} source={require('./likes.png')} />
                        )}
                    </TouchableOpacity>
                    <Text style={{color:'grey',fontSize:12, marginTop:2,marginLeft:5 }}>{item.total_likes}</Text>
                    <TouchableOpacity
                        onPress={() => this.comment(item,index)}>

                        <Image style={{width:18, height:18, resizeMode:'contain', marginLeft:5}} source={require('./ellip.png')} />

                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.comment(item,index)}>
                        <Text style={{color:'grey',fontSize:12, marginTop:2,marginLeft:5 }}>{item.total_reply}</Text>
                    </TouchableOpacity>

                    {item.comment_user_id==GLOBAL.user_id &&(
                        <TouchableOpacity
                            onPress={() => this.deletecomment(item,index)}>

                            <Image style={{width:18, height:18, resizeMode:'contain', marginLeft:5}} source={require('./rubbish_bin.png')} />

                        </TouchableOpacity>


                    ) }


                </View>
                <View style={{width:window.width, height:1, backgroundColor:'grey', marginTop:10}}></View>
            </View>
        )
    }
    newsPress = (item) => {
        // GLOBAL.newsid = video
        // this.props.navigation.navigate('Recent')
        //newsid
        //alert('sdf')
        GLOBAL.author_id = ''
        GLOBAL.type = ''
        GLOBAL.keyword = item
        GLOBAL.author = item
        this.props.navigation.navigate('DiscoverDetail')

    }
    _renderItemc = ({item,index}) => {
//       alert(JSON.stringify(item.item))
        return (
            <TouchableOpacity
                onPress={() => this.newsPress(item)}>
                <View style={{flexDirection:'row',width:'auto', backgroundColor:'#efefef', width:'auto', marginRight:10}}>

                    <Text style={{margin:10, fontSize:15}}>{item}</Text>

                </View>


            </TouchableOpacity>

        )}
    apna(){
        const url = GLOBAL.BASE_URL +  'sd_user_follower_list'


        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id : GLOBAL.user_id,
                limit_from: '0',

            }),
        }).then((response) => response.json())
            .then((responseJson) => {




                this.setState({user:responseJson.user_list})
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


    pagals = (item,index)=>{
//      alert(JSON.stringify(item.item.second_user_image))

        return (

            <View>

                <TouchableOpacity
                    onPress={() => this._handleCategorySelectss(item.item,index)}>
                    <View style = {{marginLeft :50 ,marginRight:10,marginTop:2, marginBottom:20,width:40,
                        backgroundColor:'white',padding:5}}>
                        <Image style = {{width :60 ,height : 60 ,padding:12,margin:5 ,borderRadius:30 }}
                               source={{uri: item.item.second_user_image}}/>
                        <Text style = {{fontSize: 11,marginBottom:2,textAlign:'center',width:100,marginLeft:-20}}>
                            {item.item.second_user_name}
                        </Text>

                    </View>
                </TouchableOpacity>



            </View>

        )
    }


    pagal = (item,index)=>{


        return (

            <View>

                <TouchableOpacity
                    onPress={() => this._handleCategorySelect(item.item,index)}>
                    <View style = {{marginLeft :50 ,marginRight:10,marginTop:2, marginBottom:20,width:40,
                        backgroundColor:'white',padding:5}}>
                        <Image style = {{width :60 ,height : 60 ,padding:12,margin:5 ,borderRadius:30 }}
                               source={{uri: item.item.image}}/>
                        <Text style = {{fontSize: 11,marginBottom:2,textAlign:'center',width:100,marginLeft:-20}}>
                            {item.item.g_name}
                        </Text>
                    </View>

                </TouchableOpacity>



            </View>

        )
    }
    send = () =>{

        if(GLOBAL.user_id ==''){
            this.setState({show:true})
            //alert('Please login first to continue..')
        }else if(this.state.texts==''){

            alert('Comment cannot be blank!')
        }else{
            const url = GLOBAL.BASE_URL +  'submit_news_comment'


            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id : GLOBAL.user_id,
                    news_id: GLOBAL.newsid,
                    comment :this.state.texts

                }),
            }).then((response) => response.json())
                .then((responseJson) => {

                    if (responseJson.status == true) {
                        this.setState({texts:''})

                        this.setState({comment:responseJson.comment_list})
                        //   this.setState({news:responseJson.news})

                    }else {
                        //      alert('No Data Found')
                    }
                })
                .catch((error) => {
                    console.error(error);
                });

        }


    }
    myShare = () => {
        this.setState({hide : true})
        //this._panel.show()
    }
    myShares = () => {
      alert('dd')
        //this._panel.show()
    }
    render() {
        var htmlResponse = this.state.news_description.news_description

        if(this.state.loading){
            return(
                <View style={styles.container}>
                    <ActivityIndicator style = {styles.loading}
                                       size="large" color='#c13e44' />
                </View>
            )
        }

        const { response } = this.state;
        return (
            <SafeAreaView>
            <View >


                <View>
                    <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>

                        <View style = {{flexDirection:'row',width:window.width,marginTop:30}}>
                            <TouchableOpacity style = {{width :30 ,height : 30 }}
                                              onPress={() => this.props.navigation.goBack()}>
                                <Image style = {{width :20 ,height : 20 ,marginLeft: 10,resizeMode: 'contain'}}
                                       source={require('./arrow.png')}/>
                            </TouchableOpacity>
                        </View>
                        <View style={{flexDirection:'column', margin:10}}>
                            <Text style={{color:'black',fontSize:30,fontWeight:'bold', width:window.width-20, height:'auto' }}>{this.state.news_title}</Text>

                            <View style={{flexDirection:'row', justifyContent:'space-between', width:'100%', marginTop:10}}>
                                <View style={{flexDirection:'row',}}>
                                    <Image style={{width:40, height:40, borderRadius:20}}  source={{uri :this.state.news_description.author_image}}/>
                                    <View style={{flexDirection:'column', marginLeft:10, marginTop:-3}}>
                                        {this.state.news_description.author_name =='' &&(
                                            <Text style={{color:'black', fontSize:15, fontWeight:'bold', marginTop:5}}>No Author Name</Text>
                                        )}
                                        {this.state.news_description.author_name!='' &&(
                                            <Text style={{color:'black', fontSize:15, fontWeight:'bold', marginTop:5}}>{this.state.news_description.author_name}</Text>

                                        )}
                                        <Text style={{color:'grey', fontSize:13, marginTop:1, marginBottom:10}}>{this.state.news_description.published_date}</Text>
                                    </View>


                                </View>


                            </View>


                            <MyWebView style = {{marginLeft:-15,width:window.width,justifyContent:'center' }}
                                       source={{html: htmlResponse}}
                                       scalesPageToFit={true}

                                       startInLoadingState={false}
                            />









                            <Text style={{color:'black', fontSize:22,marginTop:10,fontWeight:'bold'}}>Related Tags</Text>

                            <FlatList style= {{marginTop :10,width:window.width}}
                                      data={this.state.related_tags}
                                      numColumns={1}
                                      horizontal
                                      showsHorizontalScrollIndicator={false}

                                      keyExtractor = { (item, index) => index.toString() }
                                      renderItem={this._renderItemc}
                                      extraData={this.state}
                            />



                            <View style={{marginTop:10, flexDirection:'row'}}>
                                <Text style={{color:'black', fontSize:22,fontWeight:'bold', width:120}}>Comments</Text>
                                <Text style={{color:'grey', fontSize:22,fontWeight:'bold',marginLeft:5 }}>{this.state.comment.length}</Text>

                            </View>
                            {this.state.comment.length == 0 &&(
                                <Text style={{color:'grey', fontSize:14,marginLeft:5 }}>Be the first one to comment.</Text>

                            )}
                            {this.state.comment.length!= 0 && (
                                <FlatList style= {{marginTop :10,width:window.width,}}
                                          data={this.state.comment}
                                          numColumns={1}
                                          keyExtractor = { (item, index) => index.toString() }
                                          renderItem={this._renderItemp}
                                          extraData={this.state}
                                />

                            )}

                            <View style={{flexDirection:'row', width:'100%', justifyContent:'space-between'}}>
                                <TextInput style={{width:'80%', height:60,borderBottomColor:'grey', borderBottomWidth:1, marginLeft:5, paddingLeft:10}}
                                           placeholder="Say Something..."
                                           onChangeText={(text) => this.setState({texts:text})}
                                           value={this.state.texts}
                                           placeholderTextColor="grey"/>
                                <TouchableOpacity  onPress={() => this.send()}>
                                    <Image style={{width:30, height:30, resizeMode:'contain', marginTop:18}} source={require('./send.png')}/>
                                </TouchableOpacity>
                            </View>


                        </View>




                        <View style={{flexDirection:'row', width:'100%',height:65,borderTopColor:'grey', borderTopWidth:1, padding:15}}>

                            <TouchableOpacity style={{width:'33%'}} onPress={() => this.newsLike()}>
                                <View style={{width:'33%',alignSelf:'center'}}>
                                    {this.state.islike == false && (
                                        <Image style={{width:30, height:30, resizeMode:'contain'}} source={require('./thum.png')} />
                                    )}
                                    {this.state.islike == true && (
                                        <Image style={{width:30, height:30, resizeMode:'contain'}} source={require('./likes.png')} />
                                    )}
                                </View>

                                <View style={{backgroundColor:'red', position:'absolute', top:-8,right:12, width:25, height:25,flexDirection:'row', justifyContent:'center',alignItems:'center', borderRadius:12.5}}>
                                    <Text style={{color:'white', fontSize:13,}}>{this.state.total_likes_news}</Text>
                                </View>

                            </TouchableOpacity>
                            <TouchableOpacity style={{width:'33%'}} onPress={() => this.bookmark()}>

                                <View style={{width:'33%',alignSelf:'center'}}>
                                    {this.state.isBookmark == false && (
                                        <Image style={{width:30, height:30, resizeMode:'contain',alignSelf:'center'}} source={require('./start.png')} />
                                    )}
                                    {this.state.isBookmark == true && (
                                        <Image style={{width:30, height:30, resizeMode:'contain',alignSelf:'center'}} source={require('./favourite.png')} />
                                    )}
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{width:'33%'}} onPress={() => this.myShare()} >
                                <View style={{width:'33%',alignSelf:'center'}}>
                                    <Image style={{width:30, height:30, resizeMode:'contain',alignSelf:'center'}} source={require('./share.png')} />
                                </View>
                            </TouchableOpacity>
                        </View>


                    </KeyboardAwareScrollView>

                    <Modal
                        isVisible={this.state.hide}
                        animationType="slide"
                        onRequestClose={() => {this.myShares()}}
                        closeOnClick={true}
                        >
                        <TouchableOpacity onPress={() => { this.setState({hide:false})}} style={{flex:1, justifyContent:'center', alignItems:'center',}}>
                        <View style={{backgroundColor :'white',borderRadius:20,width:window.width - 20 ,marginLeft:-10,height:window.height - 100,marginTop :80}}>

                            <Text style={{color:'grey',fontSize:13,margin:10 }}>SHARE THIS NEWS</Text>




                            <Image style = {{width :window.width - 20 ,height : 150,resizeMode:'stretch' }}
                                   source={{uri :this.state.news_description.image}}/>


                            <View style = {{backgroundColor:'rgba(0, 0, 0, 0.3)',marginTop:-150,height:150}}>
                            </View>


                            <Text style={{color:'white',fontSize:18,margin:10 ,marginTop: - 60 }}>{this.state.news_description.news_title}</Text>

                            {GLOBAL.user_id !='' && (

                                <View>

                            <Text style={{color:'grey',fontSize:13,marginLeft:10,marginTop:10,marginBottom :6 }}>SHARE WITH GROUPS</Text>
                            <FlatList style= {{flexGrow:0,marginTop:4}}
                                      data={this.state.news}

                                      horizontal
                                      showsHorizontalScrollIndicator={false}
                                      keyExtractor = { (item, index) => index.toString() }
                                      extraData={this.state}
                                      renderItem={this.pagal}
                            />
                            <View style={{backgroundColor :'black',width:window.width - 20 ,height:1,marginTop :-10}}>
                            </View>

                            <Text style={{color:'grey',fontSize:13,marginLeft:10,marginTop:10,marginBottom :6  }}>SHARE WITH USERS</Text>

                            <FlatList style= {{flexGrow:0,marginTop:4}}
                                      data={this.state.user}

                                      horizontal
                                      showsHorizontalScrollIndicator={false}
                                      keyExtractor = { (item, index) => index.toString() }
                                      extraData={this.state}
                                      renderItem={this.pagals}
                            />
                            <View style={{backgroundColor :'black',width:window.width - 20 ,height:1,marginTop :-10}}>
                            </View>
                                </View>
                            )}

                            <Text style={{color:'grey',fontSize:13,marginLeft:10,marginTop:10 }}>SHARE WITH SOCIAL MEDIA</Text>

                            <View style = {{flexDirection :'row',alignSelf:'center'}}>
                                <TouchableOpacity  onPress={() => this._fancyShareMessage()}>
                                    <Image style={{width:40, height:40, resizeMode:'contain', marginTop:15,marginLeft:10}} source={require('./shares.png')}/>
                                </TouchableOpacity>
                                <TouchableOpacity  onPress={() => this._fancyShareMessage()}>
                                    <Image style={{width:40, height:40, resizeMode:'contain', marginTop:15,marginLeft:10}} source={require('./fb.png')}/>
                                </TouchableOpacity>
                                <TouchableOpacity  onPress={() => this._fancyShareMessage()}>
                                    <Image style={{width:40, height:40, resizeMode:'contain', marginTop:15,marginLeft:10}} source={require('./twitter.png')}/>
                                </TouchableOpacity>
                                <TouchableOpacity  onPress={() => this._fancyShareMessage()}>
                                    <Image style={{width:40, height:40, resizeMode:'contain', marginTop:15,marginLeft:10}} source={require('./linkedin.png')}/>
                                </TouchableOpacity>
                                <TouchableOpacity  onPress={() => this._fancyShareMessage()}>
                                    <Image style={{width:40, height:40, resizeMode:'contain', marginTop:15,marginLeft:10}} source={require('./whatsapp.png')}/>
                                </TouchableOpacity>
                            </View>

                        </View>
                        </TouchableOpacity>
                    </Modal>


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

                <Dialog
                    visible={this.state.visible}
                    onTouchOutside={() => {
                        this.setState({ visible: false });
                    }}
                    dialogAnimation={new SlideAnimation({
                        slideFrom: 'bottom',
                    })}
                    footer={
                        <DialogFooter>
                            <DialogButton
                                text="Cancel"
                                onPress={() => {this.setState({visible:false})}}
                            />
                        </DialogFooter>
                    }
                >
                    <DialogTitle
                        textStyle={{color:'grey',fontSize:18,marginTop:10, fontWeight:'bold' }}
                        title={'Report Comment'}/>

                    <DialogContent style={{width:300, height:220}}>

                        <FlatList style= {{marginTop :10,width:'100%',height:220}}
                                  data={this.state.moviesList}
                                  numColumns={1}
                                  keyExtractor = { (item, index) => index.toString() }
                                  renderItem={this.renderReports}
                                  extraData={this.state}
                        />

                    </DialogContent>
                </Dialog>
            </View>
            </SafeAreaView>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loading: {
        position: 'absolute',
        left: window.width/2 - 30,

        top: window.height/2,

        opacity: 0.5,

        justifyContent: 'center',
        alignItems: 'center'
    },
    strokeColorButton: {
        marginHorizontal: 2.5, marginVertical: 8, width: 30, height: 30, borderRadius: 15,
    },
    strokeWidthButton: {
        marginHorizontal: 2.5, marginVertical: 8, width: 30, height: 30, borderRadius: 15,
        justifyContent: 'center', alignItems: 'center', backgroundColor: '#39579A'
    },
    functionButton: {
        marginHorizontal: 2.5, marginVertical: 8, height: 30, width: 60,
        backgroundColor: '#39579A', justifyContent: 'center', alignItems: 'center', borderRadius: 5,
    }
});