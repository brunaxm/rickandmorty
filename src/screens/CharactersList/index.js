import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { InfinitySpin } from  'react-loader-spinner';
import { TbArrowBigLeft } from "react-icons/tb";

import { getCharacteresFilters } from "../../api";
import './index.css';

export const CharactersList = () => {
    const navigate = useNavigate();
    const { name } = useParams();
    const { state } = useLocation();
    const { queryCharacters, origin } = state;

    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

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

    const navigateToEpisodes = (character) => {
        let query = '';

        if (character.episode.length > 0) {

            character.episode.forEach((element, index) => {
                if (index > 0) {
                    query += ',';
                }
                const url = element.split('episode/');
                console.log(url);
                query += url[1];
            });
        }

        navigate(`/episodes/user/${character.name}`, { state: { queryEpisodes: query }});
    };

    const title = origin === 'location'
        ? `List of character who have been last seen in ${name}`
        : `List of characters who have been seen in the episode ${name}`;


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