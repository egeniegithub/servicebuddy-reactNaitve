import React from 'react';
import {
    StyleSheet, View, Text, TouchableOpacity, RefreshControl, ScrollView,
    Platform, StatusBar, Alert, AlertIOS, ActionSheetIOS, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions, NavigationActions } from 'react-navigation';
import { Header, Icon, ListItem, Divider, Image, Avatar } from 'react-native-elements';
import { getActiveJobs } from '../network/Network';
import { setJobList, getJobList, getIsBreakTime } from "../store/Store";

let colors = require('../Themes/Color');
let moment = require('moment');
export var jobList = {
    jobCount: 0,
}
export default class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            jobsObj: null,
            initialRefreshing: true,
        };
        console.log("Home Constructor..");
    }

    static navigationOptions = {
        header: null,
    };

    componentDidMount() {

        this._getISBreak();
        // this.getActiveJobs();
    }

    _getISBreak = async () => {
        try {
            const value = await AsyncStorage.getItem('isBreak');
            if (value !== null) {
                if (value == "true") {
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'BreakTime' })],
                        key: null
                    });
                    this.props.navigation.dispatch(resetAction);
                }
                else {
                    this.getActiveJobs();
                }
            }
            else {
                // for first time app install
                this.getActiveJobs();
            }

        }
        catch (err) {
            console.log("Error while  getting isBreak ");
        }
    }

    _signOut = () => {
        this._storeData();
        setTimeout(() => {
            // this.props.navigation.navigate('LoginScreen');
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'LoginScreen' })],
                key: null
            });
            this.props.navigation.dispatch(resetAction);
        }, 100);
    }

    _storeData = async () => {
        try {
            console.log("Login Value Set.");
            await AsyncStorage.setItem('isLogin', 'false');
        } catch (error) {
            console.log("Error While Saveing Data");
        }
    };

    _logOutDialog = () => {
        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: ['Cancel', 'Log Out'],
                    destructiveButtonIndex: 1,
                    cancelButtonIndex: 0,
                },
                (buttonIndex) => {
                    if (buttonIndex === 1) {
                        this._signOut();
                    }
                },
            );
        } else {
            Alert.alert(
                'Log Out',
                '',
                [
                    {
                        text: 'Cancel',
                        onPress: () => {
                            console.log("Cancel Dialog");
                        },
                        style: 'cancel',
                    },
                    {
                        text: 'Log Out', onPress: () => {
                            this._signOut()
                        }
                    },
                ],
                { cancelable: true },
            );
        }
    }

    menuComponent = () => {
        return (
            <TouchableOpacity onPress={this._logOutDialog}>
                <Icon
                    name='more-vert'
                    color='#fff' />
            </TouchableOpacity>
        )
    }

    getActiveJobs = () => {
        if (!this.state.initialRefreshing) {
            this.setState({
                refreshing: true,
            });
        }
        getActiveJobs((result) => {
            if (result.data.length > 0) {
                result.data[0].isFirst = true;
                jobList.jobCount = result.data.length;
                this.setState({
                    refreshing: false,
                    jobsObj: result,
                    initialRefreshing: false,
                });

            } else {
                this.setState({
                    refreshing: false,
                    jobsObj: null,
                    initialRefreshing: false,
                });
            }
        })
    }

    _onRefresh = () => {
        this.getActiveJobs();
    }


    render() {
        let presentDate = moment().format('LL');

        return (
            <View style={{ flex: 1, }}>
                <StatusBar backgroundColor={colors.colorPrimary} barStyle="light-content" />
                <Header
                    barStyle="light-content"
                    // rightComponent={{ icon: 'more-vert', color: '#fff' }}
                    centerComponent={{ text: 'Job Listings', style: { color: '#fff', fontSize: 20, fontWeight: '500' } }}
                    rightComponent={this.menuComponent()}
                    containerStyle={[{
                        backgroundColor: colors.colorPrimary,

                    }, (Platform.OS === 'ios') ? null : { height: 50, paddingBottom: 20 }]}

                />
                <View style={{
                    backgroundColor: colors.colorPrimaryLight,
                    justifyContent: 'center', height: 30, marginTop: -1, alignItems: "center",
                }}>
                    <Text style={{ color: colors.colorWhite }}>{presentDate}</Text>
                </View>


                <ScrollView
                    contentContainerStyle={{ flex: 1 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />
                    }
                >
                    {(this.state.jobsObj !== undefined && this.state.jobsObj !== null && this.state.jobsObj.data.length !== 0)
                        ? this._displayJobsList() :
                        (this.state.initialRefreshing) ?
                            <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
                                <ActivityIndicator size="large" color="#000000" />
                                <Text style={{ fontSize: 20 }}>Fetching Jobs</Text>
                            </View>
                            :
                            <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
                                <Text style={{ fontSize: 20 }}>No Jobs Available</Text>
                                <Text style={{ color: colors.colorDarkGrayText }}>swipe down to refresh the list</Text>
                            </View>
                    }
                </ScrollView>
            </View>
        );
    }


    _displayJobsList = () => {
        return (
            <View>
                {
                    this.state.jobsObj.data.map((data, i) => {
                        let jobidicon = require('../../assets/ic_jobid_black.png');
                        let phoneIcon = require('../../assets/ic_phone_black.png');
                        let timeIcon = require('../../assets/ic_time_black.png');
                        let chevron = require('../../assets/ic_arrow_black.png');
                        let textColor = 'black';
                        let backgroundColor = 'white';
                        let extraButtonVisible = false;
                        let extraButtonColor = colors.colorPrimary;
                        let extraButtonText = "Ready to Start";
                        if (data.status === "Inprogress" || data.status === "Onway" || data.isFirst) {
                            jobidicon = require('../../assets/ic_jobid_white.png');
                            phoneIcon = require('../../assets/ic_phone_white.png');
                            timeIcon = require('../../assets/ic_time_white.png');
                            chevron = require('../../assets/ic_arrow_white.png');
                            textColor = 'white';
                            backgroundColor = colors.colorGray;
                            extraButtonVisible = true;
                            if (data.status === "Inprogress") {
                                extraButtonColor = colors.inProgressColor;
                                extraButtonText = "In Progress";
                            }
                            if (data.status === "Onway") {
                                extraButtonColor = colors.onWayColor;
                                extraButtonText = "On way";
                            }
                        }
                        return (
                            <ListItem
                                key={i}
                                containerStyle={{ backgroundColor: backgroundColor }}
                                title={
                                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', }}>
                                        <View style={styles.rowStyle}>
                                            <Text
                                                style={{ fontSize: 20, color: textColor }}>{data.customer_name}</Text>
                                        </View>
                                        {(extraButtonVisible) ? <View style={{ paddingTop: 5, paddingBottom: 5, }}>
                                            <View style={{
                                                paddingTop: 2,
                                                paddingBottom: 2,
                                                paddingRight: 10,
                                                paddingLeft: 10,
                                                borderRadius: 10,
                                                backgroundColor: extraButtonColor,
                                                alignContent: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <Text style={{ color: 'white' }}>{extraButtonText}</Text>
                                            </View>
                                        </View> : null}
                                    </View>
                                }
                                onPress={() => this.props.navigation.navigate('JobDetail', { data: data })}
                                subtitle={
                                    <View style={{ marginTop: 5 }}>
                                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', }}>
                                            <View style={styles.rowStyle}>
                                                <Image
                                                    source={jobidicon}
                                                    style={{ width: 23, height: 23 }}
                                                />
                                                <Text
                                                    style={{ marginLeft: 15, color: textColor }}>{data.job_id}</Text>
                                            </View>
                                        </View>
                                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', }}>
                                            <View style={styles.rowStyle}>
                                                <Image
                                                    source={phoneIcon}
                                                    style={{ width: 23, height: 23 }}
                                                />
                                                <Text
                                                    style={{
                                                        marginLeft: 15,
                                                        color: textColor
                                                    }}>{data.customer_phone}</Text>
                                            </View>
                                        </View>

                                        <View style={{ justifyContent: 'space-between', flexDirection: 'row', }}>
                                            <View style={styles.rowStyle}>
                                                <Image
                                                    source={timeIcon}
                                                    style={{ width: 23, height: 23 }}
                                                />
                                                <Text
                                                    style={{
                                                        marginLeft: 15,
                                                        color: textColor
                                                    }}>{moment(data.starting_time, 'HH:mm').format('hh:mm A')}</Text>
                                            </View>
                                            <View>
                                                <Image
                                                    source={chevron}
                                                    style={{ width: 23, height: 23 }}
                                                />
                                            </View>
                                        </View>
                                        <Divider style={{
                                            backgroundColor: colors.colorGrayText,
                                            marginLeft: -10,
                                            marginRight: -10,
                                            marginTop: 10
                                        }} />
                                    </View>
                                }
                            />
                        )
                    })
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowStyle: {
        flexDirection: 'row',
        height: 30,
        alignItems: 'center',
    }


});