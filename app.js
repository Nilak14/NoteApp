// variables
const form = document.querySelector('.main-form');
const submitBtn = document.querySelector('.submit-btn')
const titleInputElement = document.querySelector('#title')
const descriptionInputElement = document.querySelector('#description')
const noteContainer = document.querySelector('.note-list-container')

let editElement;
let editID = ''
let isEditing = false;
// event listeners
form.addEventListener('submit', addNotes);



// functions
function addNotes(e) {
    e.preventDefault()
}