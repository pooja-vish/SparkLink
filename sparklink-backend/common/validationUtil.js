const express = require('express');

function isConsecSplChar(input) {
    const pattern = /[^A-Za-z0-9\s][^A-Za-z0-9\s]/;

    return pattern.test(input);
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

function isValidDate(inputDate) {
    const currentDate = new Date().toISOString().split("T")[0];

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