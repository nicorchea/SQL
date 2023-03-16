import { Component } from "react";
import { View, StyleSheet, Text, Alert, Image, TouchableNativeFeedback, TextInput, Modal, NativeAppEventEmitter, InteractionManager } from "react-native";
import date from "date-and-time";

import * as Api from "../Api";
import { Colors, HttpCode, Styles } from "../Utils";
import { AppButton } from "../components/Button";

export default class MarkEntryScreen extends Component {
    state = { loaded: false, item: {}, modalShown: false, name: '', site: '', password: '', state: '' };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const code = this.props.route.params.code;

        Api.getItem(code).then(response => {
            if (response.status === HttpCode.Ok) {
                this.setState({ item: response.data, loaded: true });
            }
        }).catch(error => {
            Alert.alert("Error al intentar obtener la información del item",
                error.message);
        });
    }

    showPinModal(value) {
        this.setState({ modalShown: value });
    }

    processMark() {
        const code = this.state.item.code;
        const { name, site, password, state } = this.state;

        if (name === '') {
            Alert.alert("Ingrese un nombre", "Falta el campo nombre");
            this.showPinModal(false);
            return;
        }

        if (site === '' && state === 'out') {
            Alert.alert("Ingrese un destino", "Falta el campo destino");
            this.showPinModal(false);
            return;
        }

        const updateInfo = {
            by: name,
            state: state,
            site: state === 'in' ? 'none' : site,
        };

        Api.updateItemState(code, updateInfo, password).then(response => {
            if (response.status === HttpCode.Ok) {
                this.props.navigation.navigate('Home');
            }
        }).catch(error => {
            Alert.alert("Hubo un error al marcar el item", error.message);
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.loaded !== this.state.loaded ||
            nextState.modalShown !== this.state.modalShown;
    }

    render() {
        if (!this.state.loaded) {
            return (<Text>Cargando datos...</Text>);
        }

        const item = this.state.item;
        const formatDate = date.format(new Date(item.date), "DD MMM YYYY");
        const itemIn = item.state === 'in';

        return (
            <View style={Styles.basicView}>
                <Text style={Styles.title}>{item.name}</Text>
                <Text style={[Styles.subtitle, { color: Colors.muted, marginBottom: 8 }]}>{item.code}</Text>

                <TextInput placeholder="Persona" style={Styles.textInput}
                    onChangeText={text => this.setState({ name: text })}></TextInput>

                {itemIn && <TextInput placeholder="Destino" style={[Styles.textInput, { marginTop: 8 }]}
                    onChangeText={text => this.setState({ site: text })}></TextInput>}

                <Image style={styles.image} source={{ uri: item.image }} />

                <View style={{ marginVertical: 16 }}>
                    {item.by !== 'none' &&
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 20, color: Colors.muted }}>Registrado por:</Text>
                            <Text style={{ fontSize: 20, color: Colors.font }}>{item.by}</Text>
                        </View>}

                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 20, color: Colors.muted }}>Fecha:</Text>
                        <Text style={{ fontSize: 20, color: Colors.font }}>{formatDate}</Text>
                    </View>

                    {item.site !== 'none' && <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 20, color: Colors.muted }}>Ultimo lugar:</Text>
                        <Text style={{ fontSize: 20, color: Colors.font }}>{item.site}</Text>
                    </View>}
                </View>

                <AppButton
                    text={itemIn ? 'Marcar salida' : 'Marcar entrada'}
                    textColor='#fff'
                    onPress={() => {
                        this.showPinModal(true);
                        this.setState({ state: (itemIn ? 'out' : 'in') });
                    }}
                    style={styles.registerButton}
                    bgColor={itemIn ? Colors.out : Colors.home}
                />

                <Modal visible={this.state.modalShown} animationType="slide" onRequestClose={() => this.setState({ modalShown: false })}>
                    <View style={Styles.centeredView}>
                        <TextInput placeholder="Código" style={[Styles.textInput, { width: '100%', elevation: 4 }]} keyboardType='number-pad'
                            onChangeText={text => this.setState({ password: text })} />

                        <AppButton text={'Registrar cambios'} bgColor={Colors.primary} textColor={'#fff'} style={{ width: '100%', marginTop: 8 }} onPress={() => this.processMark()} />
                    </View>
                </Modal>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 300,
        alignSelf: "center",
        marginTop: 8
    },
    registerButton: {
        marginTop: 'auto'
    }
});