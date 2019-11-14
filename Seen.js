import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Platform,
    TextInput,
    View,
    Image,
    Alert,
    NetInfo,
    SafeAreaView,
    AsyncStorage,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
    FlatList
} from 'react-native';

const window = Dimensions.get('window');
import Button from 'react-native-button';
const GLOBAL = require('./Global');
var arrayholder = [];
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
type Props = {};
export default class Seen extends Component {
    state = {
        text: '',
        passwordtext :'',
        isSecure : true,
        username: '',
        password: '',
        text:'',
        news :[],
        status :true,
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
//        alert(JSON.stringify(GLOBAL.whohasseen))


        const url = GLOBAL.BASE_URL +  'user_detail_list'


        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_ids : GLOBAL.whohasseen,

            }),
        }).then((response) => response.json())
            .then((responseJson) => {

                //  alert(JSON.stringify(responseJson))
                this.arrayholder =  responseJson.list_user

                this.setState({news:responseJson.list_user})
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

    componentDidMount() {
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
//        this.props.navigation.navigate('SingleChat')


    }
    _renderItemCategs = (item,index)=>{


        return (

            <View style = {{backgroundColor:'white',width:window.width,
                flexDirection:'row', borderBottomWidth:2, borderBottomColor:'#e1e1e1'}}>

                <Image style = {{width :50 ,height : 50 ,padding:4,borderRadius:25,margin:10 }}
                       source={{uri: item.item.image}}/>

                <View style = {{flexDirection:'column',width:window.width/2,margin:10,marginTop:25}}>
                    <Text style = {{fontSize:18}}>
                        {item.item.name}
                    </Text>



                </View>
            </View>

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
            <SafeAreaView>
            <View style={styles.container}>



                <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>

                    <View style = {{flexDirection:'row',width:window.width,height:50,backgroundColor:'#efefef'}}>

                        <View style = {{flexDirection:'row',marginTop:12, width:window.width}}>
                            <TouchableOpacity style = {{width :30 ,height : 30 }}
                                              onPress={() => this.props.navigation.goBack()}>
                                <Image style = {{width :20 ,height : 20 ,marginLeft: 20,resizeMode: 'contain', marginTop:4}}
                                       source={require('./arrow.png')}/>
                            </TouchableOpacity>



                            <Text style = {{marginLeft:22,fontSize: 20,color:'#c13e44',fontWeight: 'bold', width:'80%'}}>
                                Seen By
                            </Text>


                        </View>



                    </View>


                    <FlatList style= {{marginTop:10, marginBottom: 10,backgroundColor:'transparent'}}
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