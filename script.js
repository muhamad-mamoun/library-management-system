import { Book } from "./book.js";

let inputValidationStatus = [false, false, false, false, false];
let currentBooksCounter = 0;
let booksTotalNumber = 0;
let booksData = [];
////////////////////////////////////////////
(function () {
    const mouseDivElement = document.getElementById("mouse-pointer");
    document.body.addEventListener("mousemove", ({ pageX: xCoord, pageY: yCoord }) => {
        mouseDivElement.style.left = `${xCoord}px`;
        mouseDivElement.style.top = `${yCoord}px`;
    })

    document.body.addEventListener("mouseenter", () => {
        mouseDivElement.style.display = "block";
    })

    document.body.addEventListener("mouseleave", () => {
        mouseDivElement.style.display = "none";
    })

    document.body.addEventListener("mouseover", ({ target: targetElement }) => {
        mouseDivElement.style.display = (targetElement.tagName == "INPUT") ? "none" : "block";
    })
})();

window.validateInput = function (callerElement, validationType = 0) {
    const validationImageElement = document.getElementsByClassName("validation-image");
    const elementOffset = callerElement.getAttribute("id");
    let validationStatus = false;

    switch (validationType) {
        case 0 /* Number */: validationStatus = numberValidation(callerElement); break;
        case 1 /* Name   */: validationStatus = nameValidation(callerElement); break;
        case 2 /* Email  */: validationStatus = emailValidation(callerElement); break;
        case 3 /* Date   */: validationStatus = dateValidation(callerElement); break;
    }

    if (validationStatus) {
        validationImageElement[elementOffset].setAttribute("src", "./resources/check-circle.svg");
        callerElement.style.border = "0px";
    } else {
        validationImageElement[elementOffset].setAttribute("src", "./resources/x-circle.svg");
        callerElement.style.border = "2px solid rgba(255, 0, 0, 0.8)";
    }

    validationImageElement[elementOffset].style.display = "inline";
    return validationStatus;
}

function numberValidation(callerElement) {
    return (parseInt(callerElement.value) > 0);
}

function nameValidation(callerElement) {
    const nameRegex = /^[a-zA-Z\ ]{3,}$/;
    return (nameRegex.test(callerElement.value));
}

function emailValidation(callerElement) {
    const emailRegex = /^[a-zA-Z1-9\ '._]+@[a-zA-Z\-]{3,}.[a-zA-Z]{2,}$/;
    return (emailRegex.test(callerElement.value));
}

function dateValidation(callerElement) {
    const dateRegex = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    return (dateRegex.test(callerElement.value));
}

window.submitBooksCount = function (submitEvent) {
    const inputElement = document.getElementById("0");
    submitEvent.preventDefault();

    if (validateInput(inputElement, 0)) {
        booksTotalNumber = parseInt(inputElement.value);
        localStorage.setItem("booksTotalNumber", booksTotalNumber);
        document.getElementById("books-count-view").style.display = "none";
        document.getElementById("data-input-view").style.display = "flex";
    }
}

window.submitBookData = function (submitEvent) {
    if (currentBooksCounter !== (booksTotalNumber - 1)) {
        submitEvent.preventDefault();

        const inputElements = document.getElementsByClassName("book-data-input");
        inputValidationStatus[0] = validateInput(inputElements[0], 1);
        inputValidationStatus[1] = validateInput(inputElements[1], 0);
        inputValidationStatus[2] = validateInput(inputElements[2], 3);
        inputValidationStatus[3] = validateInput(inputElements[3], 1);
        inputValidationStatus[4] = validateInput(inputElements[4], 2);

        if (inputValidationStatus.every((validation) => { return validation === true })) {
            getBookData();
            resetFields();
            console.log("A book has been registered");
        }
    }
}

function getBookData() {
    const bookDataInputElements = document.getElementsByClassName("book-data-input");

    let newBookData = new Book(
        bookDataInputElements[0].value,
        bookDataInputElements[1].value,
        bookDataInputElements[2].value,
        bookDataInputElements[3].value,
        bookDataInputElements[4].value,
    );

    booksData.push(newBookData);

    localStorage[`bookData-${currentBooksCounter}-bookName`] = bookDataInputElements[0].value;
    localStorage[`bookData-${currentBooksCounter}-bookPrice`] = bookDataInputElements[1].value;
    localStorage[`bookData-${currentBooksCounter}-bookPublishDate`] = bookDataInputElements[2].value;
    localStorage[`bookData-${currentBooksCounter}-authorName`] = bookDataInputElements[3].value;
    localStorage[`bookData-${currentBooksCounter}-authorEmail`] = bookDataInputElements[4].value;

    currentBooksCounter++;
}

window.resetFields = function () {
    const validationImageElement = document.querySelectorAll(".validation-image");
    validationImageElement.forEach((element) => { element.style.display = "none" });
    inputValidationStatus.forEach((validation, index) => { inputValidationStatus[index] = false });
    const inputElements = document.querySelectorAll("input[type=\"text\"]");
    inputElements.forEach((element) => {
        element.style.border = "0px";
        element.value = "";
    });
}

window.viewBooksData = function () {
    const tableBody = document.getElementById("data-table-body");
    const newRow = document.createElement("tr");
    booksTotalNumber = localStorage.getItem("booksTotalNumber");

    for (let counter = 0; counter < booksTotalNumber; counter++) {
        newRow.setAttribute("id", `row-${counter}`);
        const bookName = localStorage.getItem(`bookData-${counter}-bookName`);
        const bookPrice = localStorage.getItem(`bookData-${counter}-bookPrice`);
        const bookPublishDate = localStorage.getItem(`bookData-${counter}-bookPublishDate`);
        const authorName = localStorage.getItem(`bookData-${counter}-authorName`);
        const authorEmail = localStorage.getItem(`bookData-${counter}-authorEmail`);
        newRow.innerHTML = `<td>${bookName}</td><td>${bookPrice}</td><td>${bookPublishDate}</td><td>${authorName}</td><td>${authorEmail}</td><td><input type="button" value="Edit" class="data-edit-button" onclick="editBook(${counter})"></button></td><td><input type="button" value="Delete" class="data-delete-button" onclick="deleteBook(${counter})"></button></td>`;
        tableBody.appendChild(newRow.cloneNode(true));
    }
}

window.editBook = function (offset) {
    const rowElement = document.getElementById(`row-${offset}`);
    rowElement.children[0].innerHTML = `<input value="${rowElement.children[0].textContent}" class="book-data-edit" type="text" id="0" name="bookName" onchange="validateInput(this, 1)" placeholder="Ex: JavaScript: The Definitive Guide"><img class="validation-image" src="" alt="Validation Image">`;
    rowElement.children[1].innerHTML = `<input value="${rowElement.children[1].textContent}" class="book-data-edit" type="text" id="1" name="bookPrice" onchange="validateInput(this, 0)" placeholder="Ex: 50$"><img class="validation-image" src="" alt="Validation Image">`;
    rowElement.children[2].innerHTML = `<input value="${rowElement.children[2].textContent}" class="book-data-edit" type="text" id="2" name="bookPublishDate" onchange="validateInput(this, 3)" placeholder="Ex: 31-01-2025"><img class="validation-image" src="" alt="Validation Image">`;
    rowElement.children[3].innerHTML = `<input value="${rowElement.children[3].textContent}" class="book-data-edit" type="text" id="3" name="authorName" onchange="validateInput(this, 1)" placeholder="Ex: David Flanagan"><img class="validation-image" src="" alt="Validation Image">`;
    rowElement.children[4].innerHTML = `<input value="${rowElement.children[4].textContent}" class="book-data-edit" type="text" id="4" name="authorEmail" onchange="validateInput(this, 2)" placeholder="Ex: david.flanagan@example.com"><img class="validation-image" src="" alt="Validation Image">`;
    rowElement.children[5].innerHTML = `<input type="submit" onclick="submitBookDataEdit(${offset})">`;
    rowElement.children[6].innerHTML = ``;
}

window.deleteBook = function (offset) {
    if (confirm("Are you sure you want to delete this book?")) {
        document.getElementById(`row-${offset}`).remove();
    }
}

window.submitBookDataEdit = function (offset) {
    const inputElements = document.getElementsByClassName("book-data-edit");
    inputValidationStatus[0] = validateInput(inputElements[0], 1);
    inputValidationStatus[1] = validateInput(inputElements[1], 0);
    inputValidationStatus[2] = validateInput(inputElements[2], 3);
    inputValidationStatus[3] = validateInput(inputElements[3], 1);
    inputValidationStatus[4] = validateInput(inputElements[4], 2);

    if (inputValidationStatus.every((validation) => { return validation === true })) {
        const rowElement = document.getElementById(`row-${offset}`);

        Array.from(rowElement.children).slice(0, 5).forEach((child) => {
            console.log();
            child.textContent = `${child.children[0].value}`;
        });

        rowElement.children[5].innerHTML = `<input type="button" value="Edit" class="data-edit-button" onclick="editBook(${offset})"></button>`;
        rowElement.children[6].innerHTML = `<input type="button" value="Delete" class="data-delete-button" onclick="deleteBook(${offset})"></button>`;
        console.log("A book has been edited");
    }
}