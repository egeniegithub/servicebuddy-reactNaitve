import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    Platform,
    StatusBar,
    Dimensions
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

const deviceWidth = Dimensions.get('window').width;
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
        headerShown: false,
    };

    async componentDidMount() {
        await this._retrieveData();
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
        const { email, password } = this.state;
        let userObject = {
            email: email,
            password: password,
        };
        try {
            await AsyncStorage.setItem('isLogin', 'true');
            await AsyncStorage.setItem('user_id', result.data.user_id.toString());
            await AsyncStorage.setItem('token', result.token.toString());
            await AsyncStorage.setItem('userObject', JSON.stringify(userObject));
        } catch (error) {
            console.log("Error While Saveing Data");
        }
    };

    _retrieveData = async () => {
        try {
            const value = await AsyncStorage.getItem('isLogin');
            if (value !== null) {
                // this.props.navigation.navigate('HomeScreen');
                if (value == 'true') {
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
        const { email, password } = this.state;
        this.setState({ dialogVisible: true }, () => {
            if (!email || !password) {
                this.setState({
                    dialogVisible: false
                }, () => {
                    setTimeout(() => {
                        alert('Please fill both fileds.')
                    }, 100);
                });
            } else {
                doLogin(this.state.email, this.state.password, (result) => {
                    if (result.status == 'success') {
                        this.setState({ dialogVisible: false });
                        this._setLogin(result);
                    } else {
                        this.setState({ dialogVisible: false });
                        alert(result.message);
                        console.log("error Message.. : " + result.message);
                        console.log(result);
                    }
                });
            }
        });
    }

    _setLogin = (result) => {
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
            <View style={{ flex: 1 }}>
                <View style={styles.container}>
                    {(this.state.nextScreen) ?
                        <Animatable.View animation="fadeInUpBig" duration={800} >
                            <View style={styles.splashContainer}>
                                <Image source={require('../../assets/logo.png')}
                                    style={{ width: 150, height: 150, marginTop: 8 }} />
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

                                {(this.state.login) ? null :
                                    <View style={{
                                        marginRight: 40,
                                        marginLeft: 40,
                                    }}>
                                        <Input
                                            containerStyle={{ width: deviceWidth - 50, height: 60, marginTop: 8 }}
                                            inputStyle={{ marginLeft: 10, }}
                                            placeholder='johndoe@gmail.com'
                                            disabled={false}
                                            leftIcon={
                                                <Icon
                                                    name='user'
                                                    size={24}
                                                    color='black'
                                                />
                                            }
                                            selectionColor={colors.colorPrimary}
                                            onChangeText={(email) => this.setState({ email })}
                                        />

                                        <Input
                                            containerStyle={{ width: deviceWidth - 50, height: 60, marginTop: 5, }}
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
                                            selectionColor={colors.colorPrimary}
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
                                            containerStyle={{ width: deviceWidth - 100, marginTop: 20, alignSelf: "center" }}
                                            buttonStyle={{ backgroundColor: colors.colorPrimary, borderRadius: 30, height: 40 }}
                                            titleStyle={{ fontSize: 20 }}
                                            title="Login"
                                        />
                                    </View>
                                }
                            </View>
                        </Animatable.View>
                        : null}
                </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: (Platform.OS === 'ios') ? 40 : 15,
        backgroundColor: colors.colorWhite,
        alignItems: 'center'
    },
    splashContainer: {
        flex: 1,
        alignItems: 'center',
    }

});