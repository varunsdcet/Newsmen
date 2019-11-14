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
var arrayholder = [];
import { createStackNavigator ,createAppContainer ,createDrawerNavigator} from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type Props = {};
var catid = "1";
export default class Search extends Component {
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

    getNewsIntially(){


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


                //    this.setState({news:responseJson.news})

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


    // SearchFilterFunction(text){
    //     const newData = this.arrayholder.filter(function(item){
    //         const itemData = item.user_name.toUpperCase()
    //         const textData = text.toUpperCase()
    //         return itemData.indexOf(textData) > -1
    //     })
    //     this.setState({
    //         news: newData,
    //         text: text,
    //         nodata:'No found'
    //     })
    //
    // }
    //

    componentWillMount() {
        //this.getNewsIntially()
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
      //  this.getNewsIntially()
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
                    onPress={() => this.newsPress(item.item.news_id)}>
                    {item.item.is_poll == 0 && item.item.file_type == "image"  && (
                        <View style = {{margin :10 ,backgroundColor:'white',padding:0,alignSelf: 'center',shadowColor: 'black',width:window.width - 20,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.8,
                            shadowRadius: 2,}}>


                            <Image style = {{width :window.width - 20 ,height : 220 }}
                                   source={{uri :item.item.image}}/>


                            <Text style = {{marginLeft:5,fontSize: 22,color:'black',fontWeight: 'bold'}}>
                                { item.item.news_title}
                            </Text>


                            <View style = {{marginLeft:5,flexDirection:'row',justifyContent:'space-between',marginTop:7}}>
                                <Text style = {{color:'#cdcdcd'}}>
                                    { item.item.news_category}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('Chat')}>
                                    <View style = {{marginRight: 10,flexDirection:'row'}}>
                                        <Image style = {{width :20 ,height : 20 ,resizeMode:'contain'}}
                                               source={require('./chats.png')}/>
                                        <Text style = {{marginLeft:7,color:'#cdcdcd',marginTop:-1}}>
                                            { item.item.total_comments}
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                            </View>


                            <Text style = {{marginLeft:5,fontSize: 15 ,color:'black'}}>

                            </Text>

                        </View>
                    )}
                </TouchableOpacity>
                {item.item.is_poll == 0 && item.item.file_type == "video"  && (
                    <View style = {{margin :10 ,backgroundColor:'white',height:'auto',padding:5,alignSelf: 'center',shadowColor: 'black',width:window.width - 20,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.8,
                        shadowRadius: 2,}}>
                        <TouchableOpacity
                            onPress={() => this._videoPress(item.item.image)}>
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
                        <Text style = {{marginLeft:5,fontSize: 22 ,color:'black', fontWeight:'bold'}}>
                            { item.item.news_title}
                        </Text>

                        <View style = {{flexDirection:'row',justifyContent:'space-between',marginTop:7}}>
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

                        <Text style = {{marginLeft:5,fontSize: 15 ,color:'black',marginBottom:10}}>

                        </Text>

                    </View>


                )}

                {item.item.is_poll == 1 && (
                    <View style = {{margin :10 ,backgroundColor:'white',height:'auto',padding:5,alignSelf: 'center',shadowColor: 'black',width:window.width - 20,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.8,
                        shadowRadius: 2,}}>

                        <Text style = {{marginLeft:5,fontSize: 22,color:'black',fontWeight: 'bold'}}>
                            {item.item.question}
                        </Text>






                        {item.item.answer_array.map((prop, key) => {
                            //alert(a)
                            var k = prop.option_percentile /100.0
                            var commonHtml = ` ${prop.option_percentile} %`;

                            return (
                                <View>
                                    {a == false && (
                                        <TouchableOpacity
                                            onPress={() => this.submitPoll(item.item.poll_id,prop.option,item.index)}>
                                            <View style = {{width:window.width - 30,height:40,borderRadius:20,borderWidth:2,borderColor:prop.color,color:'white',margin:2,marginBottom:10}} >


                                                <Text style = {{color:prop.color,fontSize:22,textAlign:'center',padding:6}} >
                                                    {prop.option}
                                                </Text>


                                            </View>
                                        </TouchableOpacity>
                                    )}
                                    { a != false && (

                                        <View style = {{flexDirection:'row',width:window.width - 30,borderRadius:20,borderWidth:0,borderColor:'#c13e44',color:'white',margin:2,marginBottom:10}} >

                                            <Progress.Bar  borderRadius ={20} progress={k} width={window.width - 70} unfilledColor ={'#e9e9e9'} showsText = {true} formatText = {'he'} borderColor = {prop.color} height = {40} color = {prop.color}/>
                                            <Text style = {{color:prop.color,fontSize:12,textAlign:'center',padding:12,marginLeft:-10}} >
                                                {commonHtml}
                                            </Text>
                                            <Text style = {{color:'white',fontSize:22,textAlign:'center',padding:8,width:window.width - 30,height:45,position:'absolute',top:0}} >
                                                {prop.option}
                                            </Text>
                                        </View>

                                    )}
                                </View>




                            );
                        })}



                    </View>

                )}

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

    // componentDidMount(){
    //         }
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
    SearchFilterFunction(text){
//      this.getNewsIntially()

        GLOBAL.keyword = text
        GLOBAL.type  = ""
        GLOBAL.author_id = "0"


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


            this.setState({array:responseJson.category})
            this.setState({news:responseJson.news})
            this.arrayholder =  responseJson.news
            // const newData = this.arrayholder.filter(function(item){
            //     const itemData = item.news_title.toUpperCase()
            //     const textData = text.toUpperCase()
            //     return itemData.indexOf(textData) > -1
            // })
            this.setState({
                news: this.state.news,
                text: text,
                nodata:'No found'
            })

        }else {
            this.setState({
                news: [],
                text: text,
                nodata:'No found'
            }
            )
        }
    })
    .catch((error) => {
        console.error(error);
    });


    }

    ok=()=>{
      this.props.navigation.goBack()
    }

    render() {


        return (
            <SafeAreaView style={{flex: 1,}}>
                <View >

                    <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>

                    <View style = {{borderRadius:5 ,height:40,width:window.width ,marginLeft:5,marginTop:10,flexDirection:'row'}}>

                        <View style = {{flexDirection:'row', width:'68%',backgroundColor:'#efefef'}}>

                        <Image style = {{width :18 ,height : 18 ,marginLeft: 10,resizeMode: 'contain',marginTop:10}}
                               source={require('./searchs.png')}/>

                        <TextInput
                            style={{ height: 40, borderColor: 'gray',fontSize:14, borderBottomWidth: 0, marginTop:0 ,marginBottom: 20 ,marginLeft:5,width:window.width -150,color:'black' }}
                            // Adding hint in TextInput using Placeholder option.
                            placeholder="Search News"
                            onChangeText={(text) => this.SearchFilterFunction(text)}

                            // Making the Under line Transparent.
                            underlineColorAndroid="transparent"
                        />
                    </View>

                        <Button
                            style={{ fontSize: 18, color: 'black' }}
                            containerStyle={{ width:100, height: 45,marginTop:8,marginLeft:8}}

                            onPress={this.ok}
                        >
                           Cancel
                        </Button>
                    </View>

                        <FlatList style= {{flexGrow:0,marginTop:5,marginBottom:45}}
                                  data={this.state.news}


                                  showsHorizontalScrollIndicator={false}
                                  keyExtractor = { (item, index) => index.toString() }
                                  extraData={this.state}
                                  renderItem={this._renderItemCategs}
                                  ListFooterComponent={this.renderFooter.bind(this)}
                                  onEndReachedThreshold={0.4}
                                  onEndReached={this.handleLoadMore.bind(this)}
                        />

                    </KeyboardAwareScrollView>
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
    video: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
})
