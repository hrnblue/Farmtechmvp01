import { MenuProps } from '../../_types';
import {Settings, Addchart, Home} from '@mui/icons-material';


const MenuItemsJSON: MenuProps[] = [
    {
        "name": "Home",
        "icon": <Home/>,
        "isCentralized": false,
        "link": "/",
    },
    {
        "name": "Métricas",
        "icon": <Addchart/>,
        "isCentralized": false,
        "Submenus": [{ 
            "name": "Consumo de Energia",
            "isCentralized": false,
            "link": "/dash", 
        }]
    },
    {
        "name": "Automação",
        "icon": <Settings/>,
        "isCentralized": false,
        "Submenus": [{ 
            "name": "Mapa",
            "isCentralized": false,
            "link": "/mapa",
        }] 
    },
    
   
    // {
    //     "name": "Usuários",
    //     "icon": UsersSVG,
    //     "isCentralized": false,
    //     "link": "/adm/users"
    // },
 
]
export default MenuItemsJSON;