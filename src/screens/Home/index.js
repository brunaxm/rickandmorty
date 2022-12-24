import { useNavigate } from "react-router-dom";
import { TbFriends, TbWorld, TbDeviceTvOld } from "react-icons/tb";

import './index.css';

export const Home = () => {
    const navigate = useNavigate();

    return (
        <div id="containerHome">
            <p className='titleHome'>
                Rick and Morty Library
            </p>
            <div className='contentHome'>
                <div className="cardOptions">
                <button className="cardOption" onClick={() => navigate('menu/characteres')}>
                    <TbFriends size={50} color="#AFFC41" />
                    <p className='titleCard'>
                    Personagens
                    </p>
                    <p className='descriptionCard'>
                    Obtenha informações sobre os seus personagens favoritos.
                    </p>
                </button>
                <button className="cardOption" onClick={() => navigate('menu/locations')}>
                    <TbWorld size={50} color="#AFFC41" />
                    <p className='titleCard'>
                    Lugares
                    </p>
                    <p className='descriptionCard'>
                    Veja todos os locais existentes no seriado, como planetas, estações e muito mais.
                    </p>
                </button>
                <button className="cardOption" onClick={() => navigate('menu/episodes')}>
                    <TbDeviceTvOld size={50} color="#AFFC41" />
                    <p className='titleCard'>
                    Episódios
                    </p>
                    <p className='descriptionCard'>
                    Procure pelos episódios da série e veja quais personagens participaram de cada episódio.
                    </p>
                </button>
                </div>
            </div>
        </div>
    );
};