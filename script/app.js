/**
 * It fetches data from the url, then converts it to json, then passes it to the displayData function.
 */

const loadData = async (showAll, sort) => {
    const url = `https://openapi.programming-hero.com/api/ai/tools`;
    const res = await fetch(url);
    const data = await res.json();
    displayData(data.data.tools, showAll, sort);
};

/* -------------------------------------------------------------------------------------------------------- */

/**
 * It takes the data from the API and displays it on the page.
 * @param data - the data we are getting from the API
 */

const displayData = (data, showAll, sort) => {
    const dataContainer = document.getElementById('data-container');
    // Display only 6 data and show the Load More button:
    const showAllSection = document.getElementById('show-all');
    dataContainer.innerHTML = '';
    if (!showAll) {
        data = data.slice(0, 6);
        showAllSection.classList.remove('d-none');
    }
    else {
        showAllSection.classList.add('d-none');
    }

    if (sort) {
        console.log(data);
        data.sort((a, b) => new Date(a.published_in) - new Date(b.published_in))
    }

    data.forEach(tool => {
        // Destructuring the data:
        const { image, features, name, published_in, id } = tool;
        // Creating a div element:
        const div = document.createElement('div');
        // Adding the col class to the div element:
        div.classList.add('col');
        // Adding the HTML to the div element:
        div.innerHTML = `
        <div class="card rounded-lg">
                       <img style="height:250px!important;" src="${image}" class="card-img-top p-3 border border-0 rounded-lg" alt="Image">
                       <div class="card-body">
                            <h5 class="card-title">Features</h5>
                                ${makeFeatures(tool)}
                            <hr>
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 class="card-title">${name}</h5>
                                    <i class="fa-regular fa-calendar-minus"></i>
                                    <span>${published_in}</span>
                                </div>
                                <div class=" d-flex justify-content-center align-items-center" ">
                                   <button class="border-0 rounded-circle"><i onclick="displayModal('${id}')" data-bs-toggle="modal" data-bs-target="#modalDetails" style="color:#F29393!important;" class="fa-solid fa-arrow-right" "></i> </button>
                                     
                                </div>
                            </div>
                        </div>
                    </div>
        `;
        // Appending the div element to the dataContainer element:
        dataContainer.appendChild(div);

    })
    // Stop loader:
    toggleSpinner(false);
};

/* -------------------------------------------------------------------------------------------------------- */

/* Adding an event listener to the button with the id of btn-show-all. When the button is clicked, it
calls the loadMore function. */

document.getElementById('btn-show-all').addEventListener('click', () => {
    toggleSpinner(true);
    const sortByDate = document.getElementById('sort-by-date').innerText === 'Refresh' ? true : false;
    loadData(true, sortByDate);
});

/* -------------------------------------------------------------------------------------------------------- */

/**
 * If the isLoading parameter is true, then remove the d-none class from the loaderSection element.
 * Otherwise, add the d-none class to the loaderSection element
 * @param isLoading - A boolean value that indicates whether the spinner should be shown or hidden.
 */

const toggleSpinner = (isLoading) => {
    const loaderSection = document.getElementById("loader");
    if (isLoading) {
        loaderSection.classList.remove("d-none");
    }
    else {
        loaderSection.classList.add("d-none");
    }
};


/**
 * It loops through the features array and creates a string of HTML that is returned.
 * @returns A string of HTML.
 */
const makeFeatures = data => {
    let featureHtml = '';
    for (let i = 1; i <= data.features.length; i++) {
        featureHtml += `
        <p><span>${i}. </span>${data?.features[i - 1]}</p>
      `;
    }
    return featureHtml;
}

/* -------------------------------------------------------------------------------------------------------- */

/**
 * It takes an id as an argument, then fetches the data from the API, and then displays the modal
 * details.
 */
const displayModal = id => {

    const url = `https://openapi.programming-hero.com/api/ai/tool/${id}`;
    fetch(url)
        .then(res => res.json())
        .then(data => displayModalDetails(data.data));

}

/* -------------------------------------------------------------------------------------------------------- */

/**
 * It takes in a data object, creates a div element, adds the container class to the div element, adds
 * the HTML to the div element, and appends the div element to the modalBody element.
 * @param data - The data object that contains the data for the modal.
 */
const displayModalDetails = (data) => {
    console.log(data);
    // Get the modal body:
    const modalBody = document.getElementById('modalContainer');
    // Clear the modal body:
    modalBody.innerHTML = '';
    // Destructuring the data:
    const { pricing, integrations, description, features, accuracy, image_link, input_output_examples } = data;
    // Creating a div element:
    const modalContainer = document.createElement('div');
    // Adding the container class to the div element:
    modalContainer.classList.add('container');
    // Adding the HTML to the div element:
    modalContainer.innerHTML = `
                                <div class="row g-3">
                                    <div class="col-sm-12 col-md-12 col-lg-7">
                                        <div style="background-color: #FEF7F7;;"
                                            class=" rounded-lg border border-gray">
                                            <h6 class="p-4">${description ? description : 'No Information'}</h6>
                                            <div class="container text-center px-4">
                                                <div class="row gap-2 mb-3">
                                                    <div class="col rounded bg-white p-2  fw-bold text-success ">
                                                        <p class="p-0 m-0">${pricing ? pricing[0].price : 'Free of Cost'}</p>
                                                         <p class="p-0 m-0">${pricing ? pricing[0].plan : 'Free'}</p>
                                                    </div>
                                                    <div class="col rounded bg-white p-2 fw-bold text-warning ">
                                                        <p class="p-0 m-0">${pricing ? pricing[1].price : 'Free of Cost'}</p>
                                                        <p class="p-0 m-0">${pricing ? pricing[1].plan : 'Free'}</p>                                                       
                                                    </div>
                                                    <div class="col rounded bg-white p-2 fw-bold text-danger ">
                                                        <p class="p-0 m-0">${pricing ? pricing[2].price.slice(0, 10) : 'Free of Cost'}</p>
                                                        <p class="p-0 m-0">${pricing ? pricing[2].plan : 'Free'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="container px-3">
                                                <div class="row gap-2 mb-3">
                                                    <div class="col">
                                                        <h5>Features</h5>
                                                        <div>
                                                            ${modalFeatures(data)}
                                                        </div>
                                                    </div>
                                                    <div class="col">
                                                        <h5>Integrations</h5>
                                                        <div>
                                                            ${modalIntegration(data)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-sm-12 col-md-12 col-lg-5 ">
                                        <div class="border border-gray">
                                            <div class="img-div text-center ">
                                                <img style="height:220px!important" class="img-fluid p-3" src="${image_link[0]}" alt="Image">
                                        
                                                <p class="text-block rounded" style="${accuracy.score ? '' : 'display: none;'}">${accuracy.score * 100}% accuracy</p>
                                        
                                            </div>
                                        
                                            <div class="px-3">
                                                <h5 class="text-center">${input_output_examples ? input_output_examples[0].input : 'Can you give any example?'}</h5>
                                                <p style="font-size:14
                                                px;" class="text-center py-2">${input_output_examples ? input_output_examples[0].output.slice(0, 99) : 'No , Not Yet , take a break'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
    // Appending the div element to the modal body:
    modalBody.appendChild(modalContainer);

}


/* -------------------------------------------------------------------------------------------------------- */

/**
 * It takes an object, loops through the keys, and returns a string of HTML.
 * @param data - the data object that contains the features
 * @returns A string of HTML.
 */

const modalFeatures = (data) => {
    let modalFeatures = '';
    const key = Object.keys(data.features);
    for (let i = 0; i < key.length; i++) {
        modalFeatures += `
        <li>${data?.features[key[i]]?.feature_name}</li>`;
    }
    return `<ul>${modalFeatures}</ul>`;
}

/* -------------------------------------------------------------------------------------------------------- */

/**
 * If the data object has an integrations property, then loop through the integrations array and return
 * a list of the integrations. Otherwise, return "No Data Found".
 * @returns A string of HTML.
 */

const modalIntegration = data => {
    let modalIntegration = '';
    if (data && data.integrations) {
        for (let i = 1; i <= data.integrations.length; i++) {
            modalIntegration += `
            <li>${data?.integrations[i - 1]}</li>`;
        }
        return `<ul>${modalIntegration}</ul>`;
    }
    else {
        return "No Data Found";
    }
}


document.getElementById('sort-by-date').addEventListener('click', function () {
    const showAllBtn = document.getElementById('show-all');
    const showAll = Array.from(showAllBtn.classList).includes('d-none');
    const sortBtn = document.getElementById('sort-by-date');
    let sort = true;
    if (sortBtn.innerText === 'Sort By Date') {
        console.log(11);
        sortBtn.innerText = 'Refresh';
    }
    else {
        sortBtn.innerText = 'Sort By Date';
        sort = false;
    }
    
    loadData(showAll, sort);
})

/* -------------------------------------------------------------------------------------------------------- */
/* Calling the loadData function. */
loadData();
