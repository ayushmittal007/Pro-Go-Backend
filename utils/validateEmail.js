function validateEmail(email){
    let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    result = mailformat.test(email);
    return result;
}

module.exports = validateEmail