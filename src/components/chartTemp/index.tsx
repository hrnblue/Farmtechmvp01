import InfluxDB from "../../api/InfluxDB";
import ApexChart, { Props } from "react-apexcharts";
import { influxProps, influxPropsTemp } from "../../_types/index";
import { useState, useEffect } from 'react';
import { generateColor, distinct_json } from "../../utils";
import formatDate from "../../utils/formatDate";


export default function Chart() {
    const [loading, setLoading] = useState<boolean>(true);
    const [tempAssets, setTermpAssets] = useState<influxProps[]>([]);
    const [ambTemp, setAmbTemp] = useState<influxPropsTemp[]>([]);
    
    const [options, setOptions] = useState<Props>({
        type: 'line',
        width: 640,
        height: 350
    })

    const influxInit =  () => {
        InfluxDB("SELECT * FROM Temp_Device WHERE time > now() - 7d").then(result => setTermpAssets(result));
        InfluxDB("SELECT * FROM ambTemp WHERE time > now() - 365d").then(result => setAmbTemp(result));
    }

    useEffect(() => {
        const loadPageData = async () => {
            try {
                influxInit();
                const influxRequest = setInterval(() => influxInit(), 10 * 6000);
            return () => clearInterval(influxRequest);
            } catch {
                console.error('Erro ao buscar dados')
            } finally {
                setLoading(false);
            }
        }
        loadPageData()
    }, [])

    const tempAmpGraph:influxProps[] = ambTemp.map(data =>{
        return {
            time: data.time,
            device: 'AMBIENTE',
            value: data.ambTemp
    }
    })
    Object.assign(tempAssets,tempAmpGraph)


    console.log(tempAssets)
   
    useEffect(() => {
        const distinct_times = distinct_json(tempAssets, "time");
        const distinct_devices = distinct_json(tempAssets, "device");
        const series = distinct_devices.map(device => {
            return {
                name: device,
                color: generateColor(),
                data: distinct_times.map(time => {
                    const info = tempAssets.find(d => d.time === time && d.device === device)
                    return info?.value || 0
                })
            };
        });
        const options = {
            xaxis: {
                categories: distinct_times.map((time: string) => formatDate(new Date(time), "DD/MM HH:ss"))
            }
        };

        setOptions(opt => ({...opt, series, options}));
    }, [tempAssets])

    if (loading) {
        return <h1>Loading...</h1>
    }
    return (
        <>
            <ApexChart {...options} />
        </>
    )
}