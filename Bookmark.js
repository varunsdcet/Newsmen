import React, {Component} from 'react';
import { StyleSheet,Text,Platform,TextInput,FlatList, View,Image ,Alert,AsyncStorage,Dimensions ,TouchableOpacity,NetInfo,ActivityIndicator,SafeAreaView} from 'react-native';
const window = Dimensions.get('window');
import Video from 'react-native-video';
import Button from 'react-native-button';
import * as Progress from 'react-native-progress';
const GLOBAL = require('./Global');
import { createStackNavigator ,createAppContainer ,createDrawerNavigator} from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type Props = {};
var catid = "1";
export default class Bookmark extends Component {
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


        const url = GLOBAL.BASE_URL +  'list_news_bookmark'

        this.showLoading()
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

                this.hideLoading()
                if (responseJson.status == true) {


                    this.setState({news:responseJson.lists})

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
    bookmark = (item,index) =>{


        let url = '';




            url = GLOBAL.BASE_URL + 'delete_bookmark_news'



        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id : GLOBAL.user_id,
                news_id: item.news_id,

            }),
        }).then((response) => response.json())
            .then((responseJson) => {

                if (responseJson.status == true) {
                    let { news } = this.state;
                    let targetPost = news[index];

                    // Flip the 'liked' property of the targetPost


                    var array = [...this.state.news]; // make a separate copy of the array

                    if (index !== -1) {
                        array.splice(index, 1);
                        this.setState({news: array});
                    }




                }else {
                    alert('No News Found')
                }
            })
            .catch((error) => {
                console.error(error);
            });

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




        return (
            <View>
                <TouchableOpacity
                    onPress={() => this.newsPress(item.item.news_id)}>

                        <View style = {{margin :10 ,backgroundColor:'white',padding:0,alignSelf: 'center',shadowColor: 'black',width:window.width - 20,
                            }}>


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
                                    onPress={() => this.bookmark(item.item,item.index)}>
                                    <View style = {{marginRight: 10,flexDirection:'row'}}>
                                        <Image style = {{width :20 ,height : 20 ,resizeMode:'contain'}}
                                               source={require('./chats.png')}/>
                                        <Text style = {{marginLeft:7,color:'#cdcdcd',marginTop:3}}>
                                            { item.item.total_comments}
                                        </Text>
                                        <Image style = {{marginLeft:5,width :20 ,height : 20 ,resizeMode:'contain'}}
                                               source={require('./favourite.png')}/>
                                    </View>
                                </TouchableOpacity>

                            </View>


                            <View style = {{marginLeft:5,width:window.width-20,height:1,backgroundColor:'grey',marginTop:5}}>
                            </View>
                        </View>

                </TouchableOpacity>






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

    componentDidMount(){
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


        return (
            <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
                <View >
                    <View style = {{flexDirection:'row',width:window.width,marginTop:30}}>

                        <TouchableOpacity style = {{width :30 ,height : 30 }}
                                          onPress={() => this.props.navigation.goBack()}>
                            <Image style = {{width :20 ,height : 20 ,marginLeft: 20,resizeMode: 'contain'}}
                                   source={require('./arrow.png')}/>
                        </TouchableOpacity>



                        <Text style = {{marginLeft:22,fontSize: 20,color:'#c53b41',fontWeight: 'bold', width:130,marginTop:-2}}>
                            Bookmarks
                        </Text>



                    </View>


                    <KeyboardAwareScrollView>

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
