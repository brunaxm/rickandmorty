import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { InfinitySpin } from  'react-loader-spinner';
import { TbArrowBigLeft } from "react-icons/tb";

import { getCharacteresFilters } from "../../api";
import './index.css';

// Componente de uma lista secundária de personagens.
export const CharactersList = () => {
    const navigate = useNavigate();

    // Obtém o parâmetro name que está na rota
    const { name } = useParams();

    // Obtém o objeto state que foi enviado como parâmetro ao navegar para essa tela, e o desestrutura logo abaixo.
    const { state } = useLocation();
    const { queryCharacters, origin } = state;

    // O estado characters guardará a lista de personagens quando for carregada.
    const [characters, setCharacters] = useState([]);

    // Estados que servirão para verificar se a chamada aos dados ainda está carregando ou deu erro.
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // A função handlePage carregará os dados dos personagens assim que a tela for montada (acessada).
    // A função window.scrollTo() serve para scrollar a tela de volta ao topo da lista.
    // É necessário fazer uma verificação da resposta da requisição pois se retornar apenas um personagem virá como objeto, e se
    // retornar mais personagens virá como array. Para não gerar erro na renderização foi necessário transformar o objeto para array também.
    useEffect(() => {
        const handlePage = async () => {
            try {
                setError(false);
                setLoading(true);
                window.scrollTo ({
                    top: 0,
                });
                const response = await getCharacteresFilters(queryCharacters);
                
                if (Array.isArray(response.data)) {
                    setCharacters(response.data);
                } else {
                    const episode = [ response.data ];
                    setCharacters(episode);
                }
            } catch (error) {
                setError(true);
            } finally {
                setTimeout(() => setLoading(false), 500);
            }
        };

        handlePage();
    }, [queryCharacters]);

    // Função para navegar para a lista de episódios que determinado personagem participou.
    // Como o objeto character contém apenas a lista de URLs de todos os episódios, pegamos apenas os IDs dos episódios
    // presentes nessas URLs e concatemos em uma única string para enviar para a rota de lista de episódios que fará apenas
    // uma requisição a partir dessa string enviada, para listar todos os episódios que o personagem aparece.
    const navigateToEpisodes = (character) => {
        let query = '';

        if (character.episode.length > 0) {

            character.episode.forEach((element, index) => {
                if (index > 0) {
                    query += ',';
                }
                const url = element.split('episode/');
                query += url[1];
            });
        }

        navigate(`/episodes/user/${character.name}`, { state: { queryEpisodes: query }});
    };

    // Verifica por onde essa tela foi acessada para determinar qual será o seu título.
    const title = origin === 'location'
        ? `List of character who have been last seen in ${name}`
        : `List of characters who have been seen in the episode ${name}`;

    // Renderiza os elementos visuais da tela.
    return (
        <div id='containerChList'>
            <div className="headerCh">
                <button className="buttonBackCh" onClick={() => navigate(-1)}>
                    <TbArrowBigLeft size={35} color='white' />
                </button>
                <h2 className="titleCh">{title}</h2>
            </div>
            {loading && (
                <div id="loaderChList">
                    <InfinitySpin 
                        width='200'
                        color="#AFFC41"
                    />
                </div>
            )}
            {error && (
                <div id="errorChList">
                    <p>Unable to load data.</p>
                </div>
            )}
            {!loading && !error && (
                <div className='listChar'>
                    {characters.map((character) => 
                        <div className='cardChar' key={character.id}>
                            <div className='characterInfos'>
                                <p className='characterName'>{character.name}</p>
                                <div className='characterInfo' style={{ marginTop: 10 }}>
                                    <p className='characterLabel'>Specie:&nbsp;</p>
                                    <p className='characterValue'>{character.species}</p>
                                </div>
                                <div className='characterInfo'>
                                    <p className='characterLabel'>Gender:&nbsp;</p>
                                    <p className='characterValue'>{character.gender}</p>
                                </div>
                                <div className='characterInfo'>
                                    <p className='characterLabel'>Type:&nbsp;</p>
                                    <p className='characterValue'>{character.type || '---'}</p>
                                </div>
                                <div className='characterInfo'>
                                    <p className='characterLabel'>Origin:&nbsp;</p>
                                    {character.origin.name !== 'unknown'
                                        ? (<Link to='../locations' className='characterLink'>{character.origin.name}</Link>)
                                        : (<p className='characterValue'>---</p>)
                                    }
                                </div>
                                <div className='characterInfo'>
                                    <p className='characterLabel'>Last location:&nbsp;</p>
                                    {character.location.name !== 'unknown'
                                        ? (<Link to='../locations' className='characterLink'>{character.location.name}</Link>)
                                        : (<p className='characterValue'>---</p>)
                                    }
                                </div>
                                <div className='characterInfo'>
                                    <p className='characterLabel'>Status:&nbsp;</p>
                                    <p className='characterValue' style={{ 
                                        color: character.status === 'Alive' ? 
                                        '#AFFC41' : character.status === 'Dead' ? 
                                        '#C21515' : 'white'
                                    }}>{character.status !== 'unknown' ? character.status : '---'}</p>
                                </div>
                            </div>
                            <div className='contentCardRight'>
                                <img src={character.image} alt='Character' className='characterPhoto' />
                                <button
                                    className='buttonEpisodesChar'
                                    onClick={() => navigateToEpisodes(character)}>
                                    Episodes
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};