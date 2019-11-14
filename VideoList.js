import * as React from 'react';
import {Text, View, StyleSheet, FlatList, Alert, ActivityIndicator,SafeAreaView} from 'react-native';
import InViewPort from './InViewport';
import Video from 'react-native-video';
var  catid = 1
export default class VideoList extends React.Component {
    constructor(props){
        super(props);
        this.onItemsChanges = this.onItemsChanges.bind(this)
        this.viewabilityConfig = {
            minimumViewTime: 500,
            viewAreaCoveragePercentThreshold: 60,
        };
    }
    state = {
        data: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
        movieList:[],
        loading :false,

            pauseVideo: true

    }

    playThisVieo = (playVideo) => {
        this.setState({
            pauseVideo: !playVideo
        });
    };
    onItemsChanges ({ props }) {
       // const changed = props.change;

        // viewableItems.forEach(item => {
        //     if (item.isViewable) {
        //         Alert.alert(viewableItems,'hi')
        //     }
        // });

        // viewableItems.forEach(item => {
        //     if (item.isViewable) {
        //        Alert.alert(viewableItems,'hi')
        //     }
        // });

    }
    keyExtractor = (item, index) => `${index}`;

    _onViewableItemsChanged = (viewableItems) => {


        // const changed = props.changed;
        // const viewableItems = props.viewableItems;
        // alert(changed)
        // alert(viewableItems)
        // console.log(changed);
        // console.log(viewableItems);
        // changed.forEach(item => {
        //     if (!item.isViewable) {
        //        // this.feedCardRef[`REF-FLATLIST${item.key}`].playThisVideo(item.isViewable);
        //     }
        // });
        // viewableItems.forEach(item => {
        //     if (item.isViewable) {
        //      //   this.feedCardRef[`REF-FLATLIST${item.key}`].playThisVideo(item.isViewable);
        //     }
        // });
    };

    checkVisible = (isVisible,item,index) => {

        if (isVisible == true) {
            let {movieList} = this.state;

for (let i = 0; i < movieList.length; i++) {

    movieList[i].is_paused = true;

}


 let targetPost = movieList[index];
            targetPost.is_paused = false;


            movieList[index] = targetPost;
             this.setState({movieList: movieList})
        }
    }

    componentWillMount(){
        this.getMoviesFromApiAsync()
    }

    showLoading() {
        this.setState({loading: true})
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
    renderFeeds = (item,index) => {

        return (

            <InViewPort onChange={(isVisible) => this.checkVisible(isVisible,item,index)}>
            <View style = {{width:375,height:300,backgroundColor:'red'}}>

                <Video
                    source={{uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4'}}
                    ref={(ref) => {
                        this._player = ref
                    }}
                    rate={1.0}
                    paused={item.is_paused}
                    volume={1.0}
                    isMuted={false}
                    resizeMode="cover"
                    shouldPlay
                    style={styles.video}/>

            </View>
            </InViewPort>

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
            <SafeAreaView>
            <View style={styles.videoContainer}>






                <FlatList
                    horizontal={false}
                    data={this.state.movieList}
                    renderItem={({item,index}) => this.renderFeeds(item,index)}
                    viewabilityConfig={this.viewabilityConfig}
                    keyExtractor={this.keyExtractor}
                    onViewableItemsChanged={this.onItemsChanges}
                    extraData={this.state}
                    getItemLayout={(item, index) => (
                        {length: 400, offset: 400 * index, index}
                    )}
                />


            </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,




    },
    videoContainer: {

        backgroundColor: 'black',
    },
    loading: {
        position: 'absolute',
        left: window.width/2 - 30,

        top: window.height/2,

        opacity: 0.5,

        justifyContent: 'center',
        alignItems: 'center'
    },
    video: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
});
