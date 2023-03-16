import { StatusBar, Text, View, FlatList, Image, TouchableNativeFeedback, TextInput, Alert, StyleSheet, Modal } from 'react-native';
import React, { Component, Fragment } from 'react';
import ScanModal from '../components/ScanModal';
import Ionicons from '@expo/vector-icons/Ionicons';
import date from "date-and-time";
import { useNavigation } from "@react-navigation/native";

import * as Api from '../Api';
import { Colors, HttpCode, Styles } from '../Utils';
import { WARNING_TIME_MAX } from '@env';
import { AppButton } from '../components/Button';

export default class HomeScreen extends Component {
    searchInput = null;

    state = {
        itemArray: [],
        showScan: false,
        searchQuery: '',
        searchFilter: 'all'
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.navigation.addListener('focus', (e) => {
            this.fetchAndUpdate();
        });

        this.fetchAndUpdate();
    }

    fillItemInfo(item) {
        const formatDate = date.format(new Date(item.date), "DD MMM YYYY");
        const relativeDate = Math.floor(date.subtract(new Date(), new Date(item.date)).toDays());
        const isDateOverdue = relativeDate >= WARNING_TIME_MAX;
        const inStorage = item.state === 'in';

        item.info = {
            relativeDate: relativeDate,
            formatDate: formatDate,
            dateOverdue: isDateOverdue,
            inStorage: item.state == 'in',
            hasWarning: !inStorage && isDateOverdue
        }
    }

    fetchAndUpdate() {
        console.log("fetching remote data");
        Api.getItemList().then(response => {
            if (response.status === HttpCode.Ok) {
                let items = response.data;

                items.forEach(item => this.fillItemInfo(item));

                this.setState({ itemArray: response.data });
            }
        }).catch(error => {
            Alert.alert("Hubo un error al intentar acceder a la base de datos",
                `Si este problema persiste contacte un desarollador\n\n${error.message}`,
                [{ text: "Reintentar", onPress: () => this.fetchAndUpdate() }]);
        });
    }

    processScan(data) {
        this.setState({ showScan: false });

        Api.processQrCode(data).then(response => {
            if (response.status === HttpCode.Ok) {
                const found = response.data.exists;
                this.props.navigation.navigate(found ? 'MarkEntry' : 'NewEntry', { code: data });
            }
        }).catch(error => {
            Alert.alert("Hubo un error al buscar el código", error.message);
        });
    }

    processFilters() {
        const searchQuery = this.state.searchQuery.toLowerCase(); 300
        const searchFilter = this.state.searchFilter;

        let newItemArray = this.state.itemArray;

        console.log(`processing filters ${searchQuery} ${searchFilter} ${newItemArray.length}`);

        if (searchQuery !== '') {
            newItemArray = newItemArray.filter(item => item.name.toLowerCase().includes(searchQuery));
        }

        if (searchFilter === 'all') {
            return newItemArray;
        }

        newItemArray = newItemArray.filter(item => {
            if (searchFilter !== 'time')
                return item.state === searchFilter;

            return item.info.hasWarning;
        });

        return newItemArray;
    }

    render() {
        let filteredItems = this.processFilters();

        return (
            <View style={Styles.basicView}>
                <StatusBar />

                <View style={{ flexDirection: 'row' }}>
                    <TextInput placeholder='Buscar' style={[Styles.textInput, { flex: 1 }]} onChangeText={text => this.setState({ searchQuery: text })} ref={elem => this.searchInput = elem} />
                    <AppButton
                        content={<Ionicons name="qr-code" size={24} color={Colors.primary} />}
                        onPress={() => this.props.navigation.navigate('QrGenerator')}
                        style={inputsStyle.generateQrButton}
                    />

                </View>

                <View style={inputsStyle.filtersView}>
                    <AppButton
                        content={<Ionicons name="time" size={24} color={Colors.time} />}
                        style={{ flex: 1, elevation: 2, alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => this.setState({ searchFilter: 'time' })}
                    />

                    <AppButton
                        content={<Ionicons name="home" size={24} color={Colors.home} />}
                        style={{ flex: 1, elevation: 2, alignItems: 'center', justifyContent: 'center', marginHorizontal: 8 }}
                        onPress={() => this.setState({ searchFilter: 'in' })}
                    />

                    <AppButton
                        content={<Ionicons name="exit" size={24} color={Colors.out} />}
                        style={{ flex: 1, elevation: 2, alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => this.setState({ searchFilter: 'out' })}

                    />

                    <AppButton
                        content={<Ionicons name="close-outline" size={24} color={Colors.muted} />}
                        style={{ flex: 1, elevation: 2, alignItems: 'center', justifyContent: 'center', marginLeft: 8, maxWidth: 30 }}
                        onPress={() => {
                            this.setState({ searchFilter: 'all', searchQuery: '' });
                            this.searchInput.clear();
                        }}
                    />
                </View>

                <FlatList data={filteredItems}
                    keyExtractor={(_, index) => index}
                    renderItem={({ item }) => (<ListItem item={item} />)}
                />

                <MainQRButton onPress={() => this.setState({ showScan: true })} />

                <Modal animationType="slide"
                    visible={this.state.showScan}
                    onRequestClose={() => this.setState({ showScan: false })}>
                    <ScanModal
                        onScan={code => this.processScan(code)}
                        isVisible={this.state.showScan}
                    />
                </Modal>
            </View>
        );
    }
}

const ListItem = ({ item }) => {
    const info = item.info;
    const badgeColor = info.inStorage ? Colors.home : (info.dateOverude ? Colors.time : Colors.out);
    const navigation = useNavigation();

    return (
        <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#d9d9d9', false)}
            onPress={() => navigation.navigate('InfoScreen', { data: item })}>
            <View style={listStyle.container}>
                <Image style={listStyle.image} source={{ uri: item.image }} />

                <View>
                    <Text style={{ fontSize: 20, color: Colors.font }}>{item.name}</Text>
                    {item.by !== 'none' && (
                        <Fragment>
                            <Text style={listStyle.infoText}>{info.inStorage ? 'Ingresado' : 'Retirado'} por {item.by}</Text>
                            <Text style={[listStyle.infoText, { color: (info.hasWarning ? Colors.danger : Colors.muted) }]}>Hace {info.relativeDate} días</Text>
                        </Fragment>
                    )}
                </View>

                <View style={[listStyle.badge, { backgroundColor: badgeColor }]}></View>
            </View>
        </TouchableNativeFeedback>
    );
};

const MainQRButton = ({ onPress }) => (
    <TouchableNativeFeedback onPress={onPress}>
        <View style={qrButtonStyle.container}>
            <Ionicons name="qr-code-outline" size={64} color='whitesmoke' />
        </View>
    </TouchableNativeFeedback >
);

const inputsStyle = StyleSheet.create({
    filtersView: {
        flexDirection: "row",
        justifyContent: 'space-between',
        marginVertical: 8,
    },
    generateQrButton: {
        textAlign: "center",
        justifyContent: 'center',
        marginLeft: 4,
        width: 40,
        height: 40,
        borderRadius: 999,
        elevation: 2,
    },
});

const listStyle = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingRight: 8,
        marginBottom: 8,
        borderRadius: 8,
        elevation: 2,
    },
    image: {
        width: 90,
        height: 90,
        marginRight: 8,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8
    },
    badge: {
        marginLeft: 'auto',
        marginRight: 16,
        color: '#000',
        textAlign: 'center',
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    infoText: { color: Colors.muted, fontSize: 16 }
});

const qrButtonStyle = StyleSheet.create({
    container: {
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
        marginTop: 8,
        borderRadius: 8,
    },
});