import { View, StyleSheet, Text, TextInput, Image, Alert, TouchableNativeFeedback, Modal } from "react-native";
import { Component } from 'react';
import * as ImagePicker from 'expo-image-picker';

import * as Api from "../Api";
import { alertHome, HttpCode, Colors, Styles } from "../Utils";
import { AppButton } from "../components/Button";

export default class NewEntryScreen extends Component {
    state = { name: '', image: null, password: '', modalShown: false }

    constructor(props) {
        super(props);
    }

    async pickImage() {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1]
        });

        if (!result.cancelled) {
            this.setState({ image: result });
        }
    }

    registerItem() {
        const { name, image, password } = this.state;
        const code = this.props.route.params.code;

        if (name === '' || image == null || code == '' || typeof (code) !== "string") {
            Alert.alert("No ingreso todos los datos necesarios", "Vuelva a revisar la información"); //TODO: mover este checkeo a antes de apretar el boton de registrar
            this.showPinModal(false);
            return;
        }

        const info = {
            name: name,
            code: code,
            image: image == null ? {} : image.uri,
            by: 'none',
            state: 'in',
            site: 'none'
        };

        Api.registerItem(info, password).then(response => {
            if (response.status === HttpCode.Created) {
                this.props.navigation.navigate('Home');
            }
        }).catch(error => {
            Alert.alert("Hubo un error al registrar el item", error.message);
        });
    }

    showPinModal(value) {
        this.setState({ modalShown: value });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.image !== this.state.image ||
            nextState.modalShown !== this.state.modalShown;
    }

    render() {
        const code = this.props.route.params.code;

        return (
            <View style={Styles.basicView}>
                <Text style={styles.header}>Ingreso de nuevo item</Text>
                <Text style={styles.subtitle}>{code}</Text>

                <TextInput placeholder="Nombre" onChangeText={text => this.setState({ name: text })} style={[Styles.textInput, { marginBottom: 16 }]} />

                <Image source={this.state.image ? { uri: this.state.image.uri } : require("../assets/image-placeholder.jpg")} style={styles.image} />

                <View style={{ marginTop: 16 }} >
                    <AppButton onPress={() => this.pickImage()} text={!this.state.image ? 'Tomar foto' : 'Tomar otra foto'}
                        textColor={Colors.primary} bgColor={'#fff'} style={{ elevation: 2, marginBottom: 8 }} />

                    <AppButton onPress={() => this.showPinModal(true)} text={'Registrar item'} textColor='whitesmoke' bgColor={Colors.primary} style={{ elevation: 2 }} />
                </View>

                <Modal visible={this.state.modalShown} animationType="slide" onRequestClose={() => this.setState({ modalShown: false })}>
                    <View style={Styles.centeredView}>
                        <TextInput placeholder="Código" style={[Styles.textInput, { width: '100%', elevation: 4 }]} keyboardType='number-pad'
                            onChangeText={text => this.setState({ password: text })} />

                        <AppButton text={'Registrar cambios'} bgColor={Colors.primary} textColor={'#fff'} style={{ width: '100%', marginTop: 8 }}
                            onPress={() => this.registerItem()} />
                    </View>
                </Modal>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    header: {
        fontSize: 34,
        color: Colors.font,
        textAlign: "center"
    },
    subtitle: {
        fontSize: 20,
        color: Colors.muted,
        textAlign: "center",
        marginBottom: 16
    },
    button: {
        borderRadius: 999,
        padding: 8,
        elevation: 2,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
        letterSpacing: 0.25,
        textAlign: "center"
    }, image: {
        width: '100%',
        height: 300,
    }
});