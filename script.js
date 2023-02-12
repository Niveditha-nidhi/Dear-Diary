const pageContainer = document.querySelector('.page__container');
const pageModal = document.querySelector(".page__modal__body");
// global 
let globalStore = [];

// -----------------------------------------------------
// a function for creating a new card
const newCard = ({
	id,
	imageUrl,
	pageTitle,
	pageType,
	pageDescription
}) => `<div class="col-lg-4 col-md-6" id=${id}>
<div class="card m-2">
  <div class="card-header d-flex justify-content-end gap-2">
    <button type="button" class="btn btn-outline-success" id="${id}" onclick="editCard.apply(this, arguments)"><i class="fas fa-pencil-alt" id="${id}" onclick="editCard.apply(this, arguments)"></i></button>
    <button type="button" class="btn btn-outline-danger" id="${id}" onclick="deleteCard.apply(this, arguments)"><i class="fas fa-trash-alt" id="${id}" onclick="deleteCard.apply(this, arguments)"></i></button>
  </div>
  <img
    src=${imageUrl}
    class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">${pageTitle}</h5>
    <p class="card-text">${pageDescription}</p>
    <span class="badge bg-primary">${pageType}</span>
  </div>
  <div class="card-footer text-muted">
    <button type="button" id="${id}" class="btn btn-outline-primary float-end" data-bs-toggle="modal"
    data-bs-target="#showpage" onclick="openpage.apply(this, arguments)">Open page</button>
  </div>
</div>
</div>`;

// --------------------------------------------------
const loadData = () => {

	// access localstorage
	// localStorage.getItem("page") ===  localStorage.page
	const getInitialData = localStorage.page; // if null, then
	if (!getInitialData) return;

	// convert stringified-object to object
	const {
		cards
	} = JSON.parse(getInitialData);

	// map around the array to generate HTML card and inject it to DOM
	cards.map((pageObject) => {
		const createNewpage = newCard(pageObject);
		pageContainer.insertAdjacentHTML("beforeend", createNewpage);
		globalStore.push(pageObject);
	});
};

const updateLocalStorage = () => {
	localStorage.setItem("page", JSON.stringify({
		cards: globalStore
	}))
}

//  function for save changes----------------------------------------

// create a function which will trigerred on clicking on save changes in the modal
const saveChanges = () => {
	const pageData = {
		id: `${Date.now()}`, // generating a unique id for each card
		imageUrl: document.getElementById('imageurl').value,
		pageTitle: document.getElementById('title').value,
		pageType: document.getElementById('type').value,
		pageDescription: document.getElementById('description').value
	};

	const createNewpage = newCard(pageData);
	pageContainer.insertAdjacentHTML("beforeend", createNewpage);

	globalStore.push(pageData);

	//  API  -> add t localStorage
	updateLocalStorage()
	// provide some unique identification, i.e key, here key is "page", 

};

// function for deleting a card -------------------

const deleteCard = (event) => {
	// id
	event = window.event;
	const targetID = event.target.id;
	const tagname = event.target.tagName; // BUTTON OR I

	// assign the same id of card to button also

	// search the globalStore, remove the object which matches with the id
	globalStore = globalStore.filter((pageObject) => pageObject.id !== targetID);

	updateLocalStorage();

	// access DOM to remove them

	if (tagname === "BUTTON") {
		// task__container
		return pageContainer.removeChild(
			event.target.parentNode.parentNode.parentNode // col-lg-4
		);
	}

	// else
	// page__container
	return pageContainer.removeChild(
		event.target.parentNode.parentNode.parentNode.parentNode // col-lg-4
	);
};

// function for editing
const editCard = (event) => {

	event = window.event;
	const targetID = event.target.id;
	const tagname = event.target.tagName;

	let parentElement;
	if (tagname === "BUTTON") {
		parentElement = event.target.parentNode.parentNode;

	} else {
		parentElement = event.target.parentNode.parentNode.parentNode;
	}

	let pageTitle = parentElement.childNodes[5].childNodes[1];
	let pageDescription = parentElement.childNodes[5].childNodes[3];
	let pageType = parentElement.childNodes[5].childNodes[5];
	let submitBtn = parentElement.childNodes[7].childNodes[1];
	// console.log(taskTitle, taskDescription, taskType);

	// setAttributes
	pageTitle.setAttribute("contenteditable", "true");

	pageDescription.setAttribute("contenteditable", "true");
	pageType.setAttribute("contenteditable", "true");
	submitBtn.setAttribute(
		"onclick",
		"saveEditChanges.apply(this, arguments)"
	);
	submitBtn.innerHTML = "Save Changes";

	//  modal removed
	submitBtn.removeAttribute("data-bs-toggle");
	submitBtn.removeAttribute("data-bs-target");

}

const saveEditChanges = (event) => {

	event = window.event;
	const targetID = event.target.id;
	const tagname = event.target.tagName;

	let parentElement;
	if (tagname === "BUTTON") {
		parentElement = event.target.parentNode.parentNode;

	} else {
		parentElement = event.target.parentNode.parentNode.parentNode;
	}

	let pageTitle = parentElement.childNodes[5].childNodes[1];
	let pageDescription = parentElement.childNodes[5].childNodes[3];
	let pageType = parentElement.childNodes[5].childNodes[5];
	let submitBtn = parentElement.childNodes[7].childNodes[1];

	const updatedData = {

		pageTitle: pageTitle.innerHTML,
		pageDescription: pageDescription.innerHTML,
		pageType: pageType.innerHTML,
	}

	// console.log(updatedData);
	globalStore = globalStore.map((page) => {
		if (page.id === targetID) {
			return {
				id: page.id,
				imageUrl: page.imageUrl,
				pageTitle: updatedData.pageTitle,
				pageType: updatedData.pageType,
				pageDescription: updatedData.pageDescription,
			};
		}
		return page; // important statement
	});

	updateLocalStorage();

	pageTitle.setAttribute("contenteditable", "false");

	pageDescription.setAttribute("contenteditable", "false");
	pageType.setAttribute("contenteditable", "false");

	// modal added
	submitBtn.setAttribute("onclick", "openpage.apply(this, arguments)");
	submitBtn.setAttribute("data-bs-toggle", "modal");
	submitBtn.setAttribute("data-bs-target", "#showpage");

	submitBtn.innerHTML = "Open page";

}

const htmlModalContent = ({
	id,
	pageTitle,
	pageDescription,
	imageUrl,
	pageType
}) => {
	const date = new Date(parseInt(id));
	return ` <div id=${id}>
   <img
   src=${imageUrl}
   alt="bg image"
   class="img-fluid place__holder__image mb-3 p-4"
   />
   <div class="text-sm text-muted ">Created on ${date.toDateString()}</div>
   <h2 class="my-5 mt-5" style="display:inline;">${pageTitle}</h2>
   <span class="badge bg-primary">${pageType}</span>
   <p class="lead mt-2">
   ${pageDescription}
   </p></div>`;
};

const openpage = (event) => {

	event = window.event;
	const targetID = event.target.id;

	const getpage = globalStore.filter(({
		id
	}) => id === targetID);
	// console.log(getpage[0]);
	pageModal.innerHTML = htmlModalContent(getpage[0]);
};
