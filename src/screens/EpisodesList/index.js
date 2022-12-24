import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { InfinitySpin } from  'react-loader-spinner';
import { TbPlayerPlay, TbArrowBigLeft } from "react-icons/tb";

import { getEpisodesFilters } from "../../api";
import './index.css';

// Componente de uma lista secundária de episódios.
export const EpisodesList = () => {
    const navigate = useNavigate();

     // Obtém o parâmetro name que está na rota
    const { name } = useParams();

    // Obtém o objeto state que foi enviado como parâmetro ao navegar para essa tela, e o desestrutura logo abaixo.
    const {state} = useLocation();
    const { queryEpisodes } = state;

    // O estado episodes guardará a lista de personagens quando for carregada.
    const [episodes, setEpisodes] = useState([]);

    // Estados que servirão para verificar se a chamada aos dados ainda está carregando ou deu erro.
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // A função handlePage carregará os dados dos episódios assim que a tela for montada (acessada).
    // A função window.scrollTo() serve para scrollar a tela de volta ao topo da lista.
    // É necessário fazer uma verificação da resposta da requisição pois se retornar apenas um episódio virá como objeto, e se
    // retornar mais episódios virá como array. Para não gerar erro na renderização foi necessário transformar o objeto para array também.
    useEffect(() => {
        const handlePage = async () => {
            try {
                setError(false);
                setLoading(true);
                window.scrollTo ({
                    top: 0,
                });
                const response = await getEpisodesFilters(queryEpisodes);
                
                if (Array.isArray(response.data)) {
                    setEpisodes(response.data);
                } else {
                    const episode = [ response.data ];
                    setEpisodes(episode);
                }
            } catch (error) {
                setError(true);
            } finally {
                setTimeout(() => setLoading(false), 500);
            }
        };

        handlePage();
    }, [queryEpisodes]);

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
        <div id='containerEpList'>
            <div className="headerEp">
                <button className="buttonBackEp" onClick={() => navigate(-1)}>
                    <TbArrowBigLeft size={35} color='white' />
                </button>
                <h2 className="titleEp">List of episodes in which {name} appeared</h2>
            </div>
            {loading && (
                <div id="loaderEpList">
                    <InfinitySpin 
                        width='200'
                        color="#AFFC41"
                    />
                </div>
            )}
            {error && (
                <div id="errorEpList">
                    <p>Unable to load data.</p>
                </div>
            )}
            {!loading && !error && (
                <>
                    <div className='listEpisodes'>
                        {episodes.map((episode) => 
                            <div className='cardEpList' key={episode.id}>
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
                                    className='buttonCharactersEpList'
                                    onClick={() => navigateToCharacters(episode)}>
                                    Characters
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
