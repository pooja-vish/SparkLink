const express = require('express');

function isConsecSplChar(input) {
    const pattern = /[{}"\\%&'()*+,\-./:;<=>?\[\]|\t\n]+/g;

    let match;
    while ((match = pattern.exec(input)) !== null) {
        if (match[0].length > 1) {
            return false;
        }
    }
    return true;
}

function isValidString(input, minLength, maxLength) {
    if(input.trim().length < minLength || input.trim().length > maxLength) {
        return false;
    }
    return true;
}

function isEmptyString(input) {
    if(input.trim().length === 0) {
        return true;
    }
    return false;
}

function isStrongPassword(input) {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return pattern.test(input);
}

function isInteger(input) {
    const pattern = /^-?\d+$/;
    return pattern.test(input);
}

function doPasswordsMatch(input1, input2) {
    return input1 === input2;
}

function isValidDate(input) {
    const inputDate = new Date(input);
    const currentDate = new Date();

    currentDate.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    return inputDate >= currentDate;
}

module.exports = {
    isConsecSplChar,
    isValidString,
    isEmptyString,
    isStrongPassword,
    isInteger,
    doPasswordsMatch,
    isValidDate
};