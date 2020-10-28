import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    Platform,
    Dimensions,
    Image,
    Picker,
    Switch, Alert,
    TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Header, Input, Button, Icon } from 'react-native-elements';
import { NavigationActions, StackActions } from "react-navigation";
import { startBreak } from '../network/Network';

let colors = require("../Themes/Color")

const width = Dimensions.get('window').width;
let moment = require('moment');

export default class JobCompleted extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isButtonDisabled: false,
            shouldBreak: false,
            pickerValue: "10",
        }
    }

    static navigationOptions = {
        headerShown: false,
    };

    _setBreakTime = async () => {
        try {
            let totalTime = moment(moment().format('h:mm:ss'), 'h:mm:ss')
                .add(this.state.pickerValue, 'minutes')
                .format('mm:ss');
            await AsyncStorage.setItem('BreakTime', totalTime);
        }
        catch (err) {
            console.log("Error while Picking Value. ", err);
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor={colors.colorPrimary} barStyle="light-content" />
                <Header
                    barStyle="light-content"
                    // leftComponent={this.leftComponentGoBack()}
                    centerComponent={{ text: 'Job Completed', style: { color: '#fff', fontSize: 20, fontWeight: '500' } }}
                    containerStyle={[{
                        backgroundColor: colors.colorPrimary,
                    }, (Platform.OS === 'ios') ? null : { height: 50, paddingBottom: 20 }]}
                />

                <Image
                    style={{ width: width / 2, height: width / 2, marginTop: 20 }}
                    source={require('../../assets/ic_break_time.png')}
                />
                {(!this.state.shouldBreak) ? <View style={{ alignItems: 'center' }}>
                    <Text style={{ marginTop: 8, marginRight: 5, fontSize: 19 }}>Do you want to take a break?</Text>
                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-evenly' }}>
                        <Button
                            onPress={() => {
                                this.setState({
                                    shouldBreak: 1
                                });
                            }}
                            containerStyle={{ width: "35%", borderRadius: 4, marginTop: 8 }}
                            buttonStyle={{ backgroundColor: colors.colorPrimary, borderRadius: 20 }}
                            titleStyle={{ fontSize: 20 }}
                            title="Yes"
                        />
                        <Button
                            onPress={() => {
                                const resetAction = StackActions.reset({
                                    index: 0,
                                    actions: [NavigationActions.navigate({ routeName: 'HomeScreen' })],
                                    key: null
                                });
                                this.props.navigation.dispatch(resetAction);
                            }}
                            containerStyle={{ width: "35%", borderRadius: 4, marginTop: 8 }}
                            buttonStyle={{ backgroundColor: colors.colorDarkGrayText, borderRadius: 20 }}
                            titleStyle={{ fontSize: 20 }}
                            title="No"
                        />
                    </View>
                </View> : null}

                {(this.state.shouldBreak) ?
                    <Text style={{ marginTop: 8, marginRight: 5, fontSize: 19 }}>Select your break time?</Text>
                    : null}
                {(this.state.shouldBreak) ? <View style={[(Platform.OS === 'ios') ? { height: 200 } : { height: 50 }]}>
                    <Picker
                        selectedValue={this.state.pickerValue}
                        style={[{ width: 150, }, (Platform.OS === 'ios') ? { height: 10 } : { height: 100 }]}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({ pickerValue: itemValue })
                        }>
                        <Picker.Item label="10 min" value="10" />
                        <Picker.Item label="20 min" value="20" />
                        <Picker.Item label="30 min" value="30" />
                        <Picker.Item label="40 min" value="40" />
                        <Picker.Item label="50 min" value="50" />
                        <Picker.Item label="60 min" value="60" />
                    </Picker>
                </View>
                    : null}
                {(this.state.shouldBreak) ? <Button
                    onPress={() => {
                        this.setState({ isButtonDisabled: true });
                        startBreak(this.state.pickerValue.toString(), (result) => {
                            if (result.status === "success") {
                                this.setState({ isButtonDisabled: false });
                                /**TODO startbreak startbreakPage();
                                 * after break ends go to homepage.
                                 **/

                                this._setBreakTime()
                                setTimeout(() => {
                                    const resetAction = StackActions.reset({
                                        index: 0,
                                        actions: [NavigationActions.navigate({
                                            routeName: 'BreakTime'
                                        })],
                                        key: null
                                    });
                                    this.props.navigation.dispatch(resetAction);
                                }, 100)

                            } else {
                                Alert.alert(
                                    "Alert"
                                    , "Break was not started due to some unknown reason."
                                    , [{
                                        text: "OK", onPress: () => {
                                            const resetAction = StackActions.reset({
                                                index: 0,
                                                actions: [NavigationActions.navigate({ routeName: 'HomeScreen' })],
                                                key: null
                                            });
                                            this.props.navigation.dispatch(resetAction);
                                        }
                                    }]
                                    , { cancelable: false }
                                )
                            }
                        });
                    }}
                    loading={this.state.isButtonDisabled}
                    disabled={this.state.isButtonDisabled}
                    disabledStyle={{ backgroundColor: colors.colorLightGrayText }}
                    containerStyle={{ width: "85%", borderRadius: 4, marginTop: 8 }}
                    buttonStyle={{ backgroundColor: colors.colorPrimary, borderRadius: 4, marginTop: 20 }}
                    titleStyle={{ fontSize: 20 }}
                    title="Done"
                /> : null}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.colorWhite,
        alignItems: 'center',
    },
})