export class Author {
    #name;
    #email;
    constructor(authorName, authorEmail) {
        this.#name = authorName;
        this.#email = authorEmail;
    }
    getAuthorName() {
        return this.#name;
    }
    getAuthorEmail() {
        return this.#email;
    }
    setAuthorName(authorName) {
        this.#name = authorName;
    }
    setAuthorEmail(authorEmail) {
        this.#email = authorEmail;
    }
}