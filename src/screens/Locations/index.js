import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InfinitySpin } from  'react-loader-spinner';
import { TbMapPin } from "react-icons/tb";

import { getAllLocations, getLocationsFilters } from '../../api';
import { mountQuery } from '../../formatters';
import './index.css';

export const Locations = () => {
    const [info, setInfo] = useState();
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [filterName, setFilterName] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterDimension, setFilterDimension] = useState('');

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

            const response = await getAllLocations(url);
            
            setInfo(response.data.info);
            setLocations(response.data.results);
        } catch (error) {
            setError(true);
        } finally {
            setTimeout(() => setLoading(false), 500);
        }
    };
    
    const handleSearch = async () => {
        const values = [
            { name: 'name', value: filterName },
            { name: 'type', value: filterType },
            { name: 'dimension', value: filterDimension },
        ];

        const urlQuery = mountQuery(values);
        console.log(urlQuery);
            
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

    const navigateToCharacters = (location) => {
        let query = '';

        if (location.residents.length > 0) {
            location.residents.forEach((element, index) => {
                if (index > 0) {
                    query += ',';
                }
                const url = element.split('character/');
                console.log(url);
                query += url[1];
            });
        }

        navigate(`/characters/location/${location.name}`, { state: { 
            queryCharacters: query, 
            origin: 'location' 
        }});
    };

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
