'use strict';

// define constants used
const apiKey = 'acnGc7BvHjUSTUHKiqHCPIx2LihUZDYaan0acoSO';
const searchURL= 'https://developer.nps.gov/api/v1/parks?';

//format search URL
function formatQueryParams(params) {
    const queryItem = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItem.join('&');
}

function displayResults(responseJson) {
    console.log(responseJson);
    
    //remove pervious results
    $('#results-list').empty();
    // iterate through data array
    for (let i = 0; i < responseJson.data.length; i++) {
        $('#results-list').append(
            `<li><h3><a href= "${responseJson.data[i].url}">${responseJson.data[i].name}</a></h3>
            <p>${responseJson.data[i].description}</p>
            <p>${responseJson.data[i].addresses[0].line1}</p>
            <p>${responseJson.data[i].addresses[0].city}</p>
            <p>${responseJson.data[i].addresses[0].stateCode}</p>
            <p>${responseJson.data[i].addresses[0].postalCode}</p>
            </li>`
        )};
    //display results section
    $('#results').removeClass('hidden');
}

function getNationalPark(query, maxResults=10) {
    const params = {
        stateCode: query,
        limit: maxResults,
        api_key: apiKey,   
    };
    const queryString = formatQueryParams(params)
    const url = searchURL + queryString;

    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            $('js-error-message').text('Something went wrong: ${err.message}');
        });
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const searchTerm = $('#js-search-term').val();
        const maxResults = $('#js-max-results').val();
        getNationalPark(searchTerm, maxResults);
    });
}

$(watchForm);