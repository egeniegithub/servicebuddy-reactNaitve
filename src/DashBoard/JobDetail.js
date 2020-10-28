import React from 'react';
import {
    StyleSheet, View, Text, StatusBar, Platform, TouchableOpacity,
    ScrollView, Linking, Clipboard
} from 'react-native';
import { Header, Icon, Divider, Button, Image, } from 'react-native-elements';

let colors = require("../Themes/Color");
import JobDetailFirst from '../components/JobDetailFirst';
import SingleRowJobDetail from '../components/SingleRowJobDetail';
import { showLocation, Popup } from 'react-native-map-link'
import { getEstimatedTime, updateStatus } from '../network/Network';
import { jobList } from "./Home";
import { loggedInUserId } from "../Login/Login";
import { NavigationActions, StackActions } from "react-navigation";
import CustomHeader from '../components/CustomHeader';
import Geolocation from '@react-native-community/geolocation';

let moment = require('moment');

export default class JobDetail extends React.Component {
    intervalID = 0;
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            statusChangeRequest: false,
            jobDetail: null,

        };
    }

    componentDidMount() {
        let { navigation } = this.props;
        let data = navigation.getParam('data', null);
        this.setState({
            jobDetail: data,
        });
        if (data.status === "Onway") {
            this.startTracking();
        }
    }

    leftComponentGoBack = () => {
        return (
            <TouchableOpacity onPress={this._goBack}>
                <Icon
                    name='arrow-back'
                    color={colors.colorWhite}
                />
            </TouchableOpacity>
        );
    };
    _goBack = () => {
        // this.props.navigation.goBack();
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'HomeScreen' })],
            key: null
        });
        this.props.navigation.dispatch(resetAction);
    };

    async startTracking(EstimatedTime, startTime) {
        this.intervalID = setInterval(() => {
            let currentTime = moment();
            let difference = moment.duration(currentTime.diff(startTime)).asMinutes();
            let finalDifference = EstimatedTime - difference;
            if (finalDifference < 15) {
                this._attemptStatusChange(true);
                clearInterval(this.intervalID);
            }
        }, 5000);
    }

    attemptStatusChange(jobDetail, updatedStatus, EstimatedTime, isAlreadyUpdated = false) {

        if (isAlreadyUpdated && EstimatedTime > 15) {
            this.startTracking(EstimatedTime, moment());
        } else {
            console.log("EstimatedTime ; " + EstimatedTime);
            EstimatedTime = Math.ceil(EstimatedTime);
            updateStatus(jobDetail.id.toString(), updatedStatus, EstimatedTime.toString(), (response2) => {
                if (response2 != null && response2.status === "success") {
                    jobDetail.status = updatedStatus;
                    if (updatedStatus === "Onway") {
                        this.setState({
                            jobDetail: jobDetail,
                        });
                        if (EstimatedTime > 15) {
                            this.startTracking(EstimatedTime, moment());
                        }
                    } else {
                        this.setState({
                            jobDetail: jobDetail,
                        });
                        if (updatedStatus === "Done") {
                            jobList.jobCount = jobList.jobCount - 1;
                            if (jobList.jobCount > 0) {
                                this.props.navigation.navigate('JobCompleted');
                            } else {
                                this.props.navigation.navigate('DayCompleted');
                            }
                        }
                    }
                } else {
                    alert("Something went wrong, Your job is not started yet please try again.");
                }
                this.setState({
                    statusChangeRequest: false
                });
            });
        }

    }

    _attemptStatusChange = (isAlreadyUpdated = false) => {
        // {
        // just for testing

        // console.log(jobList.jobCount);
        // console.log("------");
        // console.log(loggedInUserId);
        // jobList.jobCount = jobList.jobCount - 1;
        // if (jobList.jobCount > 0) {
        //     this.props.navigation.navigate('JobCompleted');
        // }
        // else {
        //     this.props.navigation.navigate('DayCompleted');
        // }
        // return;

        //}
        this.setState({
            statusChangeRequest: true
        });

        if (!isAlreadyUpdated && this.state.jobDetail.status === "Onway") {
            clearInterval(this.intervalID);
            this.attemptStatusChange(this.state.jobDetail, "Inprogress", "0", isAlreadyUpdated);
        } else if (!isAlreadyUpdated && this.state.jobDetail.status === "Inprogress") {
            clearInterval(this.intervalID);
            this.attemptStatusChange(this.state.jobDetail, "Done", "0", isAlreadyUpdated);
        } else if (this.state.jobDetail.isFirst) {
            console.log("here")
            Geolocation.getCurrentPosition(
                (position) => {
                    let dest = this.state.jobDetail.customer_location.split(',');
                    getEstimatedTime(position.coords.latitude, position.coords.longitude, dest[0], dest[1], (response) => {
                        console.log(response);
                        if (response.status === "OK" && response.rows[0].elements[0].duration != null) {
                            let timeObj = response.rows[0].elements[0].duration.value;
                            let EstimatedTime = timeObj / 60;
                            this.attemptStatusChange(this.state.jobDetail, "Onway", EstimatedTime, isAlreadyUpdated);
                        } else {
                            alert("Unable to get your estimated distance from customer location.");
                            this.setState({
                                statusChangeRequest: false
                            });
                        }
                    });
                },
                (error) => {
                    alert(error.message);
                    this.setState({
                        statusChangeRequest: false
                    });
                },
                { enableHighAccuracy: false, timeout: 200000, maximumAge: 10000 },
            );
        }
    };
    showMap = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                let dest = this.state.jobDetail.customer_location.split(',');
                showLocation({
                    latitude: dest[0],
                    longitude: dest[1],
                    sourceLatitude: position.coords.latitude,  // optionally specify starting location for directions
                    sourceLongitude: position.coords.longitude,  // not optional if sourceLatitude is specified
                    appsWhiteList: ['google-maps'] // optionally you can set which apps to show (default: will show all supported apps installed on device)
                });
            },
            (error) => {
                alert(error.message);
                this.setState({
                    statusChangeRequest: false
                });
            },
            { enableHighAccuracy: false, timeout: 200000, maximumAge: 10000 },
        );
        console.log("Here is MAp..");

    };

    render() {
        let StatusButtonColor = colors.colorLightGrayText;
        let StatusButton = 'start';
        let StatusButtonDisabled = false;
        if (this.state.statusChangeRequest) {
            StatusButtonDisabled = true;
        }
        if (this.state.jobDetail !== null && this.state.jobDetail.status === "Onway") {
            StatusButtonColor = colors.onWayColor;
            StatusButton = "Reached";
        } else if (this.state.jobDetail !== null && this.state.jobDetail.status === "Inprogress") {
            StatusButtonColor = colors.inProgressColor;
            StatusButton = "Finished";
        } else if (this.state.jobDetail !== null && this.state.jobDetail.isFirst) {
            StatusButtonColor = colors.colorPrimary;
            StatusButton = "Start";
        } else {
            StatusButtonDisabled = true;
        }
        return (
            <View style={{ flex: 1, }}>
                <CustomHeader
                    title="Job Detail"
                    leftComponent={this.leftComponentGoBack()}
                />
                {
                    (this.state.jobDetail !== null) ?

                        <View style={{ flex: 1, }}>
                            <ScrollView>
                                <View style={{ alignItems: 'center', marginTop: 30 }}>
                                    <Text style={{ fontSize: 20, }}>{this.state.jobDetail.customer_name}</Text>
                                    <Button
                                        icon={{
                                            name: "call",
                                            color: "white"
                                        }}
                                        title="Call Customer"
                                        buttonStyle={{ backgroundColor: colors.colorPrimary, borderRadius: 20 }}
                                        containerStyle={{ marginTop: 10 }}
                                        onPress={() => Linking.openURL(`tel:${this.state.jobDetail.customer_phone}`)}

                                    />
                                </View>
                                <Divider style={{ backgroundColor: colors.colorGrayText, marginTop: 20, }} />
                                <SingleRowJobDetail heading="Job ID" description={this.state.jobDetail.job_id}
                                    leftIcon={require('../../assets/ic_jobid_black.png')}
                                    rightIcon={require('../../assets/ic_clipboard_copy.png')}
                                    methodForDirection={
                                        () => {
                                            Clipboard.setString(this.state.jobDetail.job_id.toString());
                                            alert("Job id is copied to clipboard.");
                                        }
                                    }
                                />

                                <SingleRowJobDetail heading="Address"
                                    description={this.state.jobDetail.customer_address}
                                    leftIcon={require('../../assets/ic_address.png')}
                                    rightIcon={require('../../assets/ic_direction.png')}
                                    methodForDirection={
                                        this.showMap
                                    }
                                />
                                <View style={{
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between'
                                }}>
                                    <View style={{ flex: 1 }}>
                                        <JobDetailFirst heading="Start Time"
                                            description={moment(this.state.jobDetail.starting_time, 'HH:mm').format('hh:mm A')} // moment(props.description, 'HH:mm').format('hh:mm A')
                                            leftIcon={require('../../assets/ic_start_time.png')} />
                                    </View>
                                    <View style={{ backgroundColor: colors.colorGrayText, width: 0.5, height: 80 }} />
                                    <View style={{ flex: 1 }}>
                                        <JobDetailFirst heading="End Time"
                                            description={moment(this.state.jobDetail.ending_time, 'HH:mm').format('hh:mm A')}
                                            leftIcon={require('../../assets/ic_end_time.png')} />
                                    </View>
                                </View>
                                <Divider style={{ backgroundColor: colors.colorGrayText, }} />

                                <View style={{ flexDirection: 'row', marginVertical: 10, marginRight: 130 }}>
                                    <View style={{ flexDirection: 'row', }}>
                                        <View style={{ marginLeft: 10, }}>
                                            <Image
                                                style={{ width: 35, height: 35 }}
                                                source={require('../../assets/ic_services.png')}
                                            />
                                        </View>
                                        <View style={{ marginLeft: 10, }}>
                                            <Text style={{ paddingBottom: 10, color: colors.colorGrayText }}>Requested
                                                Services</Text>
                                            <Text style={{
                                                fontWeight: '700',
                                                textAlign: 'justify',
                                            }}>{this.state.jobDetail.services}</Text>
                                            {/* <Text style={{ fontWeight: '700', textAlign: 'justify', }}>kkkkkkkkkk kkk</Text> */}
                                        </View>
                                    </View>
                                </View>

                                <Divider style={{ backgroundColor: colors.colorGrayText, }} />
                                <View style={{ flexDirection: 'row', marginVertical: 10, marginRight: 130 }}>
                                    <View style={{ flexDirection: 'row', }}>
                                        <View style={{ marginLeft: 10, }}>
                                            <Image
                                                style={{ width: 35, height: 35 }}
                                                source={require('../../assets/ic_comment.png')}
                                            />
                                        </View>
                                        <View style={{ marginLeft: 10, }}>
                                            <Text style={{ paddingBottom: 10, color: colors.colorGrayText }}>Additional Comments</Text>
                                            <Text style={{
                                                fontWeight: '700',
                                                textAlign: 'justify',
                                            }}>{this.state.jobDetail.additional_comments}</Text>
                                        </View>
                                    </View>
                                </View>

                                <Divider style={{ backgroundColor: colors.colorGrayText, }} />
                            </ScrollView>

                            <View style={{ height: 100, justifyContent: "center", alignItems: "center" }}>
                                <Button
                                    title={StatusButton}
                                    titleStyle={(StatusButtonDisabled) ? { color: 'black' } : null}
                                    loading={this.state.statusChangeRequest}
                                    disabled={StatusButtonDisabled}
                                    disabledStyle={{ backgroundColor: colors.colorLightGrayText }}
                                    containerStyle={{ width: "90%", }}
                                    buttonStyle={{ backgroundColor: StatusButtonColor, borderRadius: 20 }}
                                    onPress={() => {
                                        this._attemptStatusChange()
                                    }}
                                />
                            </View>

                        </View>
                        :
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                            <Text>Sorry! No Job Detail. Try Again.</Text>
                        </View>
                }

            </View>
        );
    }
}
const styles = StyleSheet.create({})