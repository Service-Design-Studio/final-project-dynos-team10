import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import {
    Header,
    useMantineTheme,
  } from "@mantine/core";
import { useNavigate } from 'react-router-dom';

function QRScanner () {
    const [WO, setWO] = useState('');
    const[machine, setMachine] = useState('');
    const navigate = useNavigate();
    const theme = useMantineTheme();

    const handleResult = (result, error) => {
        if (!!result) {
            const data = (result?.text.split(","))
            setWO(data[0])
            setMachine(data[2])
         
    }

          if (!!error) {
            console.info(error);
          }
        }
    
      
    return ( 
    <div>
        <Header height={70} p="md">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            height: "100%",
          }}
        >
          <h1>QR Scanner</h1>
        </div>
      </Header>

        <QrReader
          onResult={handleResult}
          style={{ height: 240, width: 320 }}
          scanDelay={3000}
        />
        <p>{WO}, {machine}</p>
      </div> );
}

export default QRScanner;
