const texts = require('./texts');
const routes = require('./routes');
const config = require('./config');
const fetch = require('node-fetch');

const Model = class {

    constructor(texts, routes, config) {
        this.texts = texts;
        this.routes = routes;
        this.config = config;
        this.metalsId = [959, 961, 962, 964];
        this.famousCurrId = [643, 840, 978];
    }

    async run(userData, req) {

        // Save user request
        this.saveUserData(userData);

        // Execute method by route
        let route = req.input;
        if (!this.routes[route]) {
            return this.routeNotFind();
        }
        let message = await this[this.routes[route]]();

        return {chatId: this.chatId, message: message}
    }

    saveUserData(userData) {
        this.userData = userData;
        this.chatId = userData.chat.id;
        this.userName = userData.from.first_name;
    }

    routeNotFind() {
        return {chatId: this.chatId, message: this.texts['routeNotFind']}
    }

    getInstructions() {
        return this.texts['instructions'];
    }

    getWelcomeMessage() {
        return this.renderMessage({name: this.userName}, this.texts.welcomeText)
    }

    async getFamousCurrencies() {

        let data = await this.getDataFromApi();
        if (!data) return this.texts['error'];

        let famousArr = [], famousText = '';
        for (let item of data) {
            if (this.famousCurrId.includes(item.r030)) {
                famousArr.push({name: item.txt, rate: item.rate});
            }
        }

        famousArr = famousArr.sort((a, b) => a.name.localeCompare(b.name, 'ua'));

        for (let item of famousArr) {
            famousText += `${item.name} - ${item.rate}\n`;
        }

        return famousText;

    }

    async getAllCurrencies() {

        let data = await this.getDataFromApi();
        if (!data) return this.texts['error'];

        let currenciesArr = [], metalsArr = [], currenciesText = '', metalsText = ''; 
        for (let item of data) {
            if (this.metalsId.includes(item.r030)) {
                metalsArr.push({name: item.txt, rate: item.rate});
            } else {
                currenciesArr.push({name: item.txt, rate: item.rate});
            }
        }

        currenciesArr = currenciesArr.sort((a, b) => a.name.localeCompare(b.name, 'ua'));
        metalsArr = metalsArr.sort((a, b) => a.name.localeCompare(b.name, 'ua'));

        for (let item of currenciesArr) {
            currenciesText += `${item.name} - ${item.rate}\n`;
        }

        for (let item of metalsArr) {
            metalsText += `${item.name} - ${item.rate}\n`;
        }

        return this.renderMessage({currencies: currenciesText, metals: metalsText}, this.texts['liveall']);

    }

    async getMetals() {

        let data = await this.getDataFromApi();
        if (!data) return this.texts['error'];

        let metalsArr = [], metalsText = '';
        for (let item of data) {
            if (this.metalsId.includes(item.r030)) {
                metalsArr.push({name: item.txt, rate: item.rate});
            }
        }

        metalsArr = metalsArr.sort((a, b) => a.name.localeCompare(b.name, 'ua'));

        for (let item of metalsArr) {
            metalsText += `${item.name} - ${item.rate}\n`;
        }

        return metalsText;

    }

    async getDataFromApi() {
        try {
            let result = await fetch(this.config.api_url)
            return result.json();
        } catch (error) {
            return false;
        }
    }

    renderMessage(data, string) {
        for (let key in data) {
            string = string.replace(`{${key}}`, data[key]);
        }
        return string;
    }

}

module.exports = new Model(texts, routes, config);