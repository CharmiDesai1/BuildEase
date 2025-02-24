class Developer {
    constructor(developer_id, full_name, email, password_hash) {
        this.developer_id = developer_id;
        this.full_name = full_name;
        this.email = email;
        this.password_hash = password_hash;
    }
}

module.exports = Developer;
