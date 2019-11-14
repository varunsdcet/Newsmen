import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Platform,
    TextInput,
    View,
    Image,
    Alert,
    SafeAreaView,
    AsyncStorage,
    Dimensions,
    TouchableOpacity,
    NetInfo,
    ActivityIndicator,
    FlatList
} from 'react-native';
const window = Dimensions.get('window');
const GLOBAL = require('./Global');
import Button from 'react-native-button';
import ImagePicker from 'react-native-image-picker';
const options = {
    title: 'Select Avatar',
    maxWidth : 500,
    maxHeight : 500,
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
type Props = {};
export default class EditProfile extends Component {
    state = {
        text: '',
        passwordtext :'',
        isSecure : true,
        username: '',
        password: '',
        status :'',
        ipAdd : '',
        name:'',
        description:'',

        newsHeading :[],
        loading:'',
        states:'',
        results: [],
        avatarSource:'',
        image :'',username:''

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

    getNewsUpdate(){
        const url = GLOBAL.BASE_URL +  'get_profile'


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

                if (responseJson.status == true) {

                    this.setState({name :responseJson.user_detail.name})
                    this.setState({description :responseJson.user_detail.email})
                    this.setState({image :responseJson.user_detail.image})
                    this.setState({username: responseJson.user_detail.username})
                    GLOBAL.profileImage = responseJson.user_detail.image
                }else {
                    alert('No News Found')
                }
            })
            .catch((error) => {
                console.error(error);
            });

    }
    changeImage=()=>{
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };

                GLOBAL.profileImage = response.uri
                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    avatarSource: source,
                });
            }
        });

    }



    _handleStateChange = state => {
        this.setState({newsHeading:GLOBAL.array})

    };
    buttonClickListener = () =>{



        if (this.state.name == ''){
            alert('Please Enter Name')
        } else if (this.state.description == ''){
            alert('Please Enter Email')
        }


        else {
            //   this.showLoading()
            const url = GLOBAL.BASE_URL +  'update_profile'
            const data = new FormData();
            data.append('user_id', GLOBAL.user_id);
            data.append('name', this.state.name);
            data.append('email', this.state.description);
            data.append('gender', '');
            data.append('dob', '');
            data.append('flag',1);
            data.append('username', this.state.username)

            // you can append anyone.
            data.append('image', {
                uri: GLOBAL.profileImage,
                type: 'image/jpeg', // or photo.type
                name: 'image.png'
            });
            fetch(url, {
                method: 'post',
                body: data,
                headers: {
                    'Content-Type': 'multipart/form-data',
                }

            }).then((response) => response.json())
                .then((responseJson) => {
                    //       this.hideLoading()
//                    alert(JSON.stringify(responseJson))
                    const { navigation } = this.props;
                    navigation.goBack();

                    alert('Profile Updated Successfully!')



                });
        }

    }
    delete = (index) => {
        alert(index)
        let { newsHeading } = this.state;
        let targetPost = newsHeading[index];

        // Flip the 'liked' property of the targetPost


        var array = [...this.state.newsHeading]; // make a separate copy of the array

        if (index !== -1) {
            array.splice(index, 1);
            this.setState({newsHeading: array});
            GLOBAL.array = array
        }

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
        console.log(`is connected: ${this.state.status}`);
    }



    hideLoading() {
        this.setState({loading: false})
    }

    componentDidMount(){
        this.props.navigation.addListener('willFocus',this._handleStateChange);
        this.setState({newsHeading:GLOBAL.array})
    }


    render() {


        return (
            <SafeAreaView>
            <View >

                <Image style = {{width :window.width ,height : window.height}}
                       source={require('./background.png')}/>
                <View style={{marginTop:-window.height,width:window.width,height:window.height}}>
                    <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>

                        <View style = {{flexDirection:'row',width:window.width,marginTop:50}}>

                            <TouchableOpacity style = {{width :40 ,height : 40, zIndex:1 }}
                                              onPress={() => this.props.navigation.goBack()}>
                                <Image style = {{width :20 ,height : 20 ,marginLeft: 10,resizeMode: 'contain',marginTop:4}}
                                       source={require('./arrow.png')}/>

                            </TouchableOpacity>

                            <Text style = {{marginLeft:12,fontSize: 20,color:'#c13e44',fontWeight: 'bold', width:'70%',marginTop:1}}>
                                Edit Profile
                            </Text>






                        </View>




                        <View style = {{flexDirection:'row',width:window.width,marginTop:40}}>
                            <TouchableOpacity
                                onPress={() => this.changeImage()}>

                                {this.state.avatarSource != '' && (

                                    <Image style = {{width :80 ,height : 80 ,marginLeft: 20,borderRadius:40}}
                                           source={this.state.avatarSource} />
                                )}
                                {this.state.avatarSource == '' && (

                                    <Image style = {{width :80 ,height : 80 ,marginLeft: 20,borderRadius:40}}
                                           source={{uri:this.state.image}}/>
                                )}

                            </TouchableOpacity>

                            <Text style = {{marginLeft:10,fontSize: 20,color:'grey',marginTop:25}}>
                                Add Profile Pic
                            </Text>




                        </View>


                        <TextInput
                            style={{ height: 50, borderColor: 'gray',fontSize:20, borderBottomWidth: 1, marginTop:60 ,marginBottom: 20 ,marginLeft:20,width:window.width -40,color:'black' }}
                            // Adding hint in TextInput using Placeholder option.
                            placeholder="Enter Name"
                            placeholderTextColor = 'grey'
                            maxLength={35}
                            // Making the Under line Transparent.
                            underlineColorAndroid="transparent"
                            value = {this.state.name}
                            onChangeText={(text) => this.setState({name:text})}
                        />


                        <TextInput
                            style={{ height: 50, borderColor: 'gray',fontSize:20, borderBottomWidth: 1, marginTop:0 ,marginBottom: 20 ,marginLeft:20,width:window.width -40,color:'black' }}
                            // Adding hint in TextInput using Placeholder option.
                            placeholder="Username"
                            placeholderTextColor = 'grey'
                            maxLength={35}
                            // Making the Under line Transparent.
                            underlineColorAndroid="transparent"
                            value = {this.state.username}
                            onChangeText={(text) => this.setState({username:text})}
                        />

                        <TextInput
                            style={{ height: 50, borderColor: 'gray',fontSize:20, borderBottomWidth: 1, marginTop:0 ,marginBottom: 20 ,marginLeft:20,width:window.width -40,color:'black' }}
                            // Adding hint in TextInput using Placeholder option.
                            placeholder="Enter Email"
                            placeholderTextColor = 'grey'
                            // Making the Under line Transparent.
                            underlineColorAndroid="transparent"
                            onChangeText={(text) => this.setState({description:text.replace(/\s+/g,'')})}
                            value = {this.state.description}
                        />










                        <Button
                            style={{ fontSize: 20, color: 'white' }}
                            containerStyle={{ marginTop:20,marginLeft:15,width:window.width-30,padding: 10, height: 45, overflow: 'hidden', borderRadius: 20, backgroundColor: '#c13e44',margin:15}}

                            onPress={() => this.buttonClickListener()}
                        >
                            SUBMIT
                        </Button>





                    </KeyboardAwareScrollView>

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