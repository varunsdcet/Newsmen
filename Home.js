import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Platform,
    TextInput,
    FlatList,
    RefreshControl,
    View,
    Image,
    Alert,
    ScrollView,
    AsyncStorage,
    Dimensions,
    TouchableOpacity,
    NetInfo,
    ActivityIndicator,
    AppState,
    SafeAreaView,
    Linking
} from 'react-native';
import {
    SCLAlert,
    SCLAlertButton
} from 'react-native-scl-alert';

import LinearGradient from 'react-native-linear-gradient';
const window = Dimensions.get('window');
import HTML from 'react-native-render-html';
import MaterialTabs from 'react-native-material-tabs';
import Video from 'react-native-video';
import Button from 'react-native-button';
import * as Progress from 'react-native-progress';
const GLOBAL = require('./Global');
import SwipeGesture from './swipe-gesture';

import NotifService from './NotifService';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import {
    createStackNavigator,
    createAppContainer,
    createDrawerNavigator,
    StackActions,
    NavigationActions
} from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Dialog, {
    DialogButton,
    DialogContent,
    DialogFooter,
    DialogTitle,
    SlideAnimation
} from "react-native-popup-dialog";

type Props = {};
var catid = "1";
export default class Home extends Component {
    constructor(props) {

        super(props)
        this.notif = new NotifService(this.onRegister.bind(this), this.onNotif.bind(this));
        this.page = 1;
    }
    state = {
        text: '',
        isFetching:false,
        passwordtext :'',
        isListEnd:false,
        isSecure : true,
        username: '',
        password: '',
        status :'',
        ipAdd : '',
        loading:'',
        states:'',
        results: [],
        selectedTab:0,
        upward :false,
        answer : true,
        report:[],
        movieList:[],show:false,
        newsid :'',
        visible:false,
        array :[
            {
                title :'News',
                selected:'Y',
                color :'red'
            },
            {
                title :'High Flyer',
                selected:'',
                color :'blue'
            },
            {
                title :'View Point',
                selected:'',
                color :'#c13e44'
            },
            {
                title :'Entertain Me',
                selected:'',
                color :'purple'
            },
            {
                title :'Hign School News',
                selected:'',
                color :'orange'
            },




        ],
        newsHeading :[],
        news :[],
        selected :[],

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
    onRegister(token) {


       GLOBAL.deviceToken =  token.token;
       this.setState({ registerToken: token.token, gcmRegistered: true });
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


    showLoading() {
        this.setState({loading: true})
    }

    componentWillReceiveProps() {
//        alert('rerender here')
        //this.yourFunction()
        this.setState({selectedTab:0})
        this.categorySelect(0)

    }

    submitPoll(poll_id,answer,index){

        if(GLOBAL.user_id ==''){
            this.setState({show:true})
            //alert('Please login first to continue..')
        }else{
            const url = GLOBAL.BASE_URL +  'submit_poll'

            this.showLoading()
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id : GLOBAL.user_id,
                    poll_id: poll_id,
                    answer:answer
                }),
            }).then((response) => response.json())
                .then((responseJson) => {
                    this.hideLoading()
                    if (responseJson.status == true) {
                        let { news } = this.state;
                        let targetPost = news[index];

                        targetPost = responseJson.poll_detail;
                        news[index] = targetPost;
                        this.setState({ news: news})

                    }else {
                        alert('No News Found')
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }


    }

    getNewsIntially(){
        this.setState({news:[]})
this.showLoading()
        const url = GLOBAL.BASE_URL +  'home_api'


        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id : GLOBAL.user_id,
                limit_from: '0',
                category_id:catid,
                "polls_ids":"0"
            }),
        }).then((response) => response.json())
            .then((responseJson) => {
 this.hideLoading()
                this.setState({isFetching:false})

                if (responseJson.result == true) {

                    this.setState({array:responseJson.category})

                    var my = [];
                    {responseJson.category.map((message) =>
                        my.push(message.name)

                    )
                    }

                    this.setState({movieList:my})

                    this.setState({news:responseJson.news})

                }else {
                    alert('No News Found')
                }
            })
            .catch((error) => {
                console.error(error);
                this.hideLoading()
            });
    }
    getNewsUpdate(){
        const url = GLOBAL.BASE_URL +  'home_api'
       this.showLoading()

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id : GLOBAL.user_id,
                limit_from: '0',
                category_id:catid,
                "polls_ids":"0"
            }),
        }).then((response) => response.json())
            .then((responseJson) => {

                if (responseJson.result == true) {


                    this.setState({news:responseJson.news})
                    this.hideLoading()

                }else {
                    alert('No News Found')
                }
            })
            .catch((error) => {
                console.error(error);
                this.hideLoading()
            });

    }
    getNewsUpdateMore(){


    }

    componentWillMount() {
        this.getNewsIntially()
        this.getReports()
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



    change = () =>{
        this.setState({answer:!this.state.answer})
    }

    hideLoading() {
        this.setState({loading: false})
    }
    renderButtons = () => {
        const views = [];
        for ( var i =0; i<5; i++){
            views.push(
                <Button
                    key={i}
                    onPress={onPressLearnMore}
                    title="Learn More"
                    color="#841584"
                    accessibilityLabel="Learn more about this purple button"
                />);
        } // % buttons are created.

        return views;
    }
    _handleCategorySelect = (item,index) => {

        let { array } = this.state;
        for(let i = 0; i < array.length; i++){
            array[i].selected = "0";
        }


        let targetPost = array[index];
        catid =  array[index].category_id
        this.getNewsIntially()
        // Flip the 'liked' property of the targetPost
        targetPost.selected = "1";

        array[index] = targetPost;

        // Then update targetPost in 'posts'
        // You probably don't need the following line.
        // posts[index] = targetPost;

        // Then reset the 'state.posts' property

        this.setState({ array: array})




    }

    _videoPress = (video) => {
        GLOBAL.video = video
        this.props.navigation.navigate('MyVideo')
        //newsid
    }
    _YesReportNews=(item)=>{
        this.setState({visible:false})
//alert(report_news_id +' ' + GLOBAL.user_id)
        const url = GLOBAL.BASE_URL +  'report_on_news_added'

//      this.showLoading()
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id : GLOBAL.user_id,
                news_id: this.state.newsid,
                report_id: item.report_id

            }),
        }).then((response) => response.json())
            .then((responseJson) => {

//    alert(JSON.stringify(responseJson))
                //     this.hideLoading()
                if (responseJson.status == true) {
                    alert('Thank you for reporting this news!')
                }else {
                    alert('You have already raised a report against this news!')
                }
            })
            .catch((error) => {
                console.error(error);
            });


    }
    newsPress = (video) => {


        GLOBAL.newsid = video
        this.props.navigation.navigate('NewsDetail')
        //newsid
    }
    reportNews=(item)=>{

        this.setState({newsid:item.item.news_id})

        this.setState({visible:true})
        // Alert.alert('Report News!','Are you sure you want to Report this news post?',
        //     [{text:"Cancel"},
        //         {text:"Yes", onPress:()=>this._YesReportNews(item.item.news_id)
        //         },
        //     ],
        //     {cancelable:false}
        // )

//alert(JSON.stringify(item.item.news_id) +' '+ GLOBAL.user_id)
    }

    _renderItemCategs = (item,index)=> {



        var a ;
        if (item.index == 2) {

        }

        if (item.item.poll_answer == 1) {
            a = true;
        } else {
            a = false;
        }



        return (
            <View>
                <TouchableOpacity
                    onPress={() => this.newsPress(item.item.news_id)}
                    activeOpacity={.99} >
                    {item.item.is_poll == 0 && item.item.file_type == "image"  && (
                        <View style = {{margin :10 ,backgroundColor:'white',padding:0,alignSelf: 'center',width:window.width - 20,
                        }}>


                            <Image style = {{width :window.width ,marginLeft:-10  ,height : 220 }}
                                   source={{uri :item.item.image}}/>


                            <Text style = {{marginLeft:5,fontSize: 22,color:'black',marginTop:8,fontWeight: 'bold'}}>
                                { item.item.news_title}
                            </Text>



                            <Text style = {{marginLeft:5,fontSize: 16,color:'#333232',marginTop:8,}}>
                                { item.item.news_subheading}
                            </Text>


                            <View style = {{marginLeft:5,flexDirection:'row',justifyContent:'space-between',marginTop:7}}>
                                <Text style = {{color:'#cdcdcd'}}>
                                    { item.item.news_category}
                                </Text>
                                <View style = {{flexDirection:'row'}}>
                                    <TouchableOpacity style={{width:50, height:30}}
                                                      activeOpacity={.7} >
                                        <View style={{flexDirection:'row'}}>
                                            <Image style = {{width :20 ,height : 20 ,resizeMode:'contain'}}
                                                   source={require('./chats.png')}/>
                                            <Text style = {{marginLeft:7,color:'#cdcdcd',marginTop:-1}}>
                                                { item.item.total_comments}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                    {GLOBAL.user_id =='' && (
                                        <View></View>
                                    )}
                                    {GLOBAL.user_id !='' && (
                                        <TouchableOpacity style={{width:20, height:30}}
                                                          activeOpacity={.7}
                                                          onPress={()=> this.reportNews(item)}>
                                            <View style={{flexDirection:'row'}}>
                                                <Image style = {{width :20 ,height : 20 ,resizeMode:'contain'}}
                                                       source={require('./flag_news.png')}/>
                                            </View>
                                        </TouchableOpacity>

                                    )}

                                </View>

                            </View>


                        </View>
                    )}
                </TouchableOpacity>
                {item.item.is_poll == 0 && item.item.file_type == "video"  && (
                    <View>
                        <View style = {{margin :10 ,backgroundColor:'white',height:'auto',padding:5,alignSelf: 'center',width:window.width - 20,
                        }}>
                            <TouchableOpacity
                                onPress={() => this._videoPress(item.item.image)}
                                activeOpacity={.7} >
                                <View style = {{height:200,width:window.width - 30}}>

                                    <Video
                                        source={{uri: item.item.image}}
                                        ref={(ref) => {
                                            this._player = ref
                                        }}
                                        rate={1.0}
                                        paused={true}
                                        volume={1.0}
                                        isMuted={false}
                                        resizeMode="cover"
                                        shouldPlay
                                        style={styles.video}/>

                                    <Image style = {{width :50 ,height :50  ,position:'absolute',top:70,left:window.width/2 - 35}}
                                           source={require('./play.png')}/>


                                </View>

                            </TouchableOpacity>
                            <Text style = {{marginLeft:5,fontSize: 22,color:'black',marginTop:8,}}>
                                { item.item.news_title}
                            </Text>

                            <Text style = {{marginLeft:5,fontSize: 16,color:'#757272',marginTop:8,}}>
                                { item.item.news_subheading}
                            </Text>
                        </View>
                        <View style = {{flexDirection:'row',justifyContent:'space-between',marginTop:7,marginBottom:10, marginRight:5 }}>
                            <Text style = {{color:'#cdcdcd', marginLeft:5}}>
                                { item.item.news_category}
                            </Text>

                            <View style = {{marginRight: 10,flexDirection:'row'}}>
                                <Image style = {{width :20 ,height : 20 ,resizeMode:'contain'}}
                                       source={require('./chats.png')}/>
                                <Text style = {{marginLeft:7,color:'#cdcdcd'}}>
                                    { item.item.total_comments}
                                </Text>
                            </View>

                        </View>
                    </View>

                )}

                {item.item.is_poll == 1 && (
                    <LinearGradient colors={['#ebc0c3', '#f0717a', '#ed0e1e']} style = {{margin :10 ,backgroundColor:'white',height:'auto',alignSelf: 'center',shadowColor: 'black',width:window.width - 20}}>
                        <Text style = {{fontSize: 22,color:'black',backgroundColor:'transparent',marginTop:8,fontWeight: 'bold', width:'95%', textAlign:'left', marginBottom:10, marginTop:30, marginLeft:10, marginRight:10}}>
                            {item.item.question}
                        </Text>
                        {item.item.answer_array.map((prop, key) => {
                            //alert(a)
                            var k = prop.option_percentile /100.0
                            var commonHtml = ` ${prop.option_percentile}%`;

                            return (
                                <View style={{marginTop:5}}>
                                    {a == false && (

                                        <TouchableOpacity
                                            onPress={() => this.submitPoll(item.item.poll_id,prop.option,item.index)}>
                                            <View style = {{width:'97%',height:50,borderWidth:2,borderColor:'white',
                                                color:'white',alignSelf:'center',
                                                margin:2,marginBottom:10, flexDirection:'column', justifyContent:'center',}} >


                                                <Text style = {{color:'white',fontSize:17,textAlign:'left', marginLeft:20,}} >
                                                    {prop.option}
                                                </Text>


                                            </View>
                                        </TouchableOpacity>
                                    )}
                                    { a != false && (

                                        <View style = {{flexDirection:'row',width:'97%',borderRightWidth:2,borderRightColor:'white',color:'white',
                                            marginBottom:10, height:50, alignItems:'center', alignSelf:'center',
                                            borderTopColor:'white', borderTopWidth:2, borderBottomWidth:2, borderBottomColor:'white'}} >

                                            <Progress.Bar  progress={k} width={window.width - 70} unfilledColor ={'white'} showsText = {true} formatText = {'he'} height = {48} borderColor={'white'}borderRadius={0}color = {'#c43b42'}/>
                                            <Text style = {{color:'white',fontSize:12,textAlign:'center',marginLeft:2, fontWeight:'bold'}} >
                                                {commonHtml}
                                            </Text>
                                            <Text style = {{color:'black',fontSize:17,width:window.width - 30,height:50,position:'absolute',top:'25%',alignSelf:'center',marginLeft:15,}} >
                                                {prop.option}
                                            </Text>
                                        </View>

                                    )}
                                </View>
                            );
                        })}



                    </LinearGradient>

                )}


                <View style = {{height:1,backgroundColor :'#eaeaea',width:window.width-30 ,marginTop :0,marginLeft:15}}>
                </View>

            </View>

        )
    }

    onNotif(notif) {
        //   alert(AppState.currentState)


      //  alert(AppState.currentState)
        if (AppState.currentState == 'background' ||AppState.currentState == "inactive" ){

            if (notif.data.sd_type == "chat"){
                this.props.navigation.navigate('ApniChat')
            }else if (notif.data.sd_type == "follow"){
           GLOBAL.another = notif.data.following_id
                this.props.navigation.navigate('AnotherProfile')
            }else if (notif.data.sd_type == "group"){

                this.props.navigation.navigate('GroupList')
            }
            else if (notif.data.sd_type == "news"){
                GLOBAL.newsid = notif.data.news_id
                this.props.navigation.navigate('NewsDetail')
            }
        }


        console.log(notif);
        //Alert.alert(notif.title, notif.message);
    }
    _renderItemCateg = (item,index)=>{


        return (
            <TouchableOpacity
                onPress={() => this._handleCategorySelect(item.item,item.index)}>

                {item.item.selected == '1' && (
                    <View style = {{margin :10 ,height :36,backgroundColor:'white',padding:5,alignSelf: 'center',shadowColor: 'black',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.8,
                        shadowRadius: 2,}}>

                        <Text style = {{fontSize: 19,color:'#c13e44'}}>
                            {item.item.name}
                        </Text>

                    </View>

                )}

                {item.item.selected != '1' && (
                    <Text style = {{margin :10 ,fontSize: 18,height :36,backgroundColor:'white',padding:5,alignSelf: 'center'} }>


                        {item.item.name}


                    </Text>

                )}
            </TouchableOpacity>
        )
    }
    handleOpenURL = (event) => { // D

        const route = event.replace(/.*?:\/\//g, '');
        GLOBAL.newsid = route
        this.props.navigation.navigate('NewsDetail')
    }

    _handleStateChange = state => {
        const url = GLOBAL.BASE_URL +  'home_api'


        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id : GLOBAL.user_id,
                limit_from: '0',
                category_id:catid
            }),
        }).then((response) => response.json())
            .then((responseJson) => {

                if (responseJson.result == true) {



                    this.setState({array:responseJson.category})

                    var my = [];
                    {responseJson.category.map((message) =>
                        my.push(message.name)

                    )
                    }

                    this.setState({movieList:my})

                    this.setState({news:responseJson.news})

                }else {
                    alert('No News Found')
                }
            })
            .catch((error) => {
                console.error(error);
            });

    };
    componentDidMount(){

        this.props.navigation.addListener('willFocus',this._handleStateChange);
        Linking.getInitialURL()
            .then(url => {
                this.handleOpenURL(url)
            })
            .catch(err => {
                console.warn('Deeplinking error', err)
            })

        Linking.addListener('url', e => {

            this.handleOpenURL(e.url)
        })
    }
    categorySelect = (index) =>{


        catid =  this.state.array[index].category_id


        this.setState({ selectedTab: index })
        this.getNewsIntially()

    }
    onScroll = (event) => {

        var currentOffset = event.nativeEvent.contentOffset.y;
        var direction = currentOffset > this.offset ? 'down' : 'up';
        // this.offset = currentOffset;


        if (currentOffset > 60.0){
            this.setState({upward :true})
        }else{
            this.setState({upward :false})
        }

    }
    onSwipePerformed = (action) => {
        /// action : 'left' for left swipe
        /// action : 'right' for right swipe
        /// action : 'up' for up swipe
        /// action : 'down' for down swipe
alert(action)
        switch(action){
            case 'left':{
                console.log('left Swipe performed')
            }
            case 'right':{
                console.log('right Swipe performed')
            }
            case 'up':{
                console.log('up Swipe performed')
            }
            case 'down':{
                console.log('down Swipe performed')
            }
            default : {
                console.log('Undeteceted action')
            }
        }
    }
    onSwipeUp(gestureState) {
        this.setState({myText: 'You swiped up!'});
    }

    onSwipeDown(gestureState) {
        this.setState({myText: 'You swiped down!'});
    }

    onSwipeLeft(gestureState) {
        this.props.navigation.navigate('ApniChat')

        this.setState({myText: 'You swiped left!'});
    }
    onSwipeRight(gestureState) {
//      alert('swiped right')
        this.setState({myText: 'You swiped right!'});
    }

    onSwipe(gestureName, gestureState) {
        const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
        this.setState({gestureName: gestureName});

    }

    handleLoadMore = () => {








           // alert(JSON.stringify(this.state.news))
            //this.page = this.page + 1; // increase page by 1
            this.showLoading()

            const url = GLOBAL.BASE_URL +  'home_api'


            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id : GLOBAL.user_id,
                    limit_from: this.state.news.length + 1,
                    category_id:catid,
                    polls_ids:"0"
                }),
            }).then((response) => response.json())
                .then((responseJson) => {

               this.hideLoading()

                    if (responseJson.result == true) {

                        //     const interest = [...this.state.news, ...responseJson.news];

                        //       this.setState({news:interest})

                    }else {
                        alert('No News Found')
                    }
                })
                .catch((error) => {
                    console.error(error);
                });

            // method for API call

    };
    renderFooter = () => {
        //it will show indicator at the bottom of the list when data is loading otherwise it returns null
        if (!this.state.loading) return null;
        return (
            <ActivityIndicator
                style={{ color: '#000' }}
            />
        );
    };
    createGroup = () => {
        GLOBAL.array = [];
        this.props.navigation.navigate('CreateGroup')
    }

    onSwipeLeft(gestureState) {

        this.props.navigation.navigate('ApniChat')
    }
    onSwipeUp(gestureState) {
        alert('hi')
        this.setState({myText: 'You swiped up!'});
    }

    onSwipeDown(gestureState) {
        alert('hi')
        this.setState({myText: 'You swiped down!'});
    }

    getReports() {
        var url = GLOBAL.BASE_URL + 'report_causes_list'

        return fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
//           alert(JSON.stringify(responseJson))
                if(responseJson.status ==true){
                    this.setState({report: responseJson.list})

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


    renderReports=({item, index})=>{
//alert(JSON.stringify(item))
        return(
            <TouchableOpacity onPress={()=> this._YesReportNews(item)}>
                <View style={{height:50,width:'100%', flexDirection:'column', borderBottomWidth:1.5, borderBottomColor:'#bfbfbf'}}>

                    <Text style={{width:'95%', height:'auto', margin:5,fontSize:15, alignSelf:'center'}}>{item.title}</Text>
                </View>
            </TouchableOpacity>
        )
    }


    loadMoreData = () => {



        var pollid ;
        for (var i = 0 ; i < this.state.news.length ; i ++ ){
            if (this.state.news[i].is_poll ==1){
                pollid = pollid +  this.state.news[i].poll_id + ','
            }
        }

        pollid = pollid.slice(0, -1);
                const url = GLOBAL.BASE_URL +  'home_api'


                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id : GLOBAL.user_id,
                        limit_from: this.state.news.length + 1,
                        category_id:catid,
                        polls_ids:pollid
                    }),
                }).then((response) => response.json())
                    .then((responseJson) => {

                        this.setState({loading:false})

                        if (responseJson.result == true) {
                            if (responseJson.news.length == 0){

                            }else {

                                const interest = [...this.state.news, ...responseJson.news];

                                this.setState({news: interest})
                            }

                        }else {
                            this.setState({isListEnd:true})
                            this.setState({loading:false})
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });




    }


    onSwipeRight(gestureState) {
        alert('hi')
        this.setState({myText: 'You swiped right!'});
    }
    onRefresh() {
        this.setState({ isFetching: true }, function() { this.getNewsIntially() });
    }

    onSwipe(gestureName, gestureState) {
        const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
        this.setState({gestureName: gestureName});
        switch (gestureName) {
            case SWIPE_UP:
                this.setState({backgroundColor: 'red'});
                break;
            case SWIPE_DOWN:
                this.setState({backgroundColor: 'green'});
                break;
            case SWIPE_LEFT:
                this.setState({backgroundColor: 'blue'});
                break;
            case SWIPE_RIGHT:
                this.setState({backgroundColor: 'yellow'});
                break;
        }
    }
    render() {




        return (
            <View style={styles.container}>
                <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>



                    {this.state.upward == false && (
                        <View style = {{flexDirection:'row',width:window.width}}>



                            <TouchableOpacity style = {{width :30 ,height : 30 }}
                                              onPress={() =>this.props.navigation.toggleDrawer()}>
                                <Image style = {{width :25 ,height : 25 ,marginLeft: 12,resizeMode: 'contain',marginTop:15}}
                                       source={require('./menu.png')}/>
                            </TouchableOpacity>

                            <Image style = {{marginTop: - 2,width :200 ,height : 60 ,marginLeft: 13,resizeMode:'contain'}}
                                   source={require('./TheNewsMenLogo.png')}/>

                            <View style = {{flexDirection:'row',marginRight:10,marginTop:11,marginLeft:window.width - 350}}>
                                <TouchableOpacity style = {{width :30 ,height : 30 }}
                                                  onPress={() => this.createGroup()}>
                                    <Image style = {{width :30 ,height : 30 ,marginLeft: -6,resizeMode: 'contain'}}
                                           source={require('./newplus.png')}/>
                                </TouchableOpacity>
                                <TouchableOpacity style = {{width :30 ,height : 30 }}
                                                  onPress={() => this.props.navigation.navigate('ApniChat')}>
                                    <Image style = {{width :30 ,height : 30 ,marginLeft: 1,resizeMode: 'contain',marginTop:0}}
                                           source={require('./newchat.png')}/>
                                </TouchableOpacity>
                                <TouchableOpacity style = {{width :30 ,height : 30 }}
                                                  onPress={() => this.props.navigation.navigate('GroupList')}>
                                    <Image style = {{width :30 ,height : 30 ,marginLeft: 6,resizeMode: 'contain'}}
                                           source={require('./newuser.png')}/>
                                </TouchableOpacity>


                            </View>

                        </View>
                    )}

                    <View style = {{marginTop:-15}}>

                    <MaterialTabs
                        items={this.state.movieList}
                        scrollable = {true}
                        tabWidth = {80}

                        barColor = 'white'
                        selectedIndex={this.state.selectedTab}
                        indicatorColor = '#c43b42'
                        activeTextColor = 'black'
                        inactiveTextColor = 'black'
                        allowFontScaling ={true}
                        textStyle ={ {fontSize:15,width:200}}


                        onChange={index =>

                            this.categorySelect(index)
                        }




                    />
                    </View>


                    {this.state.loading==true && (
                        <View style = {{marginTop :window.height /2 - 100}}>
                            <Image style={{alignSelf:'center', width:80, height:80, resizeMode:'contain'}} source={require('./load_news.png')}/>

                            <Text style={{width:100, fontWeight:'bold', fontSize:18, alignSelf:'center',textAlign:'center',color:'#cdcdcd'}}>Loading News</Text>
                        </View>
                    )}
                    {this.state.news.length==0 && this.state.loading==false  &&(
                        <View style = {{marginTop :window.height /2 - 100}}>
                            <Image style={{alignSelf:'center', width:80, height:80, resizeMode:'contain'}} source={require('./no_news.png')}/>

                            <Text style={{width:100, fontWeight:'bold', fontSize:18, alignSelf:'center',textAlign:'center',color:'#cdcdcd'}}>No News Found</Text>
                        </View>
                    )}


                    {this.state.news.length!=0 &&(




                    <FlatList style= {{flexGrow:0,marginTop:5}}
                              data={this.state.news}
                              onScroll={this.onScroll}
                              onRefresh={()=>this.onRefresh()}
                              refreshing={this.state.isFetching}
                              showsHorizontalScrollIndicator={false}
                              keyExtractor = { (item, index) => index.toString() }
                              extraData={this.state}
                              renderItem={this._renderItemCategs}
                              ListFooterComponent={this.renderFooter.bind(this)}
                              onEndReachedThreshold={0.5}
                              onEndReached={() => this.loadMoreData()}


                    />
                    )}

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
                            title={'Report News'}/>

                        <DialogContent style={{width:300, height:220}}>

                            <FlatList style= {{marginTop :10,width:'100%',height:220}}
                                      data={this.state.report}
                                      numColumns={1}
                                      keyExtractor = { (item, index) => index.toString() }
                                      renderItem={this.renderReports}
                                      extraData={this.state}
                            />

                        </DialogContent>
                    </Dialog>
                </SafeAreaView>
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
    video: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
})