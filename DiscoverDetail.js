import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Platform,
    TextInput,
    FlatList,
    View,
    Image,
    Alert,
    AsyncStorage,
    Dimensions,
    TouchableOpacity,
    NetInfo,
    ActivityIndicator,
    SafeAreaView,
    Linking
} from 'react-native';
const window = Dimensions.get('window');
import Video from 'react-native-video';
import Button from 'react-native-button';
import * as Progress from 'react-native-progress';
const GLOBAL = require('./Global');
import { createStackNavigator ,createAppContainer ,createDrawerNavigator} from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import {OptimizedFlatList} from 'react-native-optimized-flatlist';


type Props = {};
var catid = "1";
export default class DiscoverDetail extends Component {
    state = {
        text: '',
        passwordtext :'',
        isSecure : true,
        username: '',
        password: '',
        status :'',
        ipAdd : '',
        loading:'',
        states:'',
        results: [],
        answer : true,
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


    showLoading() {
        this.setState({loading: true})
    }
    submitPoll(poll_id,answer,index){

        const url = GLOBAL.BASE_URL +  'submit_poll'

        //      this.showLoading()
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
                //            this.hideLoading()
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

    getNewsIntially(){


        const url = GLOBAL.BASE_URL +  'search_by_discover'

        this.showLoading()
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id : GLOBAL.user_id,
                type: GLOBAL.type,
                keyword:GLOBAL.keyword,
                author_id:GLOBAL.author_id
            }),
        }).then((response) => response.json())
            .then((responseJson) => {
                this.hideLoading()
                if (responseJson.status == true) {
                    //              alert(JSON.stringify(responseJson.news))
//                    this.setState({array:responseJson.category})
                    this.setState({news:responseJson.news})

                }else {
                    alert('No News Found')
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }
    getNewsUpdate(){
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


                    this.setState({news:responseJson.news})

                }else {
                    alert('No News Found')
                }
            })
            .catch((error) => {
                console.error(error);
            });

    }
    getNewsUpdateMore(){


    }

    componentWillMount() {
        this.getNewsIntially()
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

    newsPress = (video) => {
        GLOBAL.newsid = video
        this.props.navigation.navigate('NewsDetail')
        //newsid
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
                    activeOpacity={.7} >
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
                                <TouchableOpacity
                                    activeOpacity={.7} >
                                    <View style = {{marginRight: 10,flexDirection:'row'}}>
                                        <Image style = {{width :20 ,height : 20 ,resizeMode:'contain'}}
                                               source={require('./chats.png')}/>
                                        <Text style = {{marginLeft:7,color:'#cdcdcd',marginTop:-1}}>
                                            { item.item.total_comments}
                                        </Text>
                                    </View>
                                </TouchableOpacity>

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

                        {/*                            <View style = {{flexDirection:'row', marginLeft:5, width:'30%'}}>
                                <Image style = {{width :20 ,height : 20 ,resizeMode:'contain'}}
                                       source={require('./information.png')}/>
                            <Text style = {{color:'white',fontSize:12,textAlign:'left',width:window.width - 30,height:30,marginLeft:5, marginTop:2}} >
                               Sponsored Poll
                            </Text>
                            </View>
*/}
                    </LinearGradient>

                )}


                <View style = {{height:1,backgroundColor :'#eaeaea',width:window.width-30 ,marginTop :0,marginLeft:15}}>
                </View>

            </View>

        )
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

    componentDidMount(){
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
    handleLoadMore = () => {
        if (!this.state.loading) {
            this.page = this.page + 1; // increase page by 1
            // method for API call
        }
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
    render() {

        if(this.state.loading){
            return(
                <View style={styles.container}>
                    <ActivityIndicator style = {styles.loading}
                                       size="large" color='#c13e44' />
                </View>
            )
        }

        return (
            <View style={styles.container}>
                <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>


                    <Image style = {{width :window.width ,height : window.height}}
                           source={require('./background.png')}/>
                    <View style={{marginTop:-window.height,width:window.width,height:window.height}}>
                        <View style = {{flexDirection:'row',width:window.width,marginTop:30}}>
                            <TouchableOpacity style = {{width :30 ,height : 30 }}
                                              onPress={() => this.props.navigation.goBack()}>
                                <Image style = {{width :20 ,height : 20 ,marginLeft: 20,resizeMode: 'contain'}}
                                       source={require('./arrow.png')}/>


                            </TouchableOpacity>

                            <Text style = {{fontSize: 18,fontWeight:'bold',alignSelf:'center',marginLeft :12,width:window.width -150,marginTop : -8}}>
                                {GLOBAL.author}
                            </Text>

                        </View>
                        <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>

                            <OptimizedFlatList style= {{flexGrow:0,marginTop:5,marginBottom:45}}
                                               data={this.state.news}
                                               keyExtractor = { (item, index) => index.toString() }
                                               renderItem={this._renderItemCategs}
                                               initialNumToRender ={10}
                                               onEndReachedThreshold={0.4}
                                               disableVirtualization={true}
                                               legacyImplementation={true}
                                               directionalLockEnabled={true}
                                               maxToRenderPerBatch={10}
                                               windowSize={101}
                                               ListFooterComponent={this.renderFooter.bind(this)}
                                               removeClippedSubviews={true}
                                               onEndReached={this.handleLoadMore.bind(this)}
                                               extraData={this.state}
                            />

                        </KeyboardAwareScrollView>
                    </View>
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