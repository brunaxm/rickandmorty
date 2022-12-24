import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InfinitySpin } from  'react-loader-spinner';
import { TbMapPin } from "react-icons/tb";

import { getAllLocations, getLocationsFilters } from '../../api';
import { mountQuery } from '../../formatters';
import './index.css';

// Componente da lista principal de lugares.
export const Locations = () => {
    // Informações recebidas no resultado da requisição e armazenadas no estado.
    // O estado locations guardará a lista de personagens quando for carregada.
    const [info, setInfo] = useState();
    const [locations, setLocations] = useState([]);

    // Estados que servirão para verificar se a chamada aos dados ainda está carregando ou deu erro.
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Estados para armazenar os valores dos inputs presentes na parte de filtros.
    const [filterName, setFilterName] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterDimension, setFilterDimension] = useState('');

    const navigate = useNavigate();

    // Quando a página for montada (acessada) chamará a função handlePage.
    useEffect(() => {
        handlePage();
    }, []);

    // A função handlePage carregará os dados dos episódios (20 por vez, pois a API manda de forma paginada).
    // A função recebe como parâmetro uma url quando for para carregar a página anterior ou a próxima.
    // A função window.scrollTo() serve para scrollar a tela de volta ao topo da lista.
    const handlePage = async (url = null) => {
        try {
            setError(false);
            setLoading(true);
            window.scrollTo ({
                top: 0,
            });

            const response = await getAllLocations(url);
            
            setInfo(response.data.info);
            setLocations(response.data.results);
        } catch (error) {
            setError(true);
        } finally {
            setTimeout(() => setLoading(false), 500);
        }
    };
    
    // Função para carregar os lugares a partir de filtros.
    // Armazena em um array todos os filtros possíveis e chama a mountQuery() para montar a query da forma que URL suporta.
    const handleSearch = async () => {
        const values = [
            { name: 'name', value: filterName },
            { name: 'type', value: filterType },
            { name: 'dimension', value: filterDimension },
        ];
        const urlQuery = mountQuery(values);
            
        try {
            setError(false);
            setLoading(true);
            
            const response = await getLocationsFilters(urlQuery !== '?' && urlQuery);

            setInfo(response.data.info);
            setLocations(response.data.results);
        } catch (error) {
            setError(true);
        } finally {
            setTimeout(() => setLoading(false), 500);
        } 
    };

    // Função para navegar para a lista de personagens que moram ou foram vistos pela última vez em determinado local.
    // Como o objeto location contém apenas a lista de URLs de todos os personagens, pegamos apenas os IDs dos personagens
    // presentes nessas URLs e concatemos em uma única string para enviar para a rota de lista de personagens que fará apenas
    // uma requisição a partir dessa string enviada, para listar todos os personagens moram ou foram vistos pela última vez no lugar.
    const navigateToCharacters = (location) => {
        let query = '';

        if (location.residents.length > 0) {
            location.residents.forEach((element, index) => {
                if (index > 0) {
                    query += ',';
                }
                const url = element.split('character/');
                query += url[1];
            });
        }

        navigate(`/characters/location/${location.name}`, { state: { 
            queryCharacters: query, 
            origin: 'location' 
        }});
    };

    // Renderiza os elementos visuais da tela.
    return (
        <div id='containerLocal'>
            <div id="filtersLocal">
                <input
                    className='filterInputLocal'
                    type='text'
                    name='name'
                    placeholder='Name'
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)} 
                />
                <input 
                    className='filterInputLocal'
                    type='text'
                    name='type'
                    placeholder='Type'
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)} 
                />
                <input 
                    className='filterInputLocal'
                    type='text'
                    name='dimension'
                    placeholder='Dimension'
                    value={filterDimension}
                    onChange={(e) => setFilterDimension(e.target.value)} 
                />
                <button className='buttonSearchLocal' onClick={handleSearch}>Search</button>
            </div>
            {loading && (
                <div id="loaderLocal">
                    <InfinitySpin 
                        width='200'
                        color="#AFFC41"
                    />
                </div>
            )}
            {error && (
                <div id="errorLocal">
                    <p>Unable to load data.</p>
                </div>
            )}
            {!loading && !error && (
                <>
                    <div className='listLocal'>
                        {locations.map((location) => 
                            <div className='cardLocal' key={location.id}>
                                <TbMapPin size={40} color='white' />
                                <div className='locationInfos'>
                                    <p className='locationName'>{location.name}</p>
                                    <div className='locationInfo'>
                                        <p className='locationLabel'>Type:&nbsp;</p>
                                        <p className='locationValue'>{location.type}</p>
                                    </div>
                                    <div className='locationInfo'>
                                        <p className='locationLabel'>Dimension:&nbsp;</p>
                                        <p className='locationValue'>{location.dimension}</p>
                                    </div>
                                </div>
                                <button
                                    className='buttonResidentsLocal'
                                    onClick={() => navigateToCharacters(location)}>
                                    Residents
                                </button>
                            </div>
                        )}
                    </div>
                    <div>
                        {info && info.prev && (
                            <button className="buttonPaginationLocal" onClick={() => handlePage(info.prev)}>
                                Prev page
                            </button>
                        )}
                        {info && info.next && (
                            <button className="buttonPaginationLocal" onClick={() => handlePage(info.next)}>
                                Next page
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
