import React, { useEffect, useState, useRef } from 'react';
import {
    StyleSheet, Text, View, StatusBar, SafeAreaView, BackHandler, Alert , Button, Dimensions, TextInput, DataProvider, ToastAndroid, DrawerLayoutAndroid ,TouchableWithoutFeedback, Image, FlatList, Platform, ActivityIndicator, ScrollView, SectionList, Linking
} from 'react-native';
import { useDimensions} from '@react-native-community/hooks';
import { render } from 'react-dom';
import { WebView } from 'react-native-webview';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {
    faHistory, faHome, faSearch, faBookmark, faEllipsisV, faLanguage, faFastForward, faBars, faMoon, faSmileWink, faExclamation, faCheckSquare, faCheckCircle, faCode
} from './node_modules/@fortawesome/free-solid-svg-icons/index';
import { faDeviantart, faDiscord, faGithub } from './node_modules/@fortawesome/free-brands-svg-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Video } from 'expo-av';
import Dub from './Views/Dub'
import Recent from './Views/Recent'
import { Switch } from 'react-native-gesture-handler';
import Search from './Views/Search'
import Anime from './Views/Anime'
import BookMarks from './Views/BookMarks'
import * as ScreenOrientation from 'expo-screen-orientation';


function CustomNavbar() {
    return (
        <View style={{ flexDirection: 'row', borderColor: 'black', borderWidth: 1}}>
            <TextInput style={{ fontSize: 20, borderColor:'white',borderWidth:1 }} placeholder={"Search for Anime"} />
        </View>
        )
}

// Click Anime Functio
// Sub
function Home({ navigation }) {
    const RecentItems = [{ "Name": [] }]
    function addToRecent() {
        console.log("add To recent");
        var LoadRI = async () => {
            try {
                const value = await AsyncStorage.getItem('Recent');
                if (value === null) {
                    saveRI();
                }
                else {
                    const Parsed = JSON.parse(value);
                    console.log("Before");
                    console.log(RecentItems);
                    for (var i = 0; i < Parsed[0].Name.length; i++) {
                        console.log(i);
                        if (RecentItems[0].Name[0].Link === Parsed[0].Name[i].Link) {
                            console.log('same dont copy')
                        }
                        else {
                            RecentItems[0].Name.push(Parsed[0].Name[i]);
                        }
                    }
                    console.log("LoadRi");
                    console.log(RecentItems);
                    saveRI();
                }
            } catch (error) {
                alert(error);
            }
        }
        var saveRI = async () => {
            try {
                await AsyncStorage.setItem('Recent', JSON.stringify(RecentItems));
            } catch (error) {
                alert(error);
            }
        }
        LoadRI();
    }
    // Loading More pages Slows down app so getting rid of it 
    
    const [isLoading, setLoading] = useState(true);
    /*
    const [page, setPage] = useState(1);
    function loadMorePages() {
        fetch("https://gogoanime.vc/?page=" + page)
            .then(function (resp) {
                return resp.text();
            })
            .then(function (data) {
                var n = data.split(`<ul class="items">`);
                var m = n[1].split(`</ul>`);
                var o = m[0].split(`<li>`);
                for (var i = 1; i < o.length; i++) {
                    var p = o[i].split(`</li>`)
                    // Anime name
                    var name = p[0].split(`title="`);
                    var name1 = name[1].split(`">`)
                    // Image link
                    var image = p[0].split(`src="`)
                    var image1 = image[1].split(`"`)
                    // Episode Link so we can view
                    var link = p[0].split(`href="`)
                    var link1 = link[1].split(`"`)
                    // Episode Number
                    var episode = p[0].split(`<p class="episode">`)
                    var episode1 = episode[1].split(`</p>`);
                    // Adding Items to Json Array
                    Itemdata.push({ "id": i, "Name": name1[0], "Image": image1[0], "Link": link1[0], "Episode": episode1[0] });
                }
            })
            .catch((error) => console.error(error))
            .finally(() => setLoadingMore(false));
                }
    useEffect(() => {
        console.log("page");
        console.log(page);
        if (page !== null) {
            loadMorePages();
        }
    }, [page])
    const [loadingMore, setLoadingMore] = useState(false);
    */
    //
    var [Itemdata, setData] = useState([]);
    const [AnimeLink, SetLink] = useState(null);
    const save = async () => {
            try {
                await AsyncStorage.setItem("Anime", AnimeLink);
                navigation.push('Watch')
            } catch (error) {
                alert(error);
            }
    }
    //Dark Mode
    const [darkModeIsEnabled, setIsEnabled] = useState(null);
    useEffect(() => {
        console.log(darkModeIsEnabled)
        if (darkModeIsEnabled === null) {
            loadDarkMode();
        }
    }, [darkModeIsEnabled])
    const saveDarkMode = async () => {
        console.log("save")
        console.log(darkModeIsEnabled)
        console.log("save")
        if (darkModeIsEnabled === true) {
            try {
                await AsyncStorage.setItem("DarkMode", JSON.stringify(false));
            }
            catch (error) {
                alert(error)
            }
        }
        else {
            try {
                await AsyncStorage.setItem("DarkMode", JSON.stringify(true));
            }
            catch (error) {
                alert(error)
            }
        }
    }
    const loadDarkMode = async () => {
        try {
            const value = await AsyncStorage.getItem("DarkMode")
            console.log("value")
            console.log(JSON.parse(value))
            if (value !== null) {
                setIsEnabled(JSON.parse(value))
            }
            else {
                setIsEnabled(false);
            }
        } catch (error) {
            alert(error)
        }
    }
    // Clear Storage
    const clearAsyncStorage = async () => {
        AsyncStorage.clear();
        Alert.alert(
            "Finished Deleting History",
            ""
        )
    }
    // Drawer
    const [drawerOpened, setDrawerOpened] = useState(false);
    var drawerWidth = Dimensions.get('window').width/2
    function pressedDrawer() {
        if (drawerOpened === false) {
            drawer.current.openDrawer()
            setDrawerOpened(true);
        }
        else {
            drawer.current.closeDrawer()
            setDrawerOpened(false);
        }
    }
    const navigationView = () => (
        <View style={[drawerStyle.container, drawerStyle.navigationContainer]}>
            <View style={{ flex: 0.1, width:"100%" , backgroundColor: 'red', alignItems:'center', justifyContent:'center', marginBottom:5}}>
                <Text style={{color:'white', fontSize:20}}>More Options</Text>
            </View>
            <TouchableWithoutFeedback onPress={() => Linking.openURL('https://github.com/Lavish883/Loki-Stream')}>
            <View style={{ flex: 0.1, width: "100%", backgroundColor: 'black', flexDirection: 'row', borderColor:'white', borderBottomWidth:1 }}>
                <View style={{ flex: 0.3, width: '50%',justifyContent:'center'}}>
                    <FontAwesomeIcon style={{alignSelf:"center"}} size={30} icon={faGithub} color={"white"}/>
                </View>
                <View style={{ flex: 0.5, width: '50%', flexGrow: 1, justifyContent:'center'}}>
                    <Text style={{ fontSize: 14.5, color: 'white', alignSelf: 'center' }}>Visit us on Github</Text>
                </View>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => Linking.openURL('https://discord.gg/UkgY94VW7G')}>
            <View style={{ flex: 0.1, width: "100%", backgroundColor: 'black', flexDirection: 'row', borderColor: 'white', borderBottomWidth: 1}}>
                <View style={{ flex: 0.3, width: '50%',justifyContent:'center'}}>
                    <FontAwesomeIcon style={{alignSelf:"center"}} size={30} icon={faDiscord} color={"white"}/>
                </View>
                <View style={{ flex: 0.5, width: '50%', flexGrow: 1, justifyContent:'center'}}>
                    <Text style={{ fontSize: 14.5, color: 'white', alignSelf: 'center' }}>Visit us on Discord</Text>
                </View>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => { setIsEnabled(previousState => !previousState) }}>
            <View style={{ flex: 0.1, width: "100%", backgroundColor: 'black', flexDirection: 'row', borderBottomWidth:1, borderColor:'white' }}>
                <View style={{ flex: 0.5, width: '50%', justifyContent: 'center'}}>
                    <FontAwesomeIcon style={{ alignSelf: "center" }} size={30} icon={faMoon} color={"white"} />
                </View>
                <View style={{ flex: 0.4, width: '50%', flexGrow: 1, justifyContent: 'center'}}>
                    <Text style={{ fontSize: 14.5, color: 'white', alignSelf: 'center' }}>Dark Mode</Text>
                </View>
                <View style={{ flex: 0.1, width: '50%',flexGrow:0.6 ,justifyContent: 'center'}}>
                    <Switch
                        style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }], alignSelf: 'flex-end' }}
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={darkModeIsEnabled ? 'white' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        value={darkModeIsEnabled ? false : true}
                        onValueChange={() => { setIsEnabled(previousState => !previousState), saveDarkMode();}}
                    />
                </View>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => Alert.alert(
                "Are you Sure you want to Delete History ?",
                "This will delete Recent Items, Episodes Watched, Bookmarks and other settings. This will make the app brand new.",
                [
                    {
                        text: "No",
                        onPress: () => console.log('Do Nothing')
                    },
                    {
                        text: "Yes",
                        onPress: () => clearAsyncStorage()
                    }
                ]
            )}>

            <View style={{ flex: 0.1, width: "100%", backgroundColor: 'black', flexDirection: 'row', borderColor: 'white', borderBottomWidth: 1 }}>
                <View style={{ flex: 0.3, width: '50%', justifyContent: 'center' }}>
                    <FontAwesomeIcon style={{ alignSelf: "center" }} size={30} icon={faSmileWink} color={"white"} />
                </View>
                <View style={{ flex: 0.5, width: '50%', flexGrow: 1, justifyContent: 'center' }}>
                        <Text style={{ fontSize: 14.5, color: 'white', alignSelf: 'center' }}>Delete History</Text>
                </View>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => 
                Alert.alert("Do you need to report a problem with the app ?",
                        "There are two ways, In Github you can make a new issue or In Discord you can post the issues in problem with app text channel.",
                    [
                        {
                            text: "Github",
                            onPress: () => Linking.openURL('https://github.com/Lavish883/Loki-Stream')
                        },
                        {
                            text: 'Discord',
                            onPress: () => Linking.openURL('https://discord.gg/UkgY94VW7G')
                        },
                        {
                            text: 'Never Mind',
                            onPress: () => console.log('Do nothing')
                        }
                ])
                }>
            <View style={{ flex: 0.1, width: "100%", backgroundColor: 'black', flexDirection: 'row', borderColor: 'white', borderBottomWidth: 1 }}>
                <View style={{ flex: 0.3, width: '50%', justifyContent: 'center' }}>
                    <FontAwesomeIcon style={{ alignSelf: "center" }} size={30} icon={faExclamation} color={"white"} />
                </View>
                <View style={{ flex: 0.5, width: '50%', flexGrow: 1, justifyContent: 'center' }}>
                        <Text style={{ fontSize: 14.5, color: 'white', alignSelf: 'center' }}>Report a problem</Text>
                </View>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => 
                Alert.alert(
                    "How to Update the App?",
                    "There are two ways to update the app. The app always downloads the latest update on launch. But if you think It is not updated at the latest. Force Stop this App and it will automatically download the Update or download the latest release from Github.",
                    [
                        {
                            text: 'Github',
                            onPress: () => Linking.openURL('https://github.com/Lavish883/Loki-Stream')
                        },
                        {
                            text: 'ok',
                            onPress: () => console.log("ok")
                        }
                    ]
                )
            }>
                <View style={{ flex: 0.1, width: "100%", backgroundColor: 'black', flexDirection: 'row', borderColor: 'white', borderBottomWidth: 1 }}>
                    <View style={{ flex: 0.3, width: '50%', justifyContent: 'center' }}>
                        <FontAwesomeIcon style={{ alignSelf: "center" }} size={30} icon={faCheckCircle} color={"white"} />
                    </View>
                    <View style={{ flex: 0.5, width: '50%', flexGrow: 1, justifyContent: 'center' }}>
                        <Text style={{ fontSize: 14.5, color: 'white', alignSelf: 'center' }}>How to Update the App ?</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => Linking.openURL('https://github.com/Lavish883/Loki-Stream')}>
                <View style={{ flex: 0.1, width: "100%", backgroundColor: 'black', flexDirection: 'row', borderColor: 'white', borderBottomWidth: 1 }}>
                    <View style={{ flex: 0.3, width: '50%', justifyContent: 'center' }}>
                        <FontAwesomeIcon style={{ alignSelf: "center" }} size={30} icon={faCode} color={"white"} />
                    </View>
                    <View style={{ flex: 0.5, width: '50%', flexGrow: 1, justifyContent: 'center' }}>
                        <Text style={{ fontSize: 14.5, color: 'white', alignSelf: 'center' }}>Source Code</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
    const drawer = useRef(null);
    //  
    useEffect(() => {
        if (AnimeLink !== null) {
            console.log("UseEffect" + AnimeLink);
            save();
        }
        SetLink(null);
    }, [AnimeLink]);
    // Loading Anime
    function LoadAnime() {
        fetch("https://gogoanime.vc")
            .then(function (resp) {
                return resp.text();
            })
            .then(function (data) {
                var Results = [{ "Name": [] }]
                var n = data.split(`<ul class="items">`);
                var m = n[1].split(`</ul>`);
                var o = m[0].split(`<li>`);
                for (var i = 1; i < o.length; i++) {
                    var p = o[i].split(`</li>`)
                    // Anime name
                    var name = p[0].split(`title="`);
                    var name1 = name[1].split(`">`)
                    // Image link
                    var image = p[0].split(`src="`)
                    var image1 = image[1].split(`"`)
                    // Episode Link so we can view
                    var link = p[0].split(`href="`)
                    var link1 = link[1].split(`"`)
                    // Episode Number
                    var episode = p[0].split(`<p class="episode">`)
                    var episode1 = episode[1].split(`</p>`);
                    // Adding Items to Json Array
                    Results[0].Name.push({ "id": i, "Name": name1[0], "Image": image1[0], "Link": link1[0], "Episode": episode1[0] });
                }
                setData(Results[0].Name);
                for (i = 0; i < Results.length; i++) {
                    var htmlstring = `
                        <li>
                            <div class="img">
                                <a href="${Results[i].Link}" title="${Results[i].Name}">
                                    <img src="${Results[i].Image}" alt="${Results[i].Name}">
                                    <div class="type ic-SUB"></div>
                                </a> 
                            </div> 
                            <p class="name">
                                <a href="${Results[i].Link}" title="">${Results[i].Name}</a>
                            </p> 
                            <p class="episode">${Results[i].Episode}</p> 
                        </li>                    
                    `
                }

            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }
    useEffect(() => {
        LoadAnime();
    }, []);
    // Example Layout
    const AnimeEpisode = (props) => {
        return (
            <View style={{ borderRadius: 10, borderColor: "white", borderWidth: 1, marginRight: 15, marginBottom: 15 }}>
                <Image style={{ width: 170, height: 250, borderRadius: 10 }} source={{ uri: props.img }} />
                <Text style={{ color: "white" }}>{props.name}</Text>
                <Text style={{ color: "white" }}>Episode {props.episode}</Text>
            </View>
        );
    }
    // Width & Height for the Items
    var  widthImage = Dimensions.get('window').width/2 - 22
    var  heightImage = widthImage * 1.464
    const ShowAnime = ({ item }) => (
        <TouchableWithoutFeedback onPress={() => {
            SetLink("https://gogoanime.vc" + item.Link), console.log("Anime is Clicked"),
                RecentItems[0].Name.push({ "Name": item.Name, "Image": item.Image, "Link": "https://gogoanime.vc" + item.Link, "Episode": item.Episode }),
                addToRecent();
        }}>
        <View style={{ borderRadius: 10, overflow: "hidden", backgroundColor:"#2b2b2b" , marginRight: 15, marginBottom: 15, maxWidth:widthImage}}>
                <Image style={{ width: widthImage, height: heightImage, }} source={{ "uri": item.Image }} />
                <Text style={{ marginTop: 5, color: "white", textAlign: 'center' }}>{item.Name}</Text>       
                <Text style={{ color: "white", textAlign: 'center', marginBottom: 5 }}>{item.Episode}</Text>
            </View>
        </TouchableWithoutFeedback>           
    )
    return (
        <SafeAreaView style={darkModeIsEnabled ? [styles.lightMode] : [styles.container]}>
            <View style={styles.top}>
                <Text style={[styles.Text, { alignSelf: 'center' }]}>Loki Stream</Text>
                <View style={styles.iconContainer}>
                    <TouchableWithoutFeedback onPress={() => {navigation.push("Search")}} >
                        <View style={{ width: '33%'}}>
                            <FontAwesomeIcon size={22} color={"white"} icon={faSearch}
                                style={styles.searchIcon}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => { navigation.navigate('BookMarks') }}>
                    <View style={{ width: '33%' }}>
                        <FontAwesomeIcon size={22} color={"white"} icon={faBookmark}
                                style={styles.searchIcon}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback
                        onPress={pressedDrawer}>
                        <View style={{ width: '33%'}}>
                            <FontAwesomeIcon size={22} color={"white"} icon={faBars}
                            style={styles.searchIcon}
                            />
                            </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
            <DrawerLayoutAndroid
                drawerWidth={drawerWidth}
                drawerPosition={"right"}
                ref={drawer}
                renderNavigationView={navigationView}
                onDrawerOpen={() => { setDrawerOpened(true) }}
                onDrawerClose={() => {setDrawerOpened(false)}}
            >
                <View style={styles.AnimeContainer}>
                    {isLoading ? <ActivityIndicator size="large" color={darkModeIsEnabled ? "black" : "white"} style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }} /> : (
                            <FlatList numColumns="2" style={[{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: 6, zIndex: 100 }]}
                                data={Itemdata}
                                keyExtractor={item => item.Link}
                                renderItem={ShowAnime}
                                showsVerticalScrollIndicator={false}
                                onRefresh={() => { setLoading(true), LoadAnime(); }}
                                refreshing={false}
                                
                            />
                        )}
                </View>
            </DrawerLayoutAndroid>
            
                <View style={styles.bottom}>
                    <View style={styles.bottomIconContainer}>
                    <FontAwesomeIcon size={40} color={"#c4c4c4"} onPress={() => navigation.push('Dub')} icon={faLanguage} style={{ flexGrow: 1 }}
                            />
                    <FontAwesomeIcon size={33} color={"white"} onPress={() => navigation.push('Home')} icon={faHome} style={{ marginTop: 2, flexGrow: 1   }}
                        />
                    <FontAwesomeIcon size={30} color={"#c4c4c4"} onPress={() => navigation.push('Recent')} icon={faHistory} style={{ marginTop: 5, flexGrow: 1   }}
                        />
                    </View>
                    <View style={styles.bottomTextContainer}>
                    <Text onPress={() => navigation.push('Dub')} style={[styles.bottomText, { marginLeft: 2, width: '33.33%', textAlign: 'center', color:'#c4c4c4' }]}>Dub</Text>
                    <Text onPress={() => navigation.push('Home')} style={[styles.bottomText, { marginLeft: 0, marginLeft:6 , width: '33.33%', textAlign: 'center' }]}>Sub</Text>
                    <Text onPress={() => navigation.push('Recent')} style={[styles.bottomText, { marginLeft: 0, width: '33.33%', textAlign: 'center', color:'#c4c4c4' }]}>Recent</Text>
                    </View>
                </View>
            </SafeAreaView>
    );
}
//Recent
// Watch Anime
function Watch({ navigation }) {
    const [AnimeLink, SetLink] = useState(null);
    const [VideoLink, SetVideo] = useState(null);
    const [StorageLink, SetStorage] = useState(null);
    const videoRef = useRef(null)
    const [isLoading, setLoading] = useState(true);
    const [isWebViewLoading, setisWebViewLoading] = useState(true);
    const [firstLoad, setFirstLoad] = useState(true);

    async function changeScreenOrientation() {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
    }
    useEffect(() => {
        if (firstLoad === true) {
            changeScreenOrientation();
            setFirstLoad(false);
        }
    },[firstLoad])


    useEffect(() => {
        const backAction = () => {
            async function changeScreenOrientationPortait() {
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
            }
            changeScreenOrientationPortait();
            navigation.goBack();
            return true;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => backHandler.remove();
    }, []);


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            var Final_Link = xhttp.responseText.split(`window.open('`)
            console.log(Final_Link)
            var Final_Link_2 = Final_Link[1].split(`', '_self`)
            alert(Final_Link_2[0])
            SetStorage(Final_Link_2[0])
        }
    };

    const load = async () => {
        try {
            const value = await AsyncStorage.getItem('Anime');
                // We have data!!
            SetLink(value);
        } catch (error) {
            // Error retrieving data
            alert("nooo")
        }
    };
    var request = new XMLHttpRequest();
    request.onreadystatechange = (e) => {
        if (request.readyState !== 4) {
            return;
        }
        if (request.status === 200) {
            var n = request.responseText.split("file:");
            var m = n[1].split(',label')
            var o = m[0].split(`'`)
            var p = o[1].split('https:')
            if (p[1].includes("mp4")) {
                SetStorage("https:" + p[1]);
            } else if (p[1].includes("m3u8")) {
                var Ajax1 = VideoLink.replace("loadserver", "ajax");
                console.log(Ajax1);
                fetch(Ajax1)
                    .then(function (resp) {
                        return resp.json();
                    })
                    .then(function (data) {
                        if (data.source[0].file.includes("mp4")) {
                            SetStorage(data.source[0].file)
                        } else {
                            SetStorage(data.source[0].file)
                        }
                    })
                    .catch((error) => console.error(error)) 
            }
        } else {
            alert("Not working Report Issue")
        }
    };

    // Create video
    const CreateVideo = () => {
            return (
                <WebView style={{backgroundColor:"black", ios_backgroundColor:'black'}}
                    source={{
                        uri: "https://mathtipslolol.000webhostapp.com/watch.html?play=" + StorageLink
                    }}
                    allowsFullscreenVideo={true}
                    autoManageStatusBarEnabled={true}
                    ref={videoRef}
                    originWhitelist={["*"]}
                    onLoad={() => { setisWebViewLoading(false) }}
                    />
            );
    }
    // Get Video
    function getVideoLink() {
        fetch(AnimeLink)
            .then(function (resp) {
                return resp.text();
            })
            .then(function (data) {
                var n = data.split("iframe");
                var m = n[1].split(`"`)
                var iframe = "https:" + m[1].replace("streaming", "loadserver");
                SetVideo(iframe)

            })
            .catch((error) => console.error(error))
    }
    useEffect(() => {
        if (AnimeLink !== null) {
            getVideoLink();
        }
    }, [AnimeLink]);
    useEffect(() => {
        if (VideoLink !== null) {
            console.log(VideoLink);
            request.open('GET', VideoLink);
            request.send();
        }
    }, [VideoLink]);
    useEffect(() => {
        if (StorageLink === null || StorageLink === undefined) {

        }
        else {
            setTimeout(function () {
                if (StorageLink.includes("mp4")) {
                    console.log(StorageLink);
                    setLoading(false);
                } else {
                    console.log(StorageLink);
                    console.log('m3u8')
                    setLoading(false);
                }
            },2500)
        }
    }, [StorageLink]);
    load();
    return (
        <SafeAreaView style={{
            paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
            flex: 1,
            backgroundColor:"black"
        }}>
            {isLoading ? <ActivityIndicator size="large" color="white" style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center'
            }} /> : (
                    <CreateVideo/>
                )}
            { isWebViewLoading && ( <ActivityIndicator size="large" color="white" style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center'
            }} /> 
                )}
        </SafeAreaView>
    );
}
const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName = "Home">
                <Stack.Screen options={{ headerShown: false }} name="Home" component={Home} />
                <Stack.Screen options={{ headerShown: false }} name="Dub" component={Dub} />
                <Stack.Screen options={{ headerShown: false }} name="Recent" component={Recent} />
                <Stack.Screen options={{ headerShown: false }} name="Watch" component={Watch} />
                <Stack.Screen name="Search" options={{headerShown: false}} component={Search} />
                <Stack.Screen options={{headerShown: false}} name="Anime" component={Anime} />
                <Stack.Screen options={{headerShown: false}} name="BookMarks" component={BookMarks} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#333131',
    },
    lightMode: {
        flex: 1,
        backgroundColor: 'white',
    }
    ,
    top: {
        backgroundColor: '#ed1915',
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight - 5 : 0,
        width: '100%',
        height: '10%',
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    Text: {
        color: 'white',
        fontSize: 24,
        alignSelf: "flex-start",
    },
    bottom: {
        backgroundColor: '#ed1915',
        width: '100%',
        height: '8%',
        justifyContent: 'center',
        bottom: 0,
    },
    flaTContain: {
        justifyContent: 'center'
    },
    searchIcon: {
        alignSelf:'center'
    },
    bottomIcons: {
    },
    iconContainer: {
        flexDirection: "row",
        justifyContent: 'space-around',
        flex: 0.65,
        height: 35,
        marginTop:15
    },
    bottomIconContainer: {
        flex: 0.5,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    bottomTextContainer: {
        flex: 0.5,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    bottomText: {
        color: 'white',
        marginTop: 3,
        fontSize: 17,
    },
    AnimeContainer: {
        flex: 1,
        padding: 8,
        zIndex:0
    }
});
const drawerStyle = StyleSheet.create({
    container: {
        flex: 1,
        width:'100%'
    },
    navigationContainer: {
        backgroundColor: "#ecf0f1"
    },
    paragraph: {
        padding: 16,
        fontSize: 15,
        textAlign: "center"
    }
})


