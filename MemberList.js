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
    SafeAreaView,
    TouchableOpacity,
    NetInfo,
    ActivityIndicator,
    FlatList
} from 'react-native';
const window = Dimensions.get('window');
const GLOBAL = require('./Global');
import Button from 'react-native-button';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
type Props = {};
export default class MemberList extends Component {
    state = {
        text: '',
        passwordtext :'',
        isSecure : true,
        username: '',
        password: '',
        status :'',
        ipAdd : '',
        newsHeading :['Video','HighFlyer','Movie',"Politics","Election"],
        loading:'',
        states:'',
        results: [],
        isLeader :0,

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
        this.props.navigation.addListener('willFocus',this._handleStateChange);

        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);

        NetInfo.isConnected.fetch().done(
            (isConnected) => { this.setState({ status: isConnected });

            }
        );
    }

    _handleStateChange = state => {

        this.getNewsUpdate()
    };
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


    _handleCategorySelects = (item,index) => {
        //GLOBAL.another = item.user_id
        //  this.props.navigation.navigate('SingleChat')


    }

    _handleCategorySelect = (item,index) => {

        //  alert(JSON.stringify(item))
        if (this.state.isLeader == 1) {
            if (item.user_id == GLOBAL.user_id) {
                alert('You have not Permisson ')
            }else {
                if (this.state.isLeader == 1) {
                    const url = GLOBAL.BASE_URL + 'remove_member'


                    fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            join_id: item.join_id,



                        }),
                    }).then((response) => response.json())
                        .then((responseJson) => {


                            //        alert(JSON.stringify(responseJson))
                            if (responseJson.status == true) {
                                this.getNewsUpdate()
                                alert('Member removed successfully.')
                            } else {
                                alert('No Data Found')
                            }


                        })
                        .catch((error) => {
                            console.error(error);
                        });
                }else {

                }
            }
        }else {
            if (item.user_id == GLOBAL.user_id) {
                const url = GLOBAL.BASE_URL + 'remove_member'


                fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        join_id: item.join_id,



                    }),
                }).then((response) => response.json())
                    .then((responseJson) => {



                        if (responseJson.status == true) {
                            this.getNewsUpdate()
                        } else {
                            alert('No Data Found')
                        }


                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        }






    }
    getNewsUpdate(){
        const url = GLOBAL.BASE_URL +  'group_member_list'


        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                group_id : GLOBAL.groupId,
                user_id :GLOBAL.user_id


            }),
        }).then((response) => response.json())
            .then((responseJson) => {


                if (responseJson.status == true){



                    this.setState({results:responseJson.member_list})
                    this.setState({isLeader:responseJson.is_leader_a})
                }else{
                    alert('No Data Found')
                }


            })
            .catch((error) => {
                console.error(error);
            });

    }

    _renderItemCategs = (item,index)=>{


        return (
            <TouchableOpacity
                onPress={() => this._handleCategorySelects(item.item,index)}>

                {item.item.is_leader == 1 && (
                    <View style = {{margin :10 ,backgroundColor:'transparent',width:window.width,
                        justifyContent:'space-around',flexDirection:'row'}}>

                        <Image style = {{width :50 ,height : 50 ,padding:4,borderRadius:25,marginRight:10,marginLeft:5,marginBottom:10 }}
                               source={{uri :item.item.user_image}}/>

                        <View style = {{flexDirection:'column',width:window.width/2,margin:10,marginTop:4}}>
                            <Text style = {{fontSize:18,fontWeight:'bold'}}>{item.item.user_name}</Text>

                        </View>

                        {item.item.is_leader == 1 && (
                            <View style = {{backgroundColor:'#6e56ff',width :70 ,height : 30,marginRight:40 ,borderRadius:8,marginTop:10}}>
                                <Text style = {{color:'white',alignSelf:'center',marginTop:5}}>
                                    Admin
                                </Text>
                            </View>
                        )}
                        {item.item.is_leader  != 1 &&  this.state.isLeader == 1 &&(

                            <TouchableOpacity
                                onPress={() => this._handleCategorySelect(item.item,index)}>
                                <View style = {{backgroundColor:'#c13e44',width :70 ,height : 30,marginRight:20 ,borderRadius:8,marginTop:10}}>
                                    <Text style = {{color:'white',alignSelf:'center',marginTop:5}}>
                                        Remove
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}


                    </View>

                )}

                {item.item.is_leader == 0 && (
                    <View style = {{margin :10 ,backgroundColor:'transparent',width:window.width
                        ,flexDirection:'row'}}>




                        <Image style = {{width :50 ,height : 50 ,padding:4,borderRadius:25,marginLeft:10,marginRight:10,marginBottom:10 }}
                               source={{uri :item.item.user_image}}/>

                        <View style = {{flexDirection:'column',width:window.width/2,margin:10,marginTop:4}}>
                            <Text style = {{fontSize:18,fontWeight:'bold'}}>
                                {item.item.user_name}
                            </Text>




                        </View>

                        {item.item.is_leader == 1 && (
                            <View style = {{backgroundColor:'#6e56ff',width :70 ,height : 30,marginRight:20 ,borderRadius:8,marginTop:10}}>
                                <Text style = {{color:'white',alignSelf:'center',marginTop:5}}>
                                    Admin
                                </Text>
                            </View>
                        )}
                        {item.item.is_leader  != 1 &&  this.state.isLeader == 1 &&(

                            <TouchableOpacity
                                onPress={() => this._handleCategorySelect(item.item,index)}>
                                <View style = {{backgroundColor:'#c13e44',width :70 ,height : 30,marginRight:20 ,borderRadius:8,marginTop:10}}>
                                    <Text style = {{color:'white',alignSelf:'center',marginTop:5}}>
                                        Remove
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>

                )}
                <View style={{height:1, backgroundColor:'grey', width:window.width,marginTop:-15}}>
                </View>

            </TouchableOpacity>


        )
    }
    render() {


        return (
            <SafeAreaView>
            <View >

                <Image style = {{width :window.width ,height : window.height}}
                       source={require('./background.png')}/>
                <View style={{marginTop:-window.height,width:window.width,height:window.height}}>


                    <View style = {{flexDirection:'row',width:window.width,marginTop:50,justifyContent:'space-between'}}>

                        <View>
                            <TouchableOpacity style = {{width :40 ,height : 40 }}
                                              onPress={() => this.props.navigation.goBack()}>
                                <Image style = {{width :20 ,height : 20 ,marginLeft: 20,resizeMode: 'contain'}}
                                       source={require('./arrow.png')}/>
                            </TouchableOpacity>
                        </View>


                        <View>
                            <Text style = {{marginLeft:40,fontSize: 20,color:'#c13e44',fontWeight: 'bold',alignSelf:'center'}}>
                                Member List
                            </Text>
                        </View>

                        <View>
                            <Text style = {{color:'#cdcdcd',fontSize:15,alignSelf: 'flex-end' ,marginRight:10,fontWeight:'bold'}}>
                                {this.state.results.length} + Member
                            </Text>
                        </View>



                    </View>

                    <View style = {{marginTop:12,backgroundColor:'#cdcdcd',borderRadius:20 ,height:40,width:window.width -40 ,marginLeft:20}}>

                        <TextInput
                            style={{ height: 40, borderColor: 'gray',fontSize:14, borderBottomWidth: 0, marginTop:0 ,marginBottom: 20 ,marginLeft:20,width:window.width -40,color:'black' }}
                            // Adding hint in TextInput using Placeholder option.
                            placeholder="Search Member"

                            // Making the Under line Transparent.
                            underlineColorAndroid="transparent"
                        />
                    </View>

                    {this.state.isLeader == 1 && (
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('GroupAddMember')}>
                            <View style = {{flexDirection:'row',marginLeft:10,marginTop:8}}>

                                <Image style = {{width :40 ,height : 40 ,marginLeft: 10,resizeMode: 'contain'}}
                                       source={require('./create.png')}/>
                                <Text style = {{color:'#cdcdcd',fontSize:17 ,marginLeft:20,fontWeight:'bold',marginTop:10, width:150}}>
                                    Add Members
                                </Text>



                            </View>
                        </TouchableOpacity>
                    )}



                    <FlatList style= {{marginTop:5, marginBottom: 10,backgroundColor:'transparent'}}
                              data={this.state.results}


                              showsHorizontalScrollIndicator={false}
                              keyExtractor = { (item, index) => index.toString() }
                              extraData={this.state}
                              renderItem={this._renderItemCategs}
                    />







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
    }
})