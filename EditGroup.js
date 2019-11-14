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
import ImagePicker from 'react-native-image-picker';
const options = {
    title: 'Select Group Icon',
    maxWidth : 500,
    maxHeight : 500,
    storageOptions: {
        skipBackup: true,
        loading :false,
        text:'',
        path: 'images',
    },
    allowsEditing:true
};
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
type Props = {};
export default class EditGroup extends Component {
    state = {
        text: '',
        passwordtext :'',
        isSecure : true,
        username: '',
        password: '',
        status :'',
        ipAdd : '',
        name:'',
        description:'',imageget:0,

        newsHeading :[],
        loading:'',
        states:'',
        results: [],
        avatarSource:'',isChangeImage:0

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

                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };
//                alert(source.uri)
                GLOBAL.groupImage = response.uri
                this.setState({
                    avatarSource: source,
                    imageget:2
                });
                this.setState({isChangeImage: 1})
            }
        });

    }



    _handleStateChange = state => {
        this.setState({newsHeading:GLOBAL.array})

    };
    buttonClickListener = () =>{
// var memberid = "";
// for (let i = 0; i< GLOBAL.array.length ;i++){
//             memberid = memberid + GLOBAL.array[i]["user_id"] + '|'
//         }

        //      var isch = this.state.isChangeImage
//        alert(isch)

        if (this.state.name == ''){
            alert('Please Enter Name')
        } else if (this.state.description == ''){
            alert('Please Enter Description')
        }


        else {
            this.showLoading()
            const url = GLOBAL.BASE_URL +  'update_group'
            const data = new FormData();
            data.append('group_id', this.state.g_id);
            data.append('title', this.state.name);
            data.append('description', this.state.description);
            data.append('flag',this.state.isChangeImage);
            // you can append anyone.
            data.append('image', {
                uri: GLOBAL.groupImage,
                type: 'image/jpeg', // or photo.type
                name: 'image.png'
            });
//            alert(JSON.stringify(data))
            fetch(url, {
                method: 'post',
                body: data,
                headers: {
                    'Content-Type': 'multipart/form-data',
                }

            }).then((response) => response.json())
                .then((responseJson) => {
                    this.hideLoading()
//         alert(JSON.stringify(responseJson))
                    if(responseJson.status==true){
                        const { navigation } = this.props;

                        navigation.goBack();

                        alert('Group updated successfully!')

                    }else{
                        alert('Something went wrong!')
                    }



                });
        }

    }




    componentWillMount() {
//        this.setState({newsHeading:GLOBAL.array})
//        alert(GLOBAL.editGroup.image)
        this.setState({editgroup: GLOBAL.editGroup})
        this.setState({name: GLOBAL.editGroup.g_name})
        this.setState({description: GLOBAL.editGroup.description})
        this.setState({avatarSource: GLOBAL.editGroup.image})
        this.setState({imageget: 1})
        this.setState({g_id: GLOBAL.editGroup.group_id})
        GLOBAL.groupImage = GLOBAL.editGroup.image

        this.props.navigation.addListener('willFocus',this._handleStateChange);

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

//     componentDidMount(){
//         this.props.navigation.addListener('willFocus',this._handleStateChange);
// //        this.setState({newsHeading:GLOBAL.array})
//         this.setState({editgroup: GLOBAL.editGroup})
//     }

    _YesDeleteGroup=()=>{
//alert(this.state.g_id)
        this.showLoading()
        const url = GLOBAL.BASE_URL +  'delete_group'

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                group_id : this.state.g_id,

            }),
        }).then((response) => response.json())
            .then((responseJson) => {
                this.hideLoading()
//        alert(JSON.stringify(responseJson))
                if (responseJson.status == true) {
                    alert('Group deleted successfully!')
                    this.props.navigation.goBack()
                }else {
                    alert('Something went wrong!')
                }
            })
            .catch((error) => {
                console.error(error);
            });


    }

    confirmDeleteGroup=()=>{
        Alert.alert('Delete Group!','This group will be deleted permanently. Are you sure you want to delete this group?',
            [{text:"Cancel"},
                {text:"Confirm", onPress:()=>this._YesDeleteGroup()
                },
            ],
            {cancelable:false}
        )

    }

    render() {
        if(this.state.loading){
            return(
                <View style={styles.container}>



                    <ActivityIndicator style = {styles.loading}
                                       size="small" color='#c13e44' />
                </View>
            )
        }

        var oh = this.state.editgroup
        return (
            <SafeAreaView>
            <View >

                <Image style = {{width :window.width ,height : window.height}}
                       source={require('./background.png')}/>
                <View style={{marginTop:-window.height,width:window.width,height:window.height}}>
                    <KeyboardAwareScrollView keyboardShouldPersistTaps='always'>

                        <View style = {{flexDirection:'row',width:window.width,marginTop:50}}>

                            <TouchableOpacity style = {{width :40 ,height : 40 }}
                                              onPress={() => this.props.navigation.goBack()}>
                                <Image style = {{width :20 ,height : 20 ,marginLeft: 20,resizeMode: 'contain'}}
                                       source={require('./arrow.png')}/>

                            </TouchableOpacity>

                            <Text style = {{marginLeft:30,fontSize: 20,color:'#c13e44',fontWeight: 'bold', width:'90%'}}>
                                Edit Group
                            </Text>

                            <TouchableOpacity style={{width: 30, height: 30, position: 'absolute', right: 20, top:0}}
                                              onPress={()=> this.confirmDeleteGroup()}>
                                <Image style={{width: 27, height: 27, resizeMode: 'contain'}}
                                       source={require('./delete_group.png')}/>
                            </TouchableOpacity>



                        </View>




                        <View style = {{flexDirection:'row',width:window.width,marginTop:40}}>
                            <TouchableOpacity
                                onPress={() => this.changeImage()}>

                                {this.state.imageget == 1 && (

                                    <Image style = {{width :80 ,height : 80 ,marginLeft: 20,borderRadius:40}}
                                           source={{uri: this.state.avatarSource}} />
                                )}

                                {this.state.imageget == 2 && (

                                    <Image style = {{width :80 ,height : 80 ,marginLeft: 20,borderRadius:40}}
                                           source={this.state.avatarSource} />
                                )}

                                {this.state.imageget == 0 && (

                                    <Image style = {{width :80 ,height : 80 ,marginLeft: 20,resizeMode: 'contain'}}
                                           source={require('./group.png')}/>
                                )}

                            </TouchableOpacity>

                            <Text style = {{marginLeft:10,fontSize: 20,color:'grey',marginTop:25}}>
                                Change Group Icon
                            </Text>




                        </View>


                        <TextInput
                            style={{ height: 50, borderColor: 'gray',fontSize:20, borderBottomWidth: 1, marginTop:60 ,marginBottom: 20 ,marginLeft:20,width:window.width -40,color:'black' }}
                            // Adding hint in TextInput using Placeholder option.
                            placeholder="Group Title"
                            placeholderTextColor = 'black'
                            // Making the Under line Transparent.
                            underlineColorAndroid="transparent"
                            value={this.state.name}
                            maxLength={20}
                            onChangeText={(text) => this.setState({name:text})}
                        />

                        <TextInput
                            style={{ height: 50, borderColor: 'gray',fontSize:20, borderBottomWidth: 1, marginTop:0 ,marginBottom: 20 ,marginLeft:20,width:window.width -40,color:'black' }}
                            // Adding hint in TextInput using Placeholder option.
                            placeholder="Group Description"
                            placeholderTextColor = 'black'
                            value={this.state.description}
                            // Making the Under line Transparent.
                            underlineColorAndroid="transparent"
                            onChangeText={(text) => this.setState({description:text})}
                        />



                        <Button
                            style={{ fontSize: 20, color: 'white' }}
                            containerStyle={{ marginTop:20,marginLeft:15,width:window.width-30,padding: 10, height: 45, overflow: 'hidden', borderRadius: 20, backgroundColor: '#c13e44',margin:15}}

                            onPress={this.buttonClickListener}
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