import './index.css';
import { Outlet, NavLink } from "react-router-dom";
import { TbFriends, TbWorld, TbDeviceTvOld } from "react-icons/tb";
import logo from '../../assets/logo.png';

// Componente de Menu que será renderizado junto as telas de listagens principais.
// Através do componente de Menu podemos acessar três telas, a lista de personagens, de localizações e de episódios.
export const Menu = () => {

    const activeStyle = {
        backgroundColor: '#7209B7',
        color: 'white',
    };

    const styleDefault = {
        marginLeft: 10,
        marginRight: 10,
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 6,
        display: 'flex',
        color: '#1DD3B0',
    };

    return (
        <div id="containerMenu">
            <div id="menu">
                <img src={logo} alt="logo" id='logoMenu' />
                <div className='links'>
                    <NavLink 
                        to="characteres"
                        style={({ isActive }) => isActive ? { ...styleDefault, ...activeStyle} : styleDefault}>
                        <TbFriends size={30} />
                    </NavLink>
                    <NavLink 
                        to="locations"
                        style={({ isActive }) => isActive ? { ...styleDefault, ...activeStyle} : styleDefault}>
                        <TbWorld size={30} />
                    </NavLink>
                    <NavLink
                        to="episodes"
                        style={({ isActive }) => isActive ? { ...styleDefault, ...activeStyle} : styleDefault}>
                        <TbDeviceTvOld size={30} />
                    </NavLink>
                </div>
            </div>
            <Outlet />
        </div>
    );
};
