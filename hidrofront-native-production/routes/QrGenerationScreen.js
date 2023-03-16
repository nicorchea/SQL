import { Component } from "react";
import { View, TextInput } from "react-native";
import QRCode from 'react-native-qrcode-svg';
import { AppButton } from "../components/Button";

import { Styles, Colors } from "../Utils";

export default class QrGenerationScreen extends Component {
    state = {
        code: 'default'
    }

    handleTextInput(input) {
        if (input === '')
            return;

        this.setState({ code: input });
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <View style={Styles.basicView}>
                <TextInput placeholder="Identificador" style={[Styles.textInput, { marginBottom: 16 }]} onChangeText={text => this.handleTextInput(text)} />
                <View style={{ alignSelf: 'center' }}>
                    <QRCode value={this.state.code} size={320} />
                </View>

                <AppButton text='Generar código' bgColor={'#fff'} textColor={Colors.primary} style={{ elevation: 2, marginTop: 'auto' }} onPress={() => this.forceUpdate()} />
                <AppButton text='Compartir código' bgColor={Colors.primary} textColor='whitesmoke' style={{ elevation: 2, marginTop: 8 }} />
            </View>
        );
    }
}