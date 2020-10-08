import React from 'react';
import { View, StatusBar } from 'react-native';
import { Header } from 'react-native-elements';
let colors = require('../Themes/Color');

function CustomHeader (props) {
    return (
        <View>
            <StatusBar backgroundColor={colors.colorPrimary} barStyle="light-content" />
                <Header
                    barStyle="light-content"
                    centerComponent={{ text: props.title, style: { color: '#fff', fontSize: 20, fontWeight: '500' } }}
                    rightComponent={props.rightComponent}
                    leftComponent={props.leftComponent}
                    containerStyle={[{
                        backgroundColor: colors.colorPrimary,

                    }, (Platform.OS === 'ios') ? null : { height: 70 }]}

                />
        </View>
    )
}

export default CustomHeader;