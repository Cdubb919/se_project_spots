import {settings, resetValidation, toggleButtonState} from './validation.js';

const initialCards = [
    {
        name: "Golden Gate Bridge",
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
    },
    {
        name: "Val Thorens",
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
    },
    {
        name: "Restaurant terrace",
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
    },
    {
        name: "An outdoor cafe",
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
    },
    {
        name: "A very long bridge, over the forest and through the trees",
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
    },
    {
        name: "Tunnel with morning light",
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
    },
    {
        name: "Mountain house",
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
    },
];

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

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

const newPostImageLink = document.querySelector(".card__image");
const newPostCaption = document.querySelector(".card__title");

const previewModal = document.querySelector("#preview-modal");
const previewImage = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__caption");
const previewCloseBtn = previewModal.querySelector(".modal__close-btn");

const cardTemplate = document.querySelector("#card_template")
    .content.querySelector(".card");

const cardsList = document.querySelector(".cards__list");

const modals = document.querySelectorAll('.modal');

modals.forEach((modal) => {
    modal.addEventListener('click', (evt) => {
        if (evt.target.classList.contains('modal')) {
            closeModal(modal);
        }
    });
});

function handleEscape(evt) {
    if (evt.key === "Escape") {
        const activeModal = document.querySelector(".modal_is-opened");
        closeModal(activeModal);
    }

};

function getCardElement(data) {
    const cardElement = cardTemplate.cloneNode(true);
    const cardTitleEl = cardElement.querySelector(".card__title");
    const cardImageEl = cardElement.querySelector(".card__image");

    cardImageEl.src = data.link;
    cardImageEl.alt = data.name;
    cardTitleEl.textContent = data.name;
    cardImageEl.addEventListener("click", () => {
        previewImage.src = data.link;
        previewImage.alt = data.name;

        previewCaption.textContent = data.name;

        openModal(previewModal);
    });

    const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");
    cardLikeBtnEl.addEventListener("click", () => {
        cardLikeBtnEl.classList.toggle("card__like-btn_active");
    });

    const cardDeleteBtnEl = cardElement.querySelector(".card__delete-btn");
    cardDeleteBtnEl.addEventListener("click", () => {
        cardElement.remove();
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

editProfileBtn.addEventListener("click", function () {
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
    profileNameEl.textContent = editProfileNameInput.value;
    profileDescriptionEl.textContent = editProfileDescriptionInput.value;
    closeModal(editProfileModal);
};

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

previewCloseBtn.addEventListener("click", function () {
    closeModal(previewModal);
});

newPostForm.addEventListener("submit", function (evt) {
    evt.preventDefault();
    const submitButton = newPostForm.querySelector(".modal__submit-btn");
 
    const inputValues = {
        name: newPostCaptionDescription.value,
        link: newPostCardImageInput.value
    };

    const cardElement = getCardElement(inputValues);
    cardsList.prepend(cardElement);

    closeModal(newPostModal);
    newPostForm.reset();
    const inputList = Array.from(newPostForm.querySelectorAll(settings.inputSelector));
    toggleButtonState(inputList, submitButton, settings);
});

initialCards.forEach(function (item) {
    const cardElement = getCardElement(item);
    cardsList.append(cardElement);
});