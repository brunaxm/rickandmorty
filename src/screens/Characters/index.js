import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { InfinitySpin } from  'react-loader-spinner';
import Select from 'react-select';


import { getAllCharacteres, getCharacteresFilters } from '../../api';
import { mountQuery } from '../../formatters';
import './index.css';

const optionsStatus = [
    { value: 'alive', label: 'Alive' },
    { value: 'dead', label: 'Dead' },
    { value: 'unknown', label: 'Unknown' },
];

const optionsGender = [
    { value: 'female', label: 'Female' },
    { value: 'male', label: 'Male' },
    { value: 'genderless', label: 'Genderless' },
    { value: 'unknown', label: 'Unknown' },
];

export const Characters = () => {
    const [info, setInfo] = useState();
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    
    const [filterName, setFilterName] = useState('');
    const [filterSpecie, setFilterSpecie] = useState('');
    const [filterStatus, setFilterStatus] = useState();
    const [filterGender, setFilterGender] = useState();

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

            const response = await getAllCharacteres(url);

            setInfo(response.data.info);
            setCharacters(response.data.results);
        } catch (error) {
            setError(true);
        } finally {
            setTimeout(() => setLoading(false), 500);
        }
    };

    const handleSearch = async () => {
        const values = [
            { name: 'name', value: filterName },
            { name: 'species', value: filterSpecie },
            { name: 'status', value: filterStatus ? filterStatus.value : '' },
            { name: 'gender', value: filterGender ? filterGender.value : '' },
        ];

        const urlQuery = mountQuery(values);
        console.log(urlQuery);
            
        try {
            setError(false);
            setLoading(true);
            
            const response = await getCharacteresFilters(urlQuery !== '?' && urlQuery);

            console.log(response);
            setInfo(response.data.info);
            setCharacters(response.data.results);
        } catch (error) {
            setError(true);
        } finally {
            setTimeout(() => setLoading(false), 500);
        } 
    };

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

    return (
        <div id='containerChar'>
            <div id="filtersChar">
                <input
                    className='filterInputChar'
                    type='text'
                    name='name'
                    placeholder='Name'
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)} 
                />
                <input 
                    className='filterInputChar'
                    type='text'
                    name='specie'
                    placeholder='Specie'
                    value={filterSpecie}
                    onChange={(e) => setFilterSpecie(e.target.value)} 
                />
                <Select 
                    className='filterSelectChar'
                    options={optionsStatus}
                    placeholder="Status"
                    value={filterStatus}
                    onChange={setFilterStatus}
                    isClearable={true}
                />
                <Select
                    className='filterSelectChar'
                    options={optionsGender}
                    placeholder="Gender"
                    value={filterGender}
                    onChange={setFilterGender}
                    isClearable={true}
                />
                <button className='buttonSearchChar' onClick={handleSearch}>Search</button>
            </div>
            {loading && (
                <div id="loaderChar">
                    <InfinitySpin 
                        width='200'
                        color="#AFFC41"
                    />
                </div>
            )}
            {error && (
                <div id="errorChar">
                    <p>Unable to load data.</p>
                </div>
            )}
            {!loading && !error && (
                <>
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
                    <div>
                        {info && info.prev && (
                            <button className="buttonPaginationChar" onClick={() => handlePage(info.prev)}>
                                Prev page
                            </button>
                        )}
                        {info && info.next && (
                            <button className="buttonPaginationChar" onClick={() => handlePage(info.next)}>
                                Next page
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
