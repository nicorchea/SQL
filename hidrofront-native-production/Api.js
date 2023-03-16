import axios from "axios";
import { SERVER_ADDRESS } from '@env';

const API_ADDRESS = SERVER_ADDRESS.toString();

function getItemList() {
    return axios.get(API_ADDRESS + 'list');
}

function getItem(codeString) {
    return axios.get(API_ADDRESS + 'item', { params: { code: codeString } });
}

function processQrCode(codeString) {
    return axios.get(API_ADDRESS + 'check', { params: { code: codeString } });
}

function registerItem(item, _password) {
    return axios.post(API_ADDRESS + 'register', item, { params: { password: _password } });
}

function updateItemState(_code, data, _password) {
    return axios.post(API_ADDRESS + 'update', data, { params: { code: _code, password: _password } });
}

function deleteItem(_code, _password) {
    return axios.get(API_ADDRESS + 'delete', { params: { code: _code, password: _password } });
}

export { getItemList, processQrCode, registerItem, getItem, updateItemState, deleteItem };