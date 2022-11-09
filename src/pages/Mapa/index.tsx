import { useState, useEffect } from 'react';
import {
    AzureMap,
    AzureMapDataSourceProvider,
    AzureMapLayerProvider,
    AzureMapsProvider,
    AzureMapPopup
} from 'react-azure-maps';
import { data, MapMouseEvent, PopupOptions } from 'azure-maps-control';
import { toast } from 'react-toastify';

import { Popover, RenderPoint } from '../../components/map';

import option from '../../utils/mapOptions';
import { RequestBaseProps, PoleProps } from "../../_types";

import useApi from '../../hooks/useApi';
// import api from "../../api/api";
import ModalLamp from '../../components/modal';

import "./styles.scss";
const Mapa = () => {
    const requestApi = useApi();
    const [poles, setPoles] = useState<PoleProps[]>([]);
    const [selectedPole, setSelectedPole] = useState<PoleProps>();

    const [openedPopover, setOpenedPopover] = useState(false);
    const [popupOptions, setPopupOptions] = useState<PopupOptions>({});

    useEffect(() => {
        (async () => {
            try {
                const response = await requestApi<RequestBaseProps<PoleProps[]>>('/poles-status', "get");

                if (response && response.data?.FL_STATUS) {
                    setPoles(response.data.data);
                }
            } catch (err) { }
        })();
    }, []);
    useEffect(() => { setOpenedPopover(!selectedPole); }, [selectedPole])

    async function btnLampada(lamp: string, { device }: PoleProps, state: boolean) {
        const paramets = { [lamp]: state, devices: [device] }
        await requestApi('/farmstech_aut', "POST", paramets);
        state ? toast.success('Acendeu a Lâmpada!') : toast.info('Desligou a Lâmpada!')
    }
    const getPole = async (long: string, lat: string) => {
        const pole = poles.find(pole => pole.long === long && pole.lat === lat);
        if (!pole) return;
        
        setSelectedPole(pole);
        console.log('somente pole',pole)
    };
    

    console.log('poles',poles)
    console.log('selected',selectedPole)

    return (
        <AzureMapsProvider>
            <div
                style={{
                    height: '100vh',
                    width: '100vw',
                }}
            >
                <AzureMap options={option}>
                    <AzureMapDataSourceProvider id='MultiplePoint'>
                        <AzureMapLayerProvider
                            options={{
                                iconOptions: { image: 'pin-red' }
                            }}
                            events={{
                                click: (e: MapMouseEvent) => {
                                    if (e.shapes && e.shapes.length > 0) {
                                        const prop: any = e.shapes[0];
                                        setPopupOptions({
                                            ...popupOptions,
                                            pixelOffset: [0, -20],
                                            position: new data.Position(
                                                prop.data.geometry.coordinates[0],
                                                prop.data.geometry.coordinates[1],
                                            ),
                                        });

                                        getPole(prop.data.geometry.coordinates[0].toString(), prop.data.geometry.coordinates[1].toString());
                                    }
                                },
                            }}
                            type="SymbolLayer"
                        />
                         <ModalLamp/>

                        {poles.map(({ long, lat }, index) => <RenderPoint key={`render-point-${index + 1}`} {...(new data.Position(Number(long), Number(lat)))} />)}
                        <AzureMapPopup
                           
                            isVisible={openedPopover}
                            options={popupOptions}

                            popupContent={<Popover pole={selectedPole} onClick={btnLampada} />}
                        />
                    </AzureMapDataSourceProvider>

                </AzureMap>
                
            </div>
        </AzureMapsProvider>
        
    );
};
export default Mapa;