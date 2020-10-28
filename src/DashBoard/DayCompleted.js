import React from 'react';
import { View, Text, StyleSheet, Platform, Dimensions, Image, SafeAreaView } from 'react-native';
import { Button } from 'react-native-elements'
import { NavigationActions, StackActions } from "react-navigation";

let colors = require('../Themes/Color');

const width = Dimensions.get('window').width;

export default class DayCompleted extends React.Component {


    static navigationOptions = {
        headerShown: false,
    };

    render() {
        return (
            <View style={styles.container}>

                <View style={{ flex: 2, width: '100%', alignItems: 'center', justifyContent: "center" }}>
                    <Image
                        style={{ width: width / 2, height: width / 2 }}
                        source={require('../../assets/img_tick.png')}
                    />
                </View>
                <View style={{ flex: 1, width: '100%', alignItems: 'center', }}>
                    <Image
                        style={{ width: '80%', height: 100 }}
                        resizeMode='contain'
                        source={require('../../assets/img_congrats.png')}
                    />
                    <Text style={{ fontSize: 20 }}>
                        You are done for the day.
                    </Text>
                </View>

                <View style={{ flex: 1, width: '100%', alignItems: 'center', flexDirection: 'column-reverse', paddingBottom: 20 }}>
                    <Button
                        onPress={() => {
                            const resetAction = StackActions.reset({
                                index: 0,
                                actions: [NavigationActions.navigate({ routeName: 'HomeScreen' })],
                                key: null
                            });
                            this.props.navigation.dispatch(resetAction);
                        }}
                        containerStyle={{ width: "85%", borderRadius: 4 }}
                        buttonStyle={{ backgroundColor: colors.colorPrimary, borderRadius: 4 }}
                        titleStyle={{ fontSize: 20 }}
                        title="OK"
                    />
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.colorWhite,
    },
})