exports.isNullOrEmpty = (value) => {
    return (!value || value == undefined || value == "" || value.length == 0 || value.trim());
}