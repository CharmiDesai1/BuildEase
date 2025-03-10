class User {
    constructor(user_id, full_name, email, password_hash) {
        this.user_id = user_id;
        this.full_name = full_name;
        this.email = email;
        this.password_hash = password_hash;
    }
}

module.exports = User;
