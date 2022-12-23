import axios from 'axios';

const url = 'https://rickandmortyapi.com/api';

export const getAllCharacteres = (urlPage = null) => {
    if (urlPage) {
        return axios.get(urlPage);
    }
    return axios.get(`${url}/characte`);
};

export const getCharacteresFilters = (urlQuery = '') => {
    return axios.get(`${url}/character/${urlQuery}`);
};

export const getAllLocations = (urlPage = null) => {
    if (urlPage) {
        return axios.get(urlPage);
    }
    return axios.get(`${url}/location`);
};

export const getLocationsFilters = (urlQuery = '') => {
    return axios.get(`${url}/location/${urlQuery}`);
};

export const getAllEpisodes = (urlPage = null) => {
    if (urlPage) {
        return axios.get(urlPage);
    }
    return axios.get(`${url}/episode`);
};

export const getEpisodesFilters = (urlQuery = '') => {
    return axios.get(`${url}/episode/${urlQuery}`);
};
