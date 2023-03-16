import { Component, Fragment } from "react";
import { View, Text, TextInput, Modal, Alert, StyleSheet, Image } from "react-native";
import { Colors, Styles, HttpCode } from "../Utils";
import * as Api from "../Api";
import { AppButton } from "../components/Button";

export default class InfoScreen extends Component {
    state = { modalShown: false, password: '' };

    deleteItem(code) {
        Api.deleteItem(code, this.state.password).then(response => {
            if (response.status === HttpCode.Ok) {
                console.log('eliminado')
                this.props.navigation.navigate('Home');
            }
        }).catch(error => {
            Alert.alert("Hubo un error al eliminar el item", error.message);
        });
    }

    render() {
        const item = this.props.route.params.data;

        return (
            <View style={Styles.basicView}>
                <Text style={Styles.title}>{item.name}</Text>
                <Text style={[Styles.subtitle, { color: Colors.muted, marginBottom: 8 }]}>{item.code}</Text>

                <Image style={styles.image} source={{ uri: item.image }} />

                <View style={{ marginVertical: 16 }}>
                    {item.by !== 'none' &&
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 20, color: Colors.muted }}>Registrado por:</Text>
                            <Text style={{ fontSize: 20, color: Colors.font }}>{item.by}</Text>
                        </View>}

                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 20, color: Colors.muted }}>Fecha:</Text>
                        <Text style={{ fontSize: 20, color: Colors.font }}>{item.info.formatDate}</Text>
                    </View>

                    {item.site !== 'none' && <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 20, color: Colors.muted }}>Ultimo lugar:</Text>
                        <Text style={{ fontSize: 20, color: Colors.font }}>{item.site}</Text>
                    </View>}
                </View>

                <AppButton text={'Eliminar'} bgColor={Colors.danger} textColor='#fff' style={{ elevation: 2, marginTop: 'auto' }}
                    onPress={() => this.setState({ modalShown: true })} />

                <Modal visible={this.state.modalShown} animationType="slide" onRequestClose={() => this.setState({ modalShown: false })}>
                    <View style={Styles.centeredView}>
                        <TextInput placeholder="Código" style={[Styles.textInput, { width: '100%', elevation: 4 }]} keyboardType='number-pad'
                            onChangeText={text => this.setState({ password: text })} />

                        <AppButton text={'Registrar cambios'} bgColor={Colors.primary} textColor={'#fff'} style={{ width: '100%', marginTop: 8 }}
                            onPress={() => this.deleteItem(item.code)} />
                    </View>
                </Modal>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 300,
        alignSelf: "center",
        marginTop: 8
    }
});