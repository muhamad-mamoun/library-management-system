import { Author } from "./author.js";

export class Book {
    #name;
    #price;
    #publishDate;
    #author
    constructor(bookName, bookPrice, bookPublishDate, authorName, authorEmail) {
        this.#name = bookName;
        this.#price = bookPrice;
        this.#publishDate = bookPublishDate;
        this.#author = new Author(authorName, authorEmail);
    }
}