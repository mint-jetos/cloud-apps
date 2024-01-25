let baseUrl = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));

function copyToClipboard(str) {
    var $temp = $("<textarea>");
    $("body").append($temp);
    $temp.val(str).select();
    document.execCommand("copy");
    $temp.remove();
}

var qrcode = new QRCode(document.getElementById("qrcode"), {
    text: window.location.href,
    width: 128,
    height: 128,
    correctLevel: QRCode.CorrectLevel.H
});

function copyData() {
    copyToClipboard($("#data").val());
    $("#data").css("background-color", "#ffffcc");
    $("#saving").html("Copied").fadeIn();
    setTimeout(function() {
        $("#data").css("background-color", "#f8f8f8");
        $("#saving").fadeOut();
    }, 2000);
}

function refreshPage() {
    window.location.reload();
}

function redirectToBaseUrl() {
    window.location.href = window.location.origin + baseUrl;
}


// Get the necessary elements
const saveBtn = document.getElementById('save-btn');
const cloudSaveBtn = document.getElementById('cloud-save-btn');
const textAreasContainer = document.getElementById('text-areas');
const hiddenDiv = document.getElementById('hidden-div');

// Global variable to keep track of the currently active note container
let activeNoteContainer = null;

// Global variable to keep track of the editing status
let isEditing = false;
//**************************************************************//
// Function to create a note container                       //
//**************************************************************//
function createnoteContainer(note) {
    // Create a new div element
    const newDiv = document.createElement('div');
    newDiv.innerText = note; // Set the text content of the new div

    // Create a new copy button
    const copyBtn = document.createElement('button');
    copyBtn.textContent = '📋'; // Set the text content of the copy button
    copyBtn.className = 'copy-btn';
    copyBtn.style.display = 'none'; // Hide the copy button initia

    // Create a new edit button
    const editBtn = document.createElement('button');
    editBtn.textContent = '✏️'; // Set the text content of the edit button
    editBtn.className = 'edit-btn';
    editBtn.style.display = 'none'; // Hide the edit button initia

    // Create a new delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️'; // Set the text content of the delete button
    deleteBtn.className = 'delete-btn';
    deleteBtn.style.display = 'none'; // Hide the delete button initially

    // Create a new save button
    const saveBtn = document.createElement('button');
    saveBtn.textContent = '💾'; // Set the text content of the save button
    saveBtn.className = 'add-btn';
    saveBtn.style.display = 'none'; // Hide the save button initially

    copyBtn.addEventListener('click', function() {
    // When the copy button is clicked, copy the text to the clipboard
    navigator.clipboard.writeText(newDiv.innerText)
        .then(() => {
            console.log('Text copied to clipboard');
        })
        .catch((error) => {
            console.error('Error copying text: ', error);
        });
    });

    editBtn.addEventListener('click', function() {
        // When the edit button is clicked, replace the div with a textarea
        const editArea = document.createElement('textarea');
        editArea.value = newDiv.innerText;  // Get the text content of the divv
        editArea.rows = 3;
        noteContainer.replaceChild(editArea, newDiv);
        // Hide the edit button and show the save and delete buttons
        copyBtn.style.display = 'none';
        editBtn.style.display = 'none';
        saveBtn.style.display = 'inline';
        deleteBtn.style.display = 'inline';

        // Set editing to true
        isEditing = true;
    });

    saveBtn.addEventListener('click', function() {
        // When the save button is clicked, replace the textarea with a div
        newDiv.innerText = document.querySelector('#text-areas textarea').value; // Set the text content of the div
        noteContainer.replaceChild(newDiv, document.querySelector('#text-areas textarea'));
        // Hide the save and delete buttons
        saveBtn.style.display = 'none';
        deleteBtn.style.display = 'none';

        // Show the copy button
        copyBtn.style.display = 'inline';

        // Clear the active note container
        activeNoteContainer = null;

        // Set editing to false
        isEditing = false;
    });

    deleteBtn.addEventListener('click', function() {
        // When the delete button is clicked, confirm the deletion
        if (confirm('Are you sure you want to delete this note?')) {
            // If the user confirmed, remove the note container
            textAreasContainer.removeChild(noteContainer);
            isEditing = false;
        }
    });

    // Create a new note container
    const noteContainer = document.createElement('div');
    noteContainer.setAttribute('draggable', 'true');
    noteContainer.setAttribute('id', Math.random().toString(36).substring(2)); // Assign a random ID

    noteContainer.className = 'note-container';
 // Show the edit button when the note container is clicked
    noteContainer.addEventListener('click', function() {
        // If editing is active, return
        if (isEditing) {
            return;
        }

        // If there is an active note container and it's not the current one, hide its edit button
        if (activeNoteContainer && activeNoteContainer !== noteContainer) {
            activeNoteContainer.querySelector('.edit-btn').style.display = 'none';
            activeNoteContainer.querySelector('.copy-btn').style.display = 'none';
        }

        // Set the current note container as the active one
        activeNoteContainer = noteContainer;

        // Show the edit button and hide the copy button
        editBtn.style.display = 'inline';
        copyBtn.style.display = 'inline';
    });

    noteContainer.addEventListener('dragstart', function (e) {
        e.dataTransfer.setData('text/plain', e.target.id);
    });

    noteContainer.addEventListener('dragover', function (e) {
        e.preventDefault();
    });

    noteContainer.addEventListener('drop', function (e) {
        e.preventDefault();
        const draggedId = e.dataTransfer.getData('text/plain');
        const draggedEl = document.getElementById(draggedId);
        const dropTarget = e.target.closest('.note-container');
        textAreasContainer.insertBefore(draggedEl, dropTarget.nextSibling);
    });


    // Create a div to group the buttons
    const btnGroup = document.createElement('div');
    // Append the buttons to the button group
    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(copyBtn); 
    btnGroup.appendChild(deleteBtn);
    btnGroup.appendChild(saveBtn);


    // Append the new div and the button group to the note container
    noteContainer.appendChild(newDiv);
    noteContainer.appendChild(btnGroup);

    return noteContainer;
}

//**************************************************************//
// Load notes from the hidden div when the page is loaded    //
//**************************************************************//
const hiddenDivData = JSON.parse(hiddenDiv.innerHTML || '{}');  // Load notes from the hidden div when the page is loaded
hiddenDiv.innerHTML = '';                                       //Clear the hidden div
const savedHiddenDiv = hiddenDivData.notes || [];               // Retrieve the 'notes' array from the parsed data
for (const note of savedHiddenDiv) {
    const noteContainer = createnoteContainer(note);
    textAreasContainer.appendChild(noteContainer);
}
localStorage.setItem('notes', JSON.stringify(savedHiddenDiv));  // Save the data to localStorage

//**************************************************************//
// Attach event listener to the save button                     //
//**************************************************************//
saveBtn.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent page refresh on form submission

    // Get the entered text
    const textArea = document.querySelector('#blog-form textarea');
    const enteredText = textArea.value; // Removed .trim()

    // Check if the text is not empty
    if (enteredText.length > 0) {
        const noteContainer = createnoteContainer(enteredText);
        textAreasContainer.appendChild(noteContainer);

        // Clear the entered text
        textArea.value = "";
    }
});

//**************************************************************//
// Attach event listener to the cloud save button               //
//**************************************************************//
cloudSaveBtn.addEventListener('click', function() {
    // Gather the current state of the webpage
    const notes = Array.from(textAreasContainer.children)
        .map(noteContainer => noteContainer.querySelector('div').innerText);

    // // Save the data to localStorage
    localStorage.setItem('notes', JSON.stringify(notes));

    // Save the data to the hidden div
    // hiddenDiv.dataset.notes = JSON.stringify(notes);

    // Create an object to store the data elements
    const payload = {
        endpoint: window.location.pathname.split("/").pop(),
        notes: notes
    };

    // Send the data to the server
    fetch(baseUrl + '/save_to_cloud', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
          if (response.ok) {
              cloudSaveBtn.classList.add('dark-green');
              setTimeout(function() {
                cloudSaveBtn.classList.remove('dark-green');
              }, 500);
          } else {
            console.log('Error saving data');
          }
        })
        .catch(error => console.log('Error:', error));

});
