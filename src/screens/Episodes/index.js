import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InfinitySpin } from  'react-loader-spinner';
import { TbPlayerPlay } from "react-icons/tb";

import { getAllEpisodes, getEpisodesFilters } from '../../api';
import './index.css';

export const Episodes = () => {
    const [info, setInfo] = useState();
    const [episodes, setEpisodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [filterName, setFilterName] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        handlePage();
    }, []);

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

    const handleSearch = async () => {
        const urlQuery = filterName && `?name=${filterName}`;
        console.log(urlQuery);
            
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

    const navigateToCharacters = (episode) => {
        let query = '';

        if (episode.characters.length > 0) {
            episode.characters.forEach((element, index) => {
                if (index > 0) {
                    query += ',';
                }
                const url = element.split('character/');
                console.log(url);
                query += url[1];
            });
        }

        navigate(`/characters/episode/${episode.name}`, { state: { 
            queryCharacters: query, 
            origin: 'episode' 
        }});
    };

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
