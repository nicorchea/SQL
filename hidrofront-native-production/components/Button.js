import { StyleSheet, View, TouchableNativeFeedback, Text } from "react-native";
import { Colors } from "../Utils";

const AppButton = ({ text, content = null, textColor = Colors.font, bgColor = '#fff', style = {}, onPress }) => {
    return (
        <View style={[styles.view, style, { backgroundColor: bgColor }]}>
            <TouchableNativeFeedback onPress={onPress} background={TouchableNativeFeedback.Ripple('#d9d9d9', false)}>
                <View style={{ width: '100%' }}>
                    <Text style={[styles.text, { color: textColor }]}>{content === null ? text : content}</Text>
                </View>
            </TouchableNativeFeedback>
        </View >

    );
};

const styles = StyleSheet.create({
    view: {
        borderRadius: 999,
        overflow: 'hidden'
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: "center",
        padding: 4
    }
});

export { AppButton };