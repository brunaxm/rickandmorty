import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InfinitySpin } from  'react-loader-spinner';
import { TbPlayerPlay } from "react-icons/tb";

import { getAllEpisodes, getEpisodesFilters } from '../../api';
import './index.css';

// Componente da lista principal de episódios.
export const Episodes = () => {
    // Informações recebidas no resultado da requisição e armazenadas no estado.
    // O estado episodes guardará a lista de personagens quando for carregada.
    const [info, setInfo] = useState();
    const [episodes, setEpisodes] = useState([]);

    // Estados que servirão para verificar se a chamada aos dados ainda está carregando ou deu erro.
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Estado para armazenar o valor do input presente na parte de filtro.
    const [filterName, setFilterName] = useState('');

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

            const response = await getAllEpisodes(url);
            
            setInfo(response.data.info);
            setEpisodes(response.data.results);
        } catch (error) {
            setError(true);
        } finally {
            setTimeout(() => setLoading(false), 500);
        }
    };

    // Função para carregar os episódios a partir de filtros.
    // Como os episódios só possuem um único filtro possível, nessa função a query é montada da forma que URL suporta diretamente.
    const handleSearch = async () => {
        const urlQuery = filterName && `?name=${filterName}`;
            
        try {
            setError(false);
            setLoading(true);
            
            const response = await getEpisodesFilters(urlQuery);

            setInfo(response.data.info);
            setEpisodes(response.data.results);
        } catch (error) {
            setError(true);
        } finally {
            setTimeout(() => setLoading(false), 500);
        }
    };

    // Função para navegar para a lista de personagens que participaram de determinado episódio.
    // Como o objeto episode contém apenas a lista de URLs de todos os personagens, pegamos apenas os IDs dos personagens
    // presentes nessas URLs e concatemos em uma única string para enviar para a rota de lista de personagens que fará apenas
    // uma requisição a partir dessa string enviada, para listar todos os personagens que participam do episódio.
    const navigateToCharacters = (episode) => {
        let query = '';

        if (episode.characters.length > 0) {
            episode.characters.forEach((element, index) => {
                if (index > 0) {
                    query += ',';
                }
                const url = element.split('character/');
                query += url[1];
            });
        }

        navigate(`/characters/episode/${episode.name}`, { state: { 
            queryCharacters: query, 
            origin: 'episode' 
        }});
    };

    // Renderiza os elementos visuais da tela.
    return (
        <div id='containerEp'>
            <div id="filtersEp">
                <input
                    className='filterInputEp'
                    type='text'
                    name='name'
                    placeholder='Name'
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)} 
                />
                <button className='buttonSearchEp' onClick={handleSearch}>Search</button>
            </div>
            {loading && (
                <div id="loaderEp">
                    <InfinitySpin 
                        width='200'
                        color="#AFFC41"
                    />
                </div>
            )}
            {error && (
                <div id="errorEp">
                    <p>Unable to load data.</p>
                </div>
            )}
            {!loading && !error && (
                <>
                    <div className='listEp'>
                        {episodes.map((episode) => 
                            <div className='cardEp' key={episode.id}>
                                <TbPlayerPlay size={40} color='white' />
                                <div className='episodeInfos'>
                                    <p className='episodeName'>{episode.name}</p>
                                    <div className='episodeInfo'>
                                        <p className='episodeLabel'>Code:&nbsp;</p>
                                        <p className='episodeValue'>{episode.episode}</p>
                                    </div>
                                    <div className='episodeInfo'>
                                        <p className='episodeLabel'>Air date:&nbsp;</p>
                                        <p className='episodeValue'>{episode.air_date}</p>
                                    </div>
                                </div>
                                <button
                                    className='buttonCharactersEp'
                                    onClick={() => navigateToCharacters(episode)}>
                                    Characters
                                </button>
                            </div>
                        )}
                    </div>
                    <div>
                        {info && info.prev && (
                            <button className="buttonPaginationEp" onClick={() => handlePage(info.prev)}>
                                Prev page
                            </button>
                        )}
                        {info && info.next && (
                            <button className="buttonPaginationEp" onClick={() => handlePage(info.next)}>
                                Next page
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
