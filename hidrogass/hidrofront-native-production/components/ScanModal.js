import { Component } from "react";
import { View, StyleSheet } from "react-native";
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Styles } from "../Utils";

export default class ScanModal extends Component {
    componentDidMount() {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
        };

        getBarCodeScannerPermissions();
    }

    handleBarCodeScanned = ({ type, data }) => {
        this.props.onScan(data);
    };

    render() {
        return (
            <View style={Styles.centeredView}>
                <BarCodeScanner
                    onBarCodeScanned={!this.props.isVisible ? undefined : this.handleBarCodeScanned}
                    style={StyleSheet.absoluteFillObject}
                />
            </View>
        );
    }
}