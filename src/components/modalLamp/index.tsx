import { Button, Grid } from "@mui/material";
import React from "react";
import "./styles.scss"



function ModalLamp() {

    return (

        <main>
            <div className="card">
                
                <div className="titleCard">
                
                <h2> FARMSTECH POSTE 1 </h2>
                <button className="btn-close">X</button>
                </div>
               
                <div className="buttons">
                    <p>LAMP 1: </p>
                    <button className="btn">Ligar</button>
                    <button className="btn">Desligar</button>
                </div>
                <div className="buttons">
                    <p>LAMP 2: </p>
                    <button className="btn">Ligar</button>
                    <button className="btn">Desligar</button>
                </div>
                <div className="buttons">
                    <p className="all-lamps">ALL LAMPS: </p>
                    <button className="btn">Ligar</button>
                    <button className="btn">Desligar</button>
                </div>

                <div className="infoCard">

                    <h3>Longitude: </h3>
                    <input readOnly placeholder="...Carregando" />
                    <h3>Latitude: </h3>
                    <input readOnly placeholder="...Carregando" />

                </div>
                

            </div>
        </main>

    )
}

export default ModalLamp