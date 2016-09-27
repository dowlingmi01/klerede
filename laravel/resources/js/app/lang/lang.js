var _lang = {};
_lang['user_not_found'] = "Error: user not found.";
_lang['invalid_credentials'] = "Invalid credentials.";
_lang['could_not_reset_password'] = "Could not reset your password.";
_lang['could_not_reset_password'] = "Could not reset your password.";

module.exports = function(key){
    if (_lang[key]) {
        return _lang[key]
    }
    return key;
};
