import axios from 'axios';

// URL base da api do Rick and Morty utilizada.
const url = 'https://rickandmortyapi.com/api';

// Funções que contém todas as chamadas a API utilizando o Axios (cliente HTTP baseado em promisses).
// A função abaixo, por exemplo, serve para listar todos os personagens. Ela pode receber uma urlPage como parâmetro ou não
// Esse parâmetro só será recebido ao carregar a página anterior ou a próxima.
export const getAllCharacteres = (urlPage = null) => {
    if (urlPage) {
        return axios.get(urlPage);
    }
    return axios.get(`${url}/character`);
};

// Essa função servirá para listar os personagens a partir de filtros, filtros esses que serão recebidos no formato de query
// a partir do parâmetro urlQuery.
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
