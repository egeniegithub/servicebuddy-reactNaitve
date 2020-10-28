import React from 'react';
import { View, Text, StyleSheet, StatusBar, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Header, Button } from 'react-native-elements';
let colors = require('../Themes/Color');
import { NavigationActions, StackActions } from "react-navigation";
let moment = require('moment');
import { setIsBreakTime } from '../store/Store';

export default class BreakTime extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentTime: "00:00",
            breakTime: "",
        }
    }
    static navigationOptions = {
        headerShown: false
    };

    componentDidMount() {

        this._setIsBreak("true");
        this._getBreakTime();

        setTimeout(() => {
            this.breakInterval = setInterval(() => {

                let remaningBreakTime = moment(this.state.breakTime, 'mm:ss')
                    .subtract(moment().format('mm'), 'minutes')
                    .subtract(moment().format('ss'), 'seconds')
                    .format('mm:ss');

                if (remaningBreakTime == "00:00") {

                    this._setIsBreak("false");
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'HomeScreen' })],
                        key: null
                    });
                    this.props.navigation.dispatch(resetAction);
                }
                else {
                    this.setState({
                        currentTime: remaningBreakTime
                    })
                }



            }, 1000);
        }, 500)

    }



    _getBreakTime = async () => {
        try {
            const value = await AsyncStorage.getItem('BreakTime');
            if (value !== null) {
                console.log("Here is Break Time Value .. " + value);
                this.setState({
                    breakTime: value
                })
            }
        }
        catch (err) {
            console.log("Error while getting break Time ");
        }
    }

    _setIsBreak = async (value) => {
        try {
            await AsyncStorage.setItem('isBreak', value);
        }
        catch (err) {
            console.log("error while setting is Break ");
        }
    }

    componentWillUnmount() {
        clearInterval(this.breakInterval)
    }


    render() {
        return (
            <View style={styles.container}>
                <View style={{ alignItems: "center", }}>
                    <StatusBar backgroundColor={colors.colorPrimary} barStyle="light-content" />
                    <Header
                        barStyle="light-content"
                        centerComponent={{ text: 'Break Status', style: { color: '#fff', fontSize: 20, fontWeight: '500' } }}

                        containerStyle={[{
                            backgroundColor: colors.colorPrimary,

                        }, (Platform.OS === 'ios') ? null : { height: 50, paddingBottom: 20 }]}

                    />
                </View>
                <View style={{ alignItems: "center", }}>
                    <Text style={{ color: '#ffffff' }}>Break Time Left</Text>
                    <Text style={{ color: '#ffffff', fontSize: 40, marginTop: 10, fontWeight: "600" }}>00:{this.state.currentTime}</Text>
                </View>
                <Button
                    onPress={() => {

                        this._setIsBreak("false");

                        setTimeout(() => {
                            const resetAction = StackActions.reset({
                                index: 0,
                                actions: [NavigationActions.navigate({ routeName: 'HomeScreen' })],
                                key: null
                            });
                            this.props.navigation.dispatch(resetAction);
                        }, 100)

                    }}
                    containerStyle={{ width: "85%", borderRadius: 4, marginBottom: 20 }}
                    buttonStyle={{ backgroundColor: colors.colorRed, borderRadius: 4 }}
                    titleStyle={{ fontSize: 20 }}
                    title="Finish Break Now"
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.colorGray,
        justifyContent: "space-between",
        alignItems: "center",

    }
})