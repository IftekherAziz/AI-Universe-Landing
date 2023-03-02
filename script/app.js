const loadPhones = async (searchText, dataLimit) => {
    // Get the JSON data from the API
    const url = `https://openapi.programming-hero.com/api/phones?search=${searchText}`;
    const res = await fetch(url);
    const data = await res.json();

    // Display the phones
    displayPhones(data.data, dataLimit);
};

const displayPhones = (phones, dataLimit) => {
    // console.log(phones);
    const phonesContainer = document.getElementById("phones-container");
    phonesContainer.textContent = "";

    // Display 10 phones only: - (Not perfect way)
    const loadMore = document.getElementById("load-more");
    if (dataLimit && phones.length > 6) {
        phones = phones.slice(0, 6);
        loadMore.classList.remove("d-none");
    } else {
        loadMore.classList.add("d-none");
    }

    // Display not found:
    const notFoundMessage = document.getElementById("not-found-message");
    if (phones.length === 0) {
        notFoundMessage.classList.remove("d-none");
    } else {
        notFoundMessage.classList.add("d-none");
    }

    // Display all phones in UI:
    phones.forEach((phone) => {
        const phoneDiv = document.createElement("div");
        phoneDiv.classList.add("col");
        phoneDiv.innerHTML = `
    <div class="card">
      <img src="${phone.image}" class="card-img-top" alt="...">
      <div class="card-body bg-secondary-subtle">
        <h5 class="card-title">${phone.phone_name}</h5>
        <p class="card-text"><b>Brand: </b>${phone.brand}</p>
        <p class="card-text">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        <button onclick="loadPhoneDetails('${phone.slug}')" heref="#" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#phoneDeatailModal">More Deatails</button>
    </div>`;
        phonesContainer.appendChild(phoneDiv);
    });

    // Stop loader:
    toggleSpinner(false);
};

const handleSearch = (dataLimit) => {
    // Start loader:
    toggleSpinner(true);
    const searchInput = document.getElementById("search-input");
    const searchText = searchInput.value;
    loadPhones(searchText, dataLimit);
};

// Handdle search button:
document.getElementById("btn-search").addEventListener("click", function () {
    handleSearch(10);
});

// Handdle Enter key:
document.getElementById("search-input").addEventListener("keypress", function (event) {
    // console.log(event.key);
    if (event.key === "Enter") {
        handleSearch(10);
    }
});

// Handle Remove key:
document.getElementById("search-input").addEventListener("keyup", function (event) {
    const searchValue = document.getElementById('search-input').value;
    if (searchValue === '') {
        loadPhones("nova");
    }
    else if (event.key === "Backspace") {
        handleSearch();
    }

});

// Handdle Spinner:
const toggleSpinner = (isLoading) => {
    const loaderSection = document.getElementById("loader");
    if (isLoading) {
        loaderSection.classList.remove("d-none");
    } else {
        loaderSection.classList.add("d-none");
    }
};

// not the best way to laod show all:
document.getElementById("btn-load-more").addEventListener("click", function () {
    handleSearch();
});

// Load Phone Details:
const loadPhoneDetails = async (id) => {
    const url = `https://openapi.programming-hero.com/api/phone/${id}`;
    const res = await fetch(url);
    const data = await res.json();
    displayPhoneDeatails(data.data);
}

const displayPhoneDeatails = (phone) => {
    // console.log(phone);
    const modalTitle = document.getElementById("phoneDeatailModalLabel");
    modalTitle.innerText = phone.name;
    const phoneDetails = document.getElementById("phone-details");
    phoneDetails.innerHTML = `
    <p>Release Date: ${phone.releaseDate ? phone.releaseDate : 'No date found'}</p>
    <p>Others: ${phone.others ? phone.others.Bluetooth : 'No bluetooth info'}</p>

    `;
}

// Load phones by default:
loadPhones("apple");

