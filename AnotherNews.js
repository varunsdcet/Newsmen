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
    Linking,
    Share,
    SafeAreaView,
    WebView,
    ActivityIndicator
} from 'react-native';

const { width, height } = Dimensions.get('window');
import ActionSheet from 'react-native-actionsheet'
const window = Dimensions.get('window');
const GLOBAL = require('./Global');
import MyWebView from 'react-native-webview-autoheight';
import SlidingUpPanel from 'rn-sliding-up-panel';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


var conc='';
export default class AnotherNews extends Component<Props> {
    state = {
        news_description :[],
        related_news :[],
        comment :[],
        isBookmark :false,
        islike :false,
        loading:false,
        texts: '',
        shareLink :'',
        news:[],
        user:[],


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
    getNewsIntially(){


        const url = GLOBAL.BASE_URL +  'news_description'

        this.showLoading()
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id : GLOBAL.another,
                news_id: GLOBAL.newsid,

            }),
        }).then((response) => response.json())
            .then((responseJson) => {
                this.hideLoading()
                if (responseJson.status == true) {



//shareLink
                    this.setState({news_description:responseJson.news_description})
                    this.setState({comment:responseJson.news_description.comment})
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
                    alert('No Data Found')
                }
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

    componentDidMount(){
        Linking.addEventListener('url', this.handleOpenURL);
        this.getNewsIntially()
        this.getNewsUpdates()
        this.apna()
    }
    handleOpenURL(event) {
        console.log(event.url);

        const route = e.url.replace(/.*?:\/\//g, '');
        // do something with the url, in our case navigate(route)
    }

    _fancyShareMessage=()=>{
        var a = this.state.shareLink

        Share.share({
                message:'Newsmen' ,url:a
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

        let url = '';
        if (this.state.islike == false)
        {


            url = GLOBAL.BASE_URL + 'add_news_like'
        }else {
            url = GLOBAL.BASE_URL + 'dislike_news_like'
        }


        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id : GLOBAL.another,
                news_id: GLOBAL.newsid,

            }),
        }).then((response) => response.json())
            .then((responseJson) => {

                if (responseJson.status == true) {

                    this.setState({islike :!this.state.islike})



                }else {
                    alert('No Data Found')
                }
            })
            .catch((error) => {
                console.error(error);
            });

    }

    bookmark = () =>{

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
                user_id : GLOBAL.another,
                news_id: GLOBAL.newsid,

            }),
        }).then((response) => response.json())
            .then((responseJson) => {

                if (responseJson.status == true) {

                    this.setState({isBookmark :!this.state.isBookmark})



                }else {
                    alert('No Data Found')
                }
            })
            .catch((error) => {
                console.error(error);
            });

    }


    like = (item,index) =>{


        const url = GLOBAL.BASE_URL +  'like_news_comment'


        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id : GLOBAL.another,
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
                    alert('No Data Found')
                }
            })
            .catch((error) => {
                console.error(error);
            });

    }

    comment  = (item,index) => {


        GLOBAL.comment_id = item.comment_id
        GLOBAL.comment = item.comment
        this.props.navigation.navigate('MyComment')


    }


    _handleCategorySelectss=(item,index)=>{

        GLOBAL.anotherUsername = item.user_name
        GLOBAL.another =  item.user_id;



        const url = GLOBAL.BASE_URL +  'last_chat_insert'


        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sender_id : GLOBAL.another,
                reciever_id: item.user_id,
                news_id: GLOBAL.newsid,
                message :'',



            }),
        }).then((response) => response.json())
            .then((responseJson) => {

                if (responseJson.status == true) {
                    this._panel.hide()


                    this.props.navigation.navigate('SingleChat')


                    //   this.setState({news:responseJson.news})

                }else {
                    alert('No Data Found')
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

    _handleCategorySelect=(item,index)=>{



        const url = GLOBAL.BASE_URL +  'submit_group_comment_news'


        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id : GLOBAL.another,
                group_id: item.group_id,
                news_id: GLOBAL.newsid,

            }),
        }).then((response) => response.json())
            .then((responseJson) => {

                if (responseJson.status == true) {
                    this._panel.hide()

                    GLOBAL.groupName = item.g_name
                    GLOBAL.groupId =  item.group_id

//        alert(item.group_id)
                    // GLOBAL.array =   [...GLOBAL.array,  item]
                    this.props.navigation.navigate('ChatGroup')


                    //   this.setState({news:responseJson.news})

                }else {
                    alert('No Data Found')
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
                user_id : GLOBAL.another,
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




        return(
            <TouchableOpacity >
                <View style={{flexDirection:'row', marginTop:10, width:window.width, marginBottom:10}}>
                    <Image style={{height:40, width:40, borderRadius:20}} source={{uri:item.image}}/>

                    <View style={{flexDirection:'column',width:'70%'}}>

                        <View style={{flexDirection:'row', justifyContent:'space-between', }}>

                            <View style={{flexDirection:'column', marginLeft:10}}>
                                <Text style={{color:'black', fontSize:18,fontWeight:'bold' }}>{item.user_name}</Text>
                                <View style={{flexDirection:'row', justifyContent:'space-between'}}>

                                    <Text style={{color:'grey', fontSize:11}}>{item.comment_time}</Text>
                                </View>
                            </View>


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

                </View>
                <View style={{width:window.width, height:1, backgroundColor:'grey', marginTop:10}}></View>
            </TouchableOpacity>
        )
    }
    newsPress = (video) => {
        GLOBAL.newsid = video
        this.props.navigation.navigate('Recent')
        //newsid
    }
    _renderItemc = ({item,index}) => {

        return (
            <TouchableOpacity
                onPress={() => this.newsPress(item.news_id)}>
                <View style={{flexDirection:'row',width:window.width}}>
                    <Image style={{width:120, height:120, marginTop:10, borderRadius:5}} source={{uri :item.image}}/>
                    <View style={{flexDirection:'column', margin:10}}>
                        <Text style={{fontSize:18, color:'black',width:window.width/2, marginTop:10, fontWeight:'bold', lineHeight:20, textAlign:'left'}}>{item.title}</Text>
                        <View style={{flexDirection:'row', justifyContent:'space-between',width:'60%', marginTop:15}}>
                            <Text style={{fontSize:12, color:'grey'}}>{item.category}</Text>
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('Chat')}>
                                <View style={{flexDirection:'row'}}>
                                    <Image style={{width:20, height:20, resizeMode:'contain'}} source={require('./ch.png')} />
                                    <Text style={{fontSize:12, color:'grey', marginLeft:5,marginTop:2}}>{item.total_comment}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={{width:'100%', height:1, backgroundColor:'grey', marginTop:10, marginRight:10}}></View>

            </TouchableOpacity>

        )}
    apna(){
        const url = GLOBAL.BASE_URL +  'list_user'


        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id : GLOBAL.another,
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


        return (

            <View>

                <TouchableOpacity
                    onPress={() => this._handleCategorySelectss(item.item,index)}>
                    <View style = {{marginLeft :50 ,marginRight:10,marginTop:2, marginBottom:20,width:40,
                        backgroundColor:'white',padding:5}}>
                        <Image style = {{width :60 ,height : 60 ,padding:12,margin:5 ,borderRadius:30 }}
                               source={{uri: item.item.image}}/>
                        <Text style = {{fontSize: 11,marginBottom:2,textAlign:'center',width:100,marginLeft:-20}}>
                            {item.item.user_name}
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
        const url = GLOBAL.BASE_URL +  'submit_news_comment'


        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id : GLOBAL.another,
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
                    alert('No Data Found')
                }
            })
            .catch((error) => {
                console.error(error);
            });
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
            <View style={styles.container}>


                <Image style = {{width :window.width ,height : window.height}}
                       source={require('./background.png')}/>
                <View style={{marginTop:-window.height, flex:1}}>
                    <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>

                        <View style = {{flexDirection:'row',width:window.width,marginTop:30}}>
                            <TouchableOpacity style = {{width :30 ,height : 30 }}
                                              onPress={() => this.props.navigation.goBack()}>
                                <Image style = {{width :20 ,height : 20 ,marginLeft: 10,resizeMode: 'contain'}}
                                       source={require('./arrow.png')}/>
                            </TouchableOpacity>
                        </View>
                        <View style={{flexDirection:'column', margin:15}}>
                            <Text style={{color:'black',fontSize:30,fontWeight:'bold' }}>{this.state.news_description.news_title}</Text>

                            <View style={{flexDirection:'row', justifyContent:'space-between', width:'100%', marginTop:10}}>

                                <View style={{flexDirection:'row',}}>
                                    <Image style={{width:40, height:40, borderRadius:20}}  source={{uri :this.state.news_description.author_image}}/>
                                    <View style={{flexDirection:'column', marginLeft:10}}>
                                        <Text style={{color:'black', fontSize:15, fontWeight:'bold', marginTop:5}}>{this.state.news_description.author_name}</Text>
                                        <Text style={{color:'grey', fontSize:13, marginTop:1}}>{this.state.news_description.published_date}</Text>
                                    </View>


                                </View>


                            </View>




                            <MyWebView style = {{marginLeft:-20,width:window.width+10,justifyContent:'center' }}
                                       source={{html: htmlResponse}}
                                       scalesPageToFit={true}

                                       startInLoadingState={false}
                            />







                            <Text style={{color:'black', fontSize:22,marginTop:10,fontWeight:'bold'}}>Related</Text>

                            <FlatList style= {{marginTop :10,width:window.width}}
                                      data={this.state.news_description.related_news}
                                      numColumns={1}
                                      keyExtractor = { (item, index) => index.toString() }
                                      renderItem={this._renderItemc}
                                      extraData={this.state}
                            />



                            <View style={{marginTop:10, flexDirection:'row'}}>
                                <Text style={{color:'black', fontSize:22,fontWeight:'bold'}}>Comments</Text>
                                <Text style={{color:'grey', fontSize:22,fontWeight:'bold',marginLeft:5 }}>{this.state.comment.length}</Text>

                            </View>

                            <FlatList style= {{marginTop :10,width:window.width,}}
                                      data={this.state.comment}
                                      numColumns={1}
                                      keyExtractor = { (item, index) => index.toString() }
                                      renderItem={this._renderItemp}
                                      extraData={this.state}
                            />

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
                            <TouchableOpacity style={{width:'25%',}}>
                                <View style={{width:'25%',alignSelf:'center'}}>
                                    <Image style={{width:30, height:30, resizeMode:'contain',}} source={require('./ellip.png')} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{width:'25%'}} onPress={() => this.newsLike()}>
                                <View style={{width:'25%',alignSelf:'center'}}>
                                    {this.state.islike == false && (
                                        <Image style={{width:30, height:30, resizeMode:'contain'}} source={require('./thum.png')} />
                                    )}
                                    {this.state.islike == true && (
                                        <Image style={{width:30, height:30, resizeMode:'contain'}} source={require('./likes.png')} />
                                    )}
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{width:'25%'}} onPress={() => this.bookmark()}>

                                <View style={{width:'25%',alignSelf:'center'}}>
                                    {this.state.isBookmark == false && (
                                        <Image style={{width:30, height:30, resizeMode:'contain',alignSelf:'center'}} source={require('./start.png')} />
                                    )}
                                    {this.state.isBookmark == true && (
                                        <Image style={{width:30, height:30, resizeMode:'contain',alignSelf:'center'}} source={require('./favourite.png')} />
                                    )}
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{width:'25%'}} onPress={() => this._panel.show()} >
                                <View style={{width:'25%',alignSelf:'center'}}>
                                    <Image style={{width:30, height:30, resizeMode:'contain',alignSelf:'center'}} source={require('./share.png')} />
                                </View>
                            </TouchableOpacity>
                        </View>

                    </KeyboardAwareScrollView>
                    <SlidingUpPanel ref={c => this._panel = c}>
                        <View style={{backgroundColor :'white',borderRadius:20,width:window.width - 20 ,marginLeft:10,height:window.height - 120,marginTop :120}}>

                            <Text style={{color:'grey',fontSize:13,margin:10 }}>SHARE THIS NEWS</Text>




                            <Image style = {{width :window.width - 20 ,height : 150,resizeMode:'stretch' }}
                                   source={{uri :this.state.news_description.image}}/>


                            <View style = {{backgroundColor:'rgba(0, 0, 0, 0.3)',marginTop:-150,height:150}}>
                            </View>


                            <Text style={{color:'white',fontSize:18,margin:10 ,marginTop: - 60 }}>{this.state.news_description.news_title}</Text>

                            <Text style={{color:'grey',fontSize:13,marginLeft:10,marginTop:10 }}>SHARE WITH GROUPS</Text>
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
                            <Text style={{color:'grey',fontSize:13,marginLeft:10,marginTop:10 }}>SHARE WITH USERS</Text>

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

                            <Text style={{color:'grey',fontSize:13,marginLeft:10,marginTop:10 }}>SHARE WITH SOCIAL MEDIA</Text>

                            <View style = {{flexDirection :'row',alignSelf:'center'}}>
                                <TouchableOpacity  onPress={() => this._fancyShareMessage()}>
                                    <Image style={{width:40, height:40, resizeMode:'contain', marginTop:15,marginLeft:10}} source={require('./shares.png')}/>
                                </TouchableOpacity>
                                <TouchableOpacity  onPress={() => this._fancyShareMessage()}>
                                    <Image style={{width:40, height:40, resizeMode:'contain', marginTop:15,marginLeft:10}} source={require('./fb.png')}/>
                                </TouchableOpacity>
                                <TouchableOpacity  onPress={() => this._fancyShareMessage()}>
                                    <Image style={{width:40, height:40, resizeMode:'contain', marginTop:15,marginLeft:10}} source={require('./google.png')}/>
                                </TouchableOpacity>
                                <TouchableOpacity  onPress={() => this._fancyShareMessage()}>
                                    <Image style={{width:40, height:40, resizeMode:'contain', marginTop:15,marginLeft:10}} source={require('./twitter.png')}/>
                                </TouchableOpacity>
                                <TouchableOpacity  onPress={() => this._fancyShareMessage()}>
                                    <Image style={{width:40, height:40, resizeMode:'contain', marginTop:15,marginLeft:10}} source={require('./linkedin.png')}/>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </SlidingUpPanel>
                </View>
            </View>
            </SafeAreaView>

        );
    }
}

const styles = StyleSheet.create({
    container: {

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


