// variables
const form = document.querySelector('.main-form');
const submitBtn = document.querySelector('.submit-btn')
const titleInputElement = document.querySelector('#title')
const descriptionInputElement = document.querySelector('#description')
const noteContainer = document.querySelector('.note-list-container')

let noteNum = getNoteNum();
console.log(noteNum)
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
        noteNum++
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
        addToLocalStorage(uniqueId, title, description);
        addNoteNumLocalStorage(noteNum)
        console.log(getNoteNum())

        setBackToDefault()
    }
    else if (title && description && isEditing === true) {
        editElementTitle.innerText = titleInputElement.value
        editElementDescription.innerText = descriptionInputElement.value
        editElementTitle.parentElement.scrollIntoView();
        editFromLocalStorage(editID, editElementTitle.innerText, editElementDescription.innerText)
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
    addNoteNumLocalStorage(noteNum)
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
function addToLocalStorage(uniqueId, title, description) {
    let notesObj = { uniqueId, title, description };
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

function addNoteNumLocalStorage(num) {
    let noteNum = getNoteNum()
    noteNum = num
    localStorage.setItem('noteNum', JSON.stringify(noteNum))
}

function getNoteNum() {
    return JSON.parse(localStorage.getItem('noteNum')) || 0
}


function editFromLocalStorage(id, title, description) {
    let noteArr = getFromLocalStorage()
    noteArr = noteArr.map(note => {
        if (note.uniqueId === id) {
            note.title = title
            note.description = description
        }
        return note
    })
    localStorage.setItem('notes', JSON.stringify(noteArr));
}

// load starting
function load() {
    let noteArr = getFromLocalStorage();
    let noteNumber = 1;
    noteArr.forEach(singleNote => {
        const element = document.createElement('section')
        element.classList.add('note');
        let uniqueCode = document.createAttribute('data-id')
        uniqueCode.value = singleNote.uniqueId
        element.setAttributeNode(uniqueCode)

        element.innerHTML = `
        <p class="note-num label">Note <span class="num">${noteNumber}</span></p>
        <p class = "label">Title</p>
                <p class="note-title" data-title='${singleNote.uniqueId}'>${singleNote.title}</p>
                <p class = "label">Notes</p>
                <p class="note-description" data-description='${singleNote.uniqueId}'>${singleNote.description}</p>
                <div class="btn-container">
                    <button class="delete btn">Delete</button>
                    <button class="edit btn">Edit</button>
                </div>
        `
        noteNumber++
        noteContainer.appendChild(element)
        const deleteButton = element.querySelector('.delete')
        deleteButton.addEventListener('click', deleteNote)

        const editButton = element.querySelector('.edit')
        editButton.addEventListener('click', editNote)
    })

}

// console.log(getFromLocalStorage());