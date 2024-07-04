// Déclarations des variables
const sendBtn = document.querySelector("#send");
const eMailDom = document.querySelector('#destEmail');
const eMailListDom = document.querySelector('.email-list');
const eMailAddDom = document.querySelector('.email-add');
const sourceEmailDom = document.querySelector('#sourceEmail');
const fichierDom = document.querySelector("#fichier");
const weburl = document.getElementById('weburl').value;

// Vérifie si l'email est correct
const isEmailValid = (email) => {
    return email.toLowerCase().match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

// Défini l'URL et le formulaire
const url = weburl + `/src/upload.php`;
const form = document.querySelector('form');

function isEmptyFile() {
    const file = document.getElementById('fichier');

    if (file.files.length == 0) {
        $('#modalEmptyFile1').modal('show');
    }
}

function updateFileName() {
    const input = document.getElementById('fichier');
    const label = document.getElementById('fileNameLabel');
    const files = input.files;

    if (files.length === 0) {
        label.textContent = 'Choisir des fichiers';
    } else if (files.length === 1) {
        label.textContent = files[0].name;
    } else {
        let fileNameString = '';
        for (let i = 0; i < files.length; i++) {
            fileNameString += files[i].name;
            if (i !== files.length - 1) {
                fileNameString += ', ';
            }
        }
        label.textContent = fileNameString;
    }
}

/**
 * Evènements
 */
form.addEventListener('change', (event) => {
    event.preventDefault();

    // if emails and files are all filled enable
    destEmail = document.querySelector('.email-list').childNodes.length > 0 ? true : false

    enableSendBtn();
});

form.addEventListener('click', async (event) => {
    if (event.target.className === 'email-add') {
        if (isEmailValid(eMailDom.value)) {
            eMailListUpdate(event);
        } else {
            eMailDom.reportValidity();
        }

        enableSendBtn();
        return;
    }

    if (event.target.className === 'email-del') {
        event.target.parentNode.remove();
        eMailCountDomUpdate();
        enableSendBtn();
        return;
    }

    if (event.target.type === 'submit') {
        // Déclaration des variables    
        const destEmail = [...document.querySelector('.email-list').childNodes].map((value) => {
            return [...value.childNodes][0].textContent;
        });
        const files = document.querySelector('[type=file]').files;
        const formData = new FormData();

        formData.append('destEmail', destEmail);
        formData.append('sourceEmail', sourceEmailDom.value);

        // Ajoute chaque fichier dans la variable files
        for (let i = 0; i < files.length; i++) {
            let file = files[i]
            formData.append('files[]', file);
        }

        await fetch(url, {
            method: 'POST',
            body: formData,
        }).then((response) => {
            console.log(response)
        })

        resetForm();
        displaySpinner();
        isEmptyFile();
        return;
    }
});

// `Enter` event add email to list
eMailDom.addEventListener('keydown', (event) => {
    if (event.code === 'Enter' && isEmailValid(eMailDom.value)) {
        eMailListUpdate(event);
    } else if (event.code === 'Enter') {
        eMailDom.reportValidity();
    }
    enableSendBtn();
});

// Effet du nom du site
document.addEventListener('DOMContentLoaded', () => {
    const spans = document.querySelectorAll('.backgroundText span');

    spans.forEach((span, index) => {
        setTimeout(() => {
            span.classList.add('active');
        }, (index + 1) * 250); // L'ajustement du délai d'animation pour chaque span
    });
});

// updade list email
function eMailListUpdate(event) {
    let eMailDiv = document.createElement('div');
    eMailDiv.textContent = eMailDom.value;

    let eMailDel = document.createElement('div');
    eMailDel.setAttribute('class', 'email-del');
    eMailDel.textContent = '❌';

    let eMailWrap = document.createElement('div');
    eMailWrap.setAttribute('class', 'email-wrap');
    eMailWrap.append(eMailDiv, eMailDel);

    eMailListDom.append(eMailWrap);

    eMailCountDomUpdate();

    eMailDom.value = '';
}

// update eMailCountDom
function eMailCountDomUpdate() {
    document.querySelector('.email-count').parentElement.innerHTML = eMailListDom.childNodes.length > 1 ?
        `Email destinataires: <span class="email-count">${eMailListDom.childNodes.length}</span>` :
        `Email destinataire: <span class="email-count">${eMailListDom.childNodes.length}</span>`;
}

// Reset le formulaire
function resetForm() {
    eMailDom.value = "";
    sourceEmailDom.value = "";
    document.getElementById('fileNameLabel').textContent = "Choisir des fichiers";
    eMailListDom.replaceChildren();
    eMailCountDomUpdate();
}

// Enable btn send
function enableSendBtn() {
    if (fichierDom.files[0] && sourceEmailDom.value && eMailListDom.childNodes.length > 0) {
        sendBtn.disabled = false;
    } else {
        sendBtn.disabled = true;
    }
}