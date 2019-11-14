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
    FlatList, SafeAreaView
} from 'react-native';
const window = Dimensions.get('window');
import Button from 'react-native-button';
const GLOBAL = require('./Global');
var arrayholder = [];
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
type Props = {};
export default class AddMember extends Component {
    state = {
        text: '',
        passwordtext :'',
        isSecure : true,
        username: '',
        password: '',
        text:'',
        news :[],
        status :'',
        ipAdd : '',
        newsHeading :['Video','HighFlyer','Movie',"Politics","Election"],
        loading:'',
        states:'',
        results: [],isadded:0

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



    getNewsUpdate(){
        const url = GLOBAL.BASE_URL +  'list_user'


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


                  this.arrayholder =  responseJson.user_list

                    this.setState({news:responseJson.user_list})
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
    showLoading() {
        this.setState({loading: true})
    }




    _renderItemCateg = (item,index)=>{


        return (

            <View>


                <View style = {{marginLeft :10 ,marginRight:10,marginTop:2, marginBottom:20,width:100,
                    backgroundColor:'white',padding:5}}>
                    <Image style = {{width :80 ,height : 80 ,padding:12,margin:5 ,borderRadius:40 }}
                           source={require('./splash.png')}/>
                    <Text style = {{fontSize: 16,marginBottom:2,fontWeight:'bold',alignSelf:'center'}}>
                        {item.item}
                    </Text>

                </View>



            </View>

        )
    }

    componentWillMount() {
        this.getNewsUpdate()
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
        this.getNewsUpdate()
        console.log(`is connected: ${this.state.status}`);
    }



    hideLoading() {
        this.setState({loading: false})
    }

    componentDidMount(){
    }


    _handleCategorySelect=(item,index)=>{


     //   this.props.navigation.goBack()

        let { news } = this.state;
        let targetPost = this.state.news[index];
//        alert(JSON.stringify(targetPost))
        if (item.selected == ""){
            GLOBAL.array =   [...GLOBAL.array,  item]
            targetPost.selected = "1"
        }else{
            targetPost.selected = ""
            GLOBAL.array.splice(index, 1);
        }



        this.state.news[index] = targetPost;
//        alert(JSON.stringify(targetPost))
        this.setState({ news: this.state.news})
    }

    _handleCategorySelects = (item,index) => {
        GLOBAL.another = item.user_id
      //  this.props.navigation.navigate('SingleChat')


    }
    _renderItemCategs = (item,index)=>{


        return (
            <TouchableOpacity
                onPress={() => this._handleCategorySelects(item.item,index)}>


                <View style = {{margin :10 ,backgroundColor:'white',width:window.width,
                    justifyContent:'space-around',flexDirection:'row'}}>




                    <Image style = {{width :50 ,height : 50 ,padding:4,borderRadius:25,margin:10 }}
                           source={{uri: item.item.image}}/>

                    <View style = {{flexDirection:'column',width:window.width/2,margin:10,marginTop:25}}>
                        <Text style = {{fontSize:18}}>
                            {item.item.user_name}
                        </Text>



                    </View>

                    {item.item.selected == "" && (
                        <TouchableOpacity
                            onPress={() => this._handleCategorySelect(item.item,item.index)}>

                    <Image style = {{width :70 ,height : 70,resizeMode:'contain',marginRight:20,marginTop:8}}
                           source={require('./addmember.png')}/>
                        </TouchableOpacity>

                    )}
                    {item.item.selected == "1" && (
                        <TouchableOpacity
                            onPress={() => this._handleCategorySelect(item.item,item.index)}>
                        <Image style = {{width :70 ,height : 70,resizeMode:'contain',marginRight:20,marginTop:8}}
                               source={require('./right.png')}/>
                                </TouchableOpacity>

                    )}


                </View>

                <View style={{height:1, backgroundColor:'#efefef', width:window.width,marginTop:-15}}>
                </View>


            </TouchableOpacity>


        )
    }
    SearchFilterFunction(text){
        const newData = this.arrayholder.filter(function(item){
            const itemData = item.user_name.toUpperCase()
            const textData = text.toUpperCase()
            return itemData.indexOf(textData) > -1
        })
        this.setState({
            news: newData,
            text: text,
            nodata:'No found'
        })

    }
    render() {


        return (


            <View style={styles.container}>
                <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>


                    <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>

                        <View style = {{flexDirection:'row',width:window.width,height:50,backgroundColor:'#efefef'}}>

                            <View style = {{flexDirection:'row',marginTop:12, width:window.width}}>
                            <TouchableOpacity style = {{width :30 ,height : 30 }}
                                              onPress={() => this.props.navigation.goBack()}>
                            <Image style = {{width :20 ,height : 20 ,marginLeft: 20,resizeMode: 'contain',marginTop:4}}
                                   source={require('./arrow.png')}/>
                            </TouchableOpacity>



                            <Text style = {{marginLeft:22,fontSize: 20,color:'#c53b41',fontWeight: 'bold', width:'80%',marginTop:1}}>
                                Add Members
                            </Text>


</View>



                        </View>

                        <View style = {{marginTop:12,backgroundColor:'#cdcdcd',borderRadius:20 ,height:40,width:window.width -40 ,marginLeft:20}}>

                            <TextInput
                                style={{ height: 40, borderColor: 'gray',fontSize:14, borderBottomWidth: 0, marginTop:0 ,marginBottom: 20 ,marginLeft:20,width:window.width -40,color:'black' }}
                                // Adding hint in TextInput using Placeholder option.
                                placeholder="Search Member"
                                onChangeText={(text) => this.SearchFilterFunction(text)}
                                value={this.state.text}
                                // Making the Under line Transparent.
                                underlineColorAndroid="transparent"
                            />
                        </View>



                        <FlatList style= {{marginTop:10, marginBottom: 10,backgroundColor:'transparent'}}
                                  data={this.state.news}


                                  showsHorizontalScrollIndicator={false}
                                  keyExtractor = { (item, index) => index.toString() }
                                  extraData={this.state}
                                  renderItem={this._renderItemCategs}
                        />





                    </KeyboardAwareScrollView>

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
    }
})
