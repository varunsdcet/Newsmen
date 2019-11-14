import React, {Component} from 'react';
import { StyleSheet,Text,Platform,TextInput,FlatList, View,Image ,Alert,AsyncStorage,Dimensions ,TouchableOpacity,NetInfo,ActivityIndicator,SafeAreaView} from 'react-native';
const window = Dimensions.get('window');
import Video from 'react-native-video';
import Button from 'react-native-button';
const GLOBAL = require('./Global');
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
type Props = {};
var catid = 1;
import { Thumbnail } from 'react-native-thumbnail-video';



export default class Videos extends Component {
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
        news:[],
        array :[





        ],
        newsHeading :['Video','High Flyer','View Point'],
        selected :[],
        isReady: false,
        status: null,
        quality: null,
        error: null,
        isPlaying: true,
        isLooping: true,
        duration: 0,
        currentTime: 0,
        fullscreen: false,
        containerMounted: false,
        containerWidth: null,
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
    // _videoPress = (video) => {
    //     GLOBAL.video = video
    //     this.props.navigation.navigate('MyVideo')
    //     //newsid
    // }
    _handleCategorySelect = (item,index) => {

        let { array } = this.state;
        for(let i = 0; i < array.length; i++){
            array[i].selected = "0";
        }


        let targetPost = array[index];
        catid =  array[index].category_id
        this.getMoviesFromApiAsync()
        // Flip the 'liked' property of the targetPost
        targetPost.selected = "1";

        array[index] = targetPost;

        // Then update targetPost in 'posts'
        // You probably don't need the following line.
        // posts[index] = targetPost;

        // Then reset the 'state.posts' property

        this.setState({ array: array})




    }


    showLoading() {
        this.setState({loading: true})
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
    getMoviesFromApiAsync() {
        const url = GLOBAL.BASE_URL +  'video'

        this.showLoading()
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
                this.hideLoading()
                if (responseJson.result == true) {

                    this.setState({array:responseJson.category})
                    this.setState({news:responseJson.news})

                }else {
                    alert('No News Found')
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }
    _videoPress = (video) => {
        if(video.is_url == 0){
            GLOBAL.is_yt=0
            GLOBAL.video = video.image
            this.props.navigation.navigate('MyVideo')

        }else{
            GLOBAL.is_yt= 1
//          alert(video.video_id)
            GLOBAL.video = video.video_id
            this.props.navigation.navigate('MyVideo')

//            this.setState({isPlaying:true})
        }


    }

    _renderItemCategs = (item,index)=>{

//alert(JSON.stringify(item.item.image))
        return (
            <TouchableOpacity
                onPress={() => this._videoPress(item.item)}>


                <View style = {{margin :10 ,backgroundColor:'white',height:'auto',padding:5,alignSelf: 'center',shadowColor: 'black',width:window.width - 20,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.8,
                    shadowRadius: 2,}}>
                    {item.item.is_url == 0 &&(
                        <View style = {{height:200,width:'100%'}}>

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

                    )}

                    {item.item.is_url !=0 && (
                        <View style = {{height:200,width:'100%'}}>

                            {/*                        <YouTube
            ref={component => {
              this._youTubeRef = component;
            }}
            // You must have an API Key for the player to load in Android
            apiKey= {GLOBAL.youtubekey}
            // Un-comment one of videoId / videoIds / playlist.
            // You can also edit these props while Hot-Loading in development mode to see how
            // it affects the loaded native module
            videoId="ncw4ISEU5ik"
            // videoIds={['qzYgSecGQww', 'XXlZfc1TrD0', 'czcjU1w-c6k', 'uMK0prafzw0']}
            // playlistId="PLF797E961509B4EB5"
            play={false}
            loop={false}
            fullscreen={false}
            controls={1}
            style={{width: '100%', height: 200, alignSelf: 'stretch'}}
            onError={e => this.setState({ error: e.error })}
            onReady={e => this.setState({ isReady: true })}
            onChangeState={e => this.setState({ status: e.state })}
            onChangeQuality={e => this.setState({ quality: e.quality })}
            onChangeFullscreen={e => this.setState({ fullscreen: e.isFullscreen })}
            onProgress={e => this.setState({ duration: e.duration, currentTime: e.currentTime })}
          />
          */}
                            <View style= {{width: '100%', height: 200,backgroundColor: 'black'}}>
                                <Image style = {{width :50 ,height :50  ,position:'absolute',top:70,left:window.width/2 - 35, resizeMode:'contain'}}
                                       source={require('./youtube.png')}/>
                            </View>
                        </View>
                    )}


                    <Text style={{color:'black', fontSize:18,fontWeight:'bold' }}>{item.item.news_title}</Text>

                    <View style = {{flexDirection:'row',justifyContent:'space-between',marginTop:7}}>
                        <Text style = {{color:'#cdcdcd'}}>
                            {item.item.published_date}
                        </Text>

                        {/*                          <View style = {{marginRight: 10,flexDirection:'row'}}>
                              <Image style = {{width :20 ,height : 20 ,resizeMode:'contain'}}
                                     source={require('./chats.png')}/>
                              <Text style = {{marginLeft:7,color:'#cdcdcd'}}>
                                  {item.item.total_comments}
                              </Text>
                          </View>
*/}
                    </View>

                </View>



            </TouchableOpacity>


        )
    }


    _renderItemCateg = (item,index)=>{


        return (
            <TouchableOpacity
                onPress={() => this._handleCategorySelect(item.item,item.index)}>

                {item.item.selected == '1' && (
                    <View style = {{margin :10 ,height :36,backgroundColor:'white',padding:5,alignSelf: 'center',shadowColor: 'black',elevation:5,
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

    componentDidMount(){
        this.getMoviesFromApiAsync()
    }


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
            <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
                <View >
                    <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>
                        <View style = {{flexDirection:'row',width:window.width,justifyContent:'space-between',marginTop:30}}>

                            <Text style = {{fontSize: 34,color:'black',fontWeight: 'bold',margin:10, width:120}}>
                                Video
                            </Text>

                            {/*
                        <View style = {{flexDirection:'row',marginRight:10,marginTop:12}}>
                            <Image style = {{width :30 ,height : 30 ,marginRight: 10,resizeMode: 'contain'}}
                                   source={require('./search.png')}/>


                        </View>
*/}
                        </View>
                        <FlatList style= {{flexGrow:0,marginTop:7}}
                                  data={this.state.array}

                                  horizontal
                                  showsHorizontalScrollIndicator={false}
                                  keyExtractor = { (item, index) => index.toString() }
                                  extraData={this.state}
                                  renderItem={this._renderItemCateg}
                        />
                        <FlatList style= {{flexGrow:0,marginTop:10,marginBottom:50}}
                                  data={this.state.news}


                                  showsHorizontalScrollIndicator={false}
                                  keyExtractor = { (item, index) => index.toString() }
                                  extraData={this.state}
                                  renderItem={this._renderItemCategs}
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