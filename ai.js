/**
 * It fetches data from the url, then converts it to json, then passes it to the displayData function.
 */

const loadData = async (showAll) => {
    const url = `https://openapi.programming-hero.com/api/ai/tools`;
    const res = await fetch(url);
    const data = await res.json();
    displayData(data.data.tools, showAll);
};

/* -------------------------------------------------------------------------------------------------------- */

/**
 * It takes the data from the API and displays it on the page.
 * @param data - the data we are getting from the API
 */

const displayData = (data, showAll) => {
    const dataContainer = document.getElementById('data-container');
    // Display only 6 data and show the Load More button:
    const showAllSection = document.getElementById('show-all');
    dataContainer.innerHTML = '';
    if (!showAll){
        data = data.slice(0, 2);
        showAllSection.classList.remove('d-none');
    }
    else{
        showAllSection.classList.add('d-none');
    }
    data.forEach(tool => {
        const div = document.createElement('div');
        div.classList.add('col');
        div.innerHTML = `
        <div class="card rounded-lg">
                       <img style="height:250px!important;" src="${tool.image}" class="card-img-top p-3 border border-0 rounded-lg" alt="Image">
                       <div class="card-body">
                            <h5 class="card-title">Features</h5>
                            <ol class="px-3">
                                <li>${tool.features[0]}</li>
                                <li>${tool.features[1]}</li>
                                <li>${tool.features[2]}</li>                         
                            </ol>
                            <hr>
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 class="card-title">${tool.name}</h5>
                                    <i class="fa-regular fa-calendar-minus"></i>
                                    <span>${tool.published_in}</span>
                                </div>
                                <div class="border rounded-circle bg-danger-subtle d-flex justify-content-center align-items-center" style="height:40px; width:40px;">
                                    <i class="fa-solid fa-arrow-right"></i>
                                </div>
                            </div>
                        </div>
                    </div>
        `;
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
    loadData(true);
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

/* -------------------------------------------------------------------------------------------------------- */

/* Calling the loadData function. */
loadData();
