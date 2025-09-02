import "./index.css";
import { settings, resetValidation, toggleButtonState, enableValidation } from '../scripts/validation.js';
import { setButtonText } from '../utils/helpers.js';
import Api from '../utils/Api.js';

const images = require.context('../images', false, /\.(svg|jpe?g)$/);

// const initialCards = [
//     {
//         name: "Golden Gate Bridge",
//         link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
//     },
//     {
//         name: "Val Thorens",
//         link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//     },
//     {
//         name: "Restaurant terrace",
//         link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//     },
//     {
//         name: "An outdoor cafe",
//         link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//     },
//     {
//         name: "A very long bridge, over the forest and through the trees",
//         link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//     },
//     {
//         name: "Tunnel with morning light",
//         link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//     },
//     {
//         name: "Mountain house",
//         link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//     },
// ];

const api = new Api({
    baseUrl: "https://around-api.en.tripleten-services.com/v1",
    headers: {
        authorization: "1e20e2ef-1387-4112-bcbf-1a5b3929946c",
        "Content-Type": "application/json"
    }
});

const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector("#profile-name-input");
const editProfileDescriptionInput = editProfileModal.querySelector("#profile-description-input");

const newPostBtn = document.querySelector(".profile__add-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newPostForm = newPostModal.querySelector(".modal__form");
const newPostCardImageInput = newPostModal.querySelector("#card-image-input");
const newPostCaptionDescription = newPostModal.querySelector("#caption-description-input");

const avatarForm = document.querySelector("#edit-avatar-form");
const avatarInput = avatarForm.elements["avatar"];
const avatarSubmitBtn = avatarForm.querySelector(".modal__submit-btn");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

const nameInput = document.getElementById('nameInput');

const newPostImageLink = document.querySelector(".card__image");
const newPostCaption = document.querySelector(".card__title");

const previewModal = document.querySelector("#avatar-modal");
const previewCaption = document.querySelector("#avatar-modal .modal__caption"); // or whatever the correct selector is

const previewImage = document.querySelector("#avatar-modal .modal__image");
const previewCloseBtn = document.querySelector(".modal__close-btn");

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");


const cardTemplate = document.querySelector("#card_template")
    .content.querySelector(".card");

const cardsList = document.querySelector(".cards__list");
const likeButton = document.querySelector(".like-button");

let cardToDelete = null;
let cardToDeleteId = null;
let selectedCard = null;
let selectedCardId = null;

const modals = document.querySelectorAll(".modal");

modals.forEach((modal) => {
    modal.addEventListener("click", (evt) => {
        if (evt.target.classList.contains("modal")) {
            closeModal(modal);
        }
    });
});

function handleLike(evt, id) {
    const likeButton = evt.target;
    const isLiked = likeButton.classList.contains("card__like-btn_active");

    changeLikeStatus(id, !isLiked)
        .then((updatedCard) => {
            likeButton.classList.toggle("card__like-btn_active");
        })
        .catch((err) => {
            console.error("Failed to update like status:", err);
        });
}


function handleEscape(evt) {
    if (evt.key === "Escape") {
        const activeModal = document.querySelector(".modal_is-opened");
        closeModal(activeModal);
    }

};

function handleAvatarSubmit(evt) {
    api
        .editAvatarInfo(avatarInput.value)
        .then((data) => {
            console.log(data.avatar);
        })
        .catch(console.error);
}

function handleDeleteSubmit(evt) {
    evt.preventDefault();

    api
        .deleteCard(selectedCardId)
        .then(() => {
            selectedCard.remove();
            closeModal(deleteModal);
        })
        .catch(console.error);
}

function handleCardClick(cardId) {
    selectedCardId = cardId;
}

const saveBtn = document.getElementById('saveBtn');
const deleteBtn = document.getElementById('deleteBtn');

const profileForm = document.getElementById('profile-form'); // or whatever your form ID is

deleteForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    deleteBtn.textContent = 'Deleting...';
    deleteBtn.disabled = true;

    api.deleteCard(selectedCardId)
        .then(() => {
            if (selectedCard) selectedCard.remove();
            closeModal(deleteModal);
        })
        .catch((err) => {
            console.error('Error deleting card:', err);
            alert('Failed to delete card. Please try again.');
        })
        .finally(() => {
            deleteBtn.textContent = 'Delete';
            deleteBtn.disabled = false;
        });
});

function handleDeleteCard(cardElement, data) {
    selectedCard = cardElement;
    selectedCardId = data._id;
    openModal(deleteModal);
}

function handleImageClick(data) {
    previewImage.src = data.link;
    previewImage.alt = data.name;
    previewCaption.textContent = data.name;
    openModal(previewModal);
}

function getCardElement(data) {

    const cardTemplate = document.querySelector("#card_template");
    const cardElement = cardTemplate.content
        .querySelector(".card")
        .cloneNode(true);

    cardElement.setAttribute("data-id", data._id);


    const cardTitleEl = cardElement.querySelector(".card__title");
    const cardImageEl = cardElement.querySelector(".card__image");
    const likeButton = cardElement.querySelector(".card__like-button");
    const deleteButton = cardElement.querySelector(".card__delete-btn");


    cardImageEl.src = data.link;
    cardImageEl.alt = data.name;
    cardTitleEl.textContent = data.name;

    cardImageEl.addEventListener("click", () => handleImageClick(data));

    const cardList = document.querySelector(".cards__list");

    const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");
    cardLikeBtnEl.addEventListener("click", () => {
        cardLikeBtnEl.classList.toggle("card__like-btn_active");
    });

    deleteButton.addEventListener("click", (evt) => {
        handleDeleteCard(cardElement, data);

        cardToDelete = cardElement;
        cardToDeleteId = data._id;

        openModal(deleteModal);
    });

    const confirmDeleteBtn = document.querySelector("#delete-modal .modal__submit-btn[type='submit']");
    const cancelDeleteBtn = document.querySelector("#delete-modal .modal__submit-btn[type='button']");

    confirmDeleteBtn.addEventListener("click", () => {
        if (cardToDelete) {
            cardToDelete.remove();
            cardToDelete = null;
            closeModal(document.querySelector("#delete-modal"));
        }
    });

    cancelDeleteBtn.addEventListener("click", () => {
        cardToDelete = null;
        closeModal(document.querySelector("#delete-modal"));
    });
    return cardElement;
}


function openModal(modal) {
    modal.classList.add("modal_is-opened");
    document.addEventListener("keydown", handleEscape);
}

function closeModal(modal) {
    modal.classList.remove("modal_is-opened");
    document.removeEventListener("keydown", handleEscape);
}

document.addEventListener("click", function (evt) {
    if (evt.target.classList.contains("card__delete-btn")) {
        openDeleteModal();
    }
});

editProfileBtn.addEventListener("click", () => {
    editProfileNameInput.value = profileNameEl.textContent;
    editProfileDescriptionInput.value = profileDescriptionEl.textContent;
    const inputList = Array.from(editProfileForm.querySelectorAll(settings.inputSelector));
    resetValidation(editProfileForm, inputList, settings);
    openModal(editProfileModal);
})

editProfileCloseBtn.addEventListener("click", () => {

    closeModal(editProfileModal);
});

newPostBtn.addEventListener("click", function () {
    openModal(newPostModal);
})

newPostCloseBtn.addEventListener("click", () => {
    closeModal(newPostModal);
});

function handleEditProfileSubmit(evt) {
    evt.preventDefault();

    const submitButton = evt.submitter;
    setButtonText(submitButton, true);

    const name = editProfileNameInput.value.trim();
    const about = editProfileDescriptionInput.value.trim();

    if (!name || !about) {
        console.error("Name and About fields must not be empty.");
        setButtonText(submitButton, false);
        return;
    }

    api.editUserInfo({ name, about })
        .then((data) => {
            profileNameEl.textContent = data.name;
            profileDescriptionEl.textContent = data.about;
            closeModal(editProfileModal);
        })
        .catch((err) => {
            console.error("Failed to update profile:", err);
        })
        .finally(() => {
            setButtonText(submitButton, false);
        });
}

const cardList = document.querySelector(".cards__list");

function openDeleteModal() {
    const modal = document.getElementById("delete-modal");
    modal.classList.add("modal_is-opened");
}


editProfileForm.addEventListener("submit", handleEditProfileSubmit);

previewCloseBtn.addEventListener("click", function () {
    closeModal(previewModal);
});

newPostForm.addEventListener("submit", function (evt) {
    evt.preventDefault();
    const submitButton = newPostForm.querySelector(".modal__submit-btn");

    const inputValues = {
        name: newPostCaptionDescription.value.trim(),
        link: newPostCardImageInput.value.trim()
    };

    if (!inputValues.name || !inputValues.link) {
        console.error("Both name and image link are required.");
        return;
    }

    setButtonText(submitButton, true);

    api.addCard(inputValues)
        .then((data) => {
            const cardElement = getCardElement(data);
            cardsList.prepend(cardElement);
            closeModal(newPostModal);
            newPostForm.reset();
            const inputList = Array.from(newPostForm.querySelectorAll(settings.inputSelector));
            toggleButtonState(inputList, submitButton, settings);
        })
        .catch((err) => {
            console.error("Failed to add card:", err);
        })
        .finally(() => {
            setButtonText(submitButton, false);
        });
});

api.getInitialCards()
    .then((cards) => {
        cards.forEach((item) => {
            console.log('Card item:', item);
            const cardElement = getCardElement(item);
            cardsList.append(cardElement);
        });
    })
    .catch(console.error);

document.addEventListener("click", (evt) => {
    if (evt.target.classList.contains("card__delete-btn")) {
        const cardElement = evt.target.closest(".card");
        const cardId = cardElement?.dataset.id;

        if (!cardId) {
            console.error("Card ID not found");
            return;
        }

        cardToDelete = cardElement;
        cardToDeleteId = cardId;

        openDeleteModal();
    }
});

deleteForm.addEventListener("submit", handleDeleteSubmit);

enableValidation(settings);