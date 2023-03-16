import { Alert, StyleSheet } from "react-native";

function connectionLostAlert(navigation) {
    alertHome("Se perdió la conexión con el servidor", "Asegurese de estar conectado a la misma red que este", navigation);
}

function alertHome(title, description, navigation) {
    Alert.alert(
        title,
        description,
        [{ text: "Aceptar", onPress: () => navigation.navigate('Home') }]
    );
}

function alertBasic(title, description) {
    Alert.alert(
        title,
        description,
        [{ text: "Aceptar" }]
    );
}

const HttpCode = {
    Continue: 100,
    SwitchingProtocols: 101,
    Processing: 102,
    EarlyHints: 103,
    Ok: 200,
    Created: 201,
    Accepted: 202,
    NonAuthoritativeInformation: 203,
    NoContent: 204,
    ResetContent: 205,
    PartialContent: 206,
    MultiStatus: 207,
    AlreadyReported: 208,
    ImUsed: 226,
    MultipleChoices: 300,
    MovedPermanently: 301,
    Found: 302,
    SeeOther: 303,
    NotModified: 304,
    UseProxy: 305,
    Unused: 306,
    TemporaryRedirect: 307,
    PermanentRedirect: 308,
    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    ProxyAuthenticationRequired: 407,
    RequestTimeout: 408,
    Conflict: 409,
    Gone: 410,
    LengthRequired: 411,
    PreconditionFailed: 412,
    PayloadTooLarge: 413,
    UriTooLong: 414,
    UnsupportedMediaType: 415,
    RangeNotSatisfiable: 416,
    ExpectationFailed: 417,
    ImATeapot: 418,
    MisdirectedRequest: 421,
    UnprocessableEntity: 422,
    Locked: 423,
    FailedDependency: 424,
    TooEarly: 425,
    UpgradeRequired: 426,
    PreconditionRequired: 428,
    TooManyRequests: 429,
    RequestHeaderFieldsTooLarge: 431,
    UnavailableForLegalReasons: 451,
    InternalServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
    HttpVersionNotSupported: 505,
    VariantAlsoNegotiates: 506,
    InsufficientStorage: 507,
    LoopDetected: 508,
    NotExtended: 510,
    NetworkAuthenticationRequired: 511,
}

const Colors = {
    primary: '#339af0',
    font: '#404040',
    muted: 'darkgray',
    home: '#28a745',
    homeMuted: '#ace3b9',
    out: '#fcc419',
    outMuted: '#ffe9a6',
    time: '#7950f2',
    danger: '#dc3545'
};

const Styles = StyleSheet.create({
    textInput: {
        paddingHorizontal: 12,
        paddingLeft: 16,
        paddingVertical: 6,
        backgroundColor: '#fff',
        elevation: 2,
        fontSize: 18,
        borderRadius: 999,
    },
    basicView: {
        flex: 1,
        margin: 8
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        margin: 8
    },
    subtitle: {
        fontSize: 20,
        textAlign: 'center',
        color: Colors.font
    },
    title: {
        fontSize: 38,
        textAlign: 'center',
        color: Colors.font
    },
});


export { connectionLostAlert, alertHome, alertBasic, HttpCode, Colors, Styles }