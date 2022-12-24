// Função para montar o formato de query suportado pela URL, para quando a URL conter filtros.
export const mountQuery = (values) => {
    let urlQuery = '?';

    values.forEach(({name, value}) => {
        if (value && urlQuery !== '?')
            urlQuery += `&${name}=${value}`;
        else if (value && urlQuery === '?')
            urlQuery += `${name}=${value}`;
    });

    return urlQuery;
};