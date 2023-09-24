// variables
const form = document.querySelector('.main-form');
const submitBtn = document.querySelector('.submit-btn')
const titleInputElement = document.querySelector('#title')
const descriptionInputElement = document.querySelector('#description')
const noteContainer = document.querySelector('.note-list-container')

let noteNum = 1;
let editElementTitle;
let editElementDescription;
let editID = ''
let isEditing = false;

// event listeners
form.addEventListener('submit', addNotes);
window.addEventListener('DOMContentLoaded', load)


// =======================================functions

// Function to add notes
function addNotes(e) {
    e.preventDefault()
    let title = titleInputElement.value
    let description = descriptionInputElement.value
    let uniqueId = new Date().getTime().toString();
    if (title && description && isEditing === false) {
        const element = document.createElement('section')
        element.classList.add('note');
        let uniqueCode = document.createAttribute('data-id')
        uniqueCode.value = uniqueId
        element.setAttributeNode(uniqueCode)

        element.innerHTML = `
        <p class="note-num label">Note <span class="num">${noteNum}</span></p>
        <p class = "label">Title</p>
                <p class="note-title" data-title='${uniqueId}'>${title}</p>
                <p class = "label">Notes</p>
                <p class="note-description" data-description='${uniqueId}'>${description}</p>
                <div class="btn-container">
                    <button class="delete btn">Delete</button>
                    <button class="edit btn">Edit</button>
                </div>
        `
        noteContainer.appendChild(element)
        const deleteButton = element.querySelector('.delete')
        deleteButton.addEventListener('click', deleteNote)

        const editButton = element.querySelector('.edit')
        editButton.addEventListener('click', editNote)

        addToLocalStorage(uniqueId, noteNum, title, description);
        noteNum++
        setBackToDefault()
    }
    else if (title && description && isEditing === true) {
        editElementTitle.innerText = titleInputElement.value
        editElementDescription.innerText = descriptionInputElement.value
        editElementTitle.parentElement.scrollIntoView();
        setBackToDefault()
    }
    else {
        alert('Please Enter Your title and notes')
    }
}

// function to delete the note
function deleteNote(e) {
    let deleteElement = e.currentTarget.parentElement.parentElement;
    let deleteElementId = deleteElement.dataset.id;
    let count = 1;
    noteNum--
    noteContainer.removeChild(deleteElement)
    document.querySelectorAll('.num').forEach(note => {
        note.innerText = count
        count++
    })
    removeFromLocalStorage(deleteElementId)
    setBackToDefault()
}

// function to edit the note
function editNote(e) {
    document.documentElement.scrollTop = 0;
    isEditing = true;
    editID = e.currentTarget.parentElement.parentElement.dataset.id;
    editElementTitle = document.querySelector(`[data-title = '${editID}']`)
    editElementDescription = document.querySelector(`[data-description = '${editID}']`)
    titleInputElement.value = editElementTitle.innerText;
    descriptionInputElement.value = editElementDescription.innerText;
    submitBtn.innerText = 'Edit'
}

// function to make everything to default
function setBackToDefault() {
    editElementTitle;
    editElementDescription;
    editID = ''
    isEditing = false;
    titleInputElement.value = ''
    descriptionInputElement.value = ''
    submitBtn.innerText = 'Add'
}

// local storage
function addToLocalStorage(uniqueId, noteNum, title, description) {
    let notesObj = { uniqueId, noteNum, title, description };
    let noteArr = getFromLocalStorage();
    noteArr.push(notesObj)
    localStorage.setItem('notes', JSON.stringify(noteArr));
}

function getFromLocalStorage() {
    return JSON.parse(localStorage.getItem('notes')) || []
}


function removeFromLocalStorage(id) {
    let noteArr = getFromLocalStorage();
    noteArr = noteArr.filter(note => {
        if (note.uniqueId !== id) {
            return note;
        }
    })
    localStorage.setItem('notes', JSON.stringify(noteArr))
}


// load starting
function load() {
    let noteArr = getFromLocalStorage();
    noteArr.forEach(singleNote => {
        const element = document.createElement('section')
        element.classList.add('note');
        let uniqueCode = document.createAttribute('data-id')
        uniqueCode.value = singleNote.uniqueId
        element.setAttributeNode(uniqueCode)

        element.innerHTML = `
        <p class="note-num label">Note <span class="num">${singleNote.noteNum}</span></p>
        <p class = "label">Title</p>
                <p class="note-title" data-title='${singleNote.uniqueId}'>${singleNote.title}</p>
                <p class = "label">Notes</p>
                <p class="note-description" data-description='${singleNote.uniqueId}'>${singleNote.description}</p>
                <div class="btn-container">
                    <button class="delete btn">Delete</button>
                    <button class="edit btn">Edit</button>
                </div>
        `
        noteContainer.appendChild(element)
        const deleteButton = element.querySelector('.delete')
        deleteButton.addEventListener('click', deleteNote)

        const editButton = element.querySelector('.edit')
        editButton.addEventListener('click', editNote)
    })

}