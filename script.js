const noteInput = document.getElementById('noteInput');
const imageInput = document.getElementById('imageInput');
const audioInput = document.getElementById('audioInput');
const addButton = document.getElementById('addButton');
const wall = document.getElementById('wall');
const langSelector = document.getElementById('langSelector');

function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    notes.forEach(note => {
        createNote(note.text, note.image, note.audio);
    });
}

function saveNotes() {
    const notes = Array.from(wall.children).map(note => {
        const text = note.querySelector('.note-text')?.innerText || '';
        const img = note.querySelector('img')?.src || '';
        const audio = note.querySelector('audio')?.src || '';
        return { text, image: img, audio: audio };
    });
    localStorage.setItem('notes', JSON.stringify(notes));
}

function createNote(text, imageSrc = '', audioSrc = '') {
    const note = document.createElement('div');
    note.className = 'note';

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '🗑️';
    deleteButton.className = 'delete-button';
    deleteButton.onclick = () => {
        note.remove();
        saveNotes();
    };

    const noteText = document.createElement('div');
    noteText.className = 'note-text';
    noteText.innerText = text;

    note.appendChild(deleteButton);
    note.appendChild(noteText);

    if (imageSrc) {
        const img = document.createElement('img');
        img.src = imageSrc;
        img.style.maxWidth = '100%';
        img.style.marginTop = '10px';
        note.appendChild(img);
    }

    if (audioSrc) {
        const audio = document.createElement('audio');
        audio.src = audioSrc;
        audio.controls = true;
        audio.style.marginTop = '10px';
        note.appendChild(audio);
    }

    wall.appendChild(note);
}

function readFile(file, callback) {
    const reader = new FileReader();
    reader.onload = function(event) {
        callback(event.target.result);
    };
    reader.readAsDataURL(file);
}

addButton.addEventListener('click', () => {
    const text = noteInput.value.trim();
    const imageFile = imageInput.files[0];
    const audioFile = audioInput.files[0];

    if (!text && !imageFile && !audioFile) {
        alert('Por favor agrega un texto, imagen o audio.');
        return;
    }

    if (imageFile) {
        readFile(imageFile, (imageSrc) => {
            createNote(text, imageSrc, '');
            saveNotes();
        });
    } else if (audioFile) {
        readFile(audioFile, (audioSrc) => {
            createNote(text, '', audioSrc);
            saveNotes();
        });
    } else {
        createNote(text, '', '');
        saveNotes();
    }

    noteInput.value = '';
    imageInput.value = '';
    audioInput.value = '';
});

langSelector.addEventListener('change', () => {
    const lang = langSelector.value;
    document.querySelector('h1').innerText = lang === 'en' ? 'My Personal Wall' : 'Mi Muro Personal';
    noteInput.placeholder = lang === 'en' ? 'Write a note...' : 'Escribe una nota...';
    addButton.innerText = lang === 'en' ? 'Add' : 'Agregar';
});

loadNotes();