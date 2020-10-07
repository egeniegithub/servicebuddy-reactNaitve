import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Platform,
    StatusBar,
    KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button } from 'react-native-elements';

let colors = require('../Themes/Color');
import * as Animatable from 'react-native-animatable';
import { doLogin } from '../network/Network';
import { ProgressDialog } from 'react-native-simple-dialogs';
import { StackActions, NavigationActions } from "react-navigation";
// MyCustomComponent = Animatable.createAnimatableComponent(MyCustomComponent);
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export var loggedInUserId = '0';
export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dialogVisible: false,
            text: '',
            nextScreen: false,
            login: false,
            email: '',
            password: '',
            userID: '',
        }
    }

    static navigationOptions = {
        header: null,
    };

    componentDidMount() {
        this._retrieveData();
        setTimeout(() => {

            this.setState({
                nextScreen: true,
            });
            if (this.state.login) {
                setTimeout(() => {
                    // this.props.navigation.navigate('HomeScreen');
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'HomeScreen' })],
                        key: null
                    });
                    this.props.navigation.dispatch(resetAction);
                }, 1000)
            }
        }, 1000);
    }

    _storeData = async (result) => {
        try {
            console.log("Login Value Set.");
            loggedInUserId = result.data.user_id.toString();
            await AsyncStorage.setItem('isLogin', 'true');
            await AsyncStorage.setItem('user_id', result.data.user_id.toString());
        } catch (error) {
            console.log("Error While Saveing Data");
        }
    };

    _retrieveData = async () => {
        try {
            console.log("Receive Data from Storage");

            const value = await AsyncStorage.getItem('isLogin');
            if (value !== null) {
                console.log(value);
                // this.props.navigation.navigate('HomeScreen');
                if (value == 'true') {
                    loggedInUserId = await AsyncStorage.getItem('user_id');
                    this.setState({
                        login: true,
                    });
                }
            }
        } catch (error) {
            console.log("Error While getting Data.");
        }
    };

    _tryLogin = () => {
        console.log('1  1 1  1 ');
        this.setState({ dialogVisible: true });
        alert('hhere')
        return
        doLogin(this.state.email, this.state.password, (result) => {
            console.log('<< < << < <  : ', result);
            if (result.status == 'success') {
                this.setState({ dialogVisible: false });
                this._setLogin(result);
                console.log("Here is user ID : " + result.data);
                console.log(result);
            } else {
                this.setState({ dialogVisible: false });
                alert(result.message);
                console.log("error Message.. : " + result.message);
                console.log(result);
            }
        });
    }

    _setLogin = (result) => {
        console.log("Set Login is Called...");
        this._storeData(result);
        setTimeout(() => {
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'HomeScreen' })],
                key: null
            });
            this.props.navigation.dispatch(resetAction);
        }, 200);
        // this.props.navigation.navigate('HomeScreen');
    }

    render() {
        return (
            <View>
                <View style={styles.container}>
                    {(this.state.nextScreen) ?
                        <Animatable.View animation="fadeInUpBig" duration={800} >
                            <View style={styles.splashContainer}>
                                <Image source={require('../../assets/logo.png')} />
                                <Text style={{
                                    color: colors.colorPrimary,
                                    fontWeight: '600',
                                    fontSize: 30,
                                    marginTop: 16
                                }}>Service</Text>
                                <Text style={{
                                    fontWeight: '600',
                                    fontSize: 30,
                                    marginTop: 6,
                                    color: colors.colorBlack
                                }}>Buddy</Text>
                            </View>
                            {(this.state.login) ? null :
                                <View style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginRight: 40,
                                    marginLeft: 40,
                                }}>
                                    <Input
                                        containerStyle={{ width: '100%', marginTop: 16, }}
                                        inputStyle={{ marginLeft: 10, }}
                                        placeholder='johndoe@gmail.com'
                                        leftIcon={
                                            <Icon
                                                name='user'
                                                size={24}
                                                color='black'
                                            />
                                        }
                                        onChangeText={(email) => this.setState({ email })}
                                    />

                                    <Input
                                        containerStyle={{ width: '100%', marginTop: 10 }}
                                        inputStyle={{ marginLeft: 10 }}
                                        placeholder='password'
                                        secureTextEntry={true}
                                        leftIcon={
                                            <Icon
                                                name='lock'
                                                size={24}
                                                color='black'
                                            />
                                        }
                                        onChangeText={(password) => this.setState({ password })}
                                    />

                                    <Button
                                        onPress={() => {
                                            // this._storeData();
                                            // this.props.navigation.navigate('HomeScreen')
                                            this._tryLogin();
                                        }}
                                        disabled={this.state.dialogVisible}
                                        loading={this.state.dialogVisible}
                                        disabledStyle={{ backgroundColor: colors.colorGrayText, height: 40, borderRadius: 30 }}
                                        containerStyle={{ width: '90%', marginTop: 20 }}
                                        buttonStyle={{ backgroundColor: colors.colorPrimary, borderRadius: 30, height: 40, marginBottom: 100 }}
                                        titleStyle={{ fontSize: 20 }}
                                        title="Login"
                                    />
                                </View>
                            }

                        </Animatable.View>
                        : null}
                </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: (Platform.OS === 'ios') ? 30 : 5,
        backgroundColor: colors.colorWhite,
        height: '100%',
    },
    splashContainer: {
        paddingTop: 50,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.colorWhite,
    }

});