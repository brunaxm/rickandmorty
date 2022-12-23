import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { InfinitySpin } from  'react-loader-spinner';
import { TbPlayerPlay, TbArrowBigLeft } from "react-icons/tb";

import { getEpisodesFilters } from "../../api";
import './index.css';

export const EpisodesList = () => {
    const navigate = useNavigate();
    const { name } = useParams();
    const {state} = useLocation();
    const { queryEpisodes } = state;

    const [episodes, setEpisodes] = useState([]);
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
                                <button className='buttonCharactersEpList' onClick={() => {}}>Characters</button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
