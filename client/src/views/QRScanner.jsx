import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import { Header, useMantineTheme, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";

function QRScanner() {
  const navigate = useNavigate();
  const theme = useMantineTheme();

  const handleResult = (result, error) => {
    if (!!result) {
      const data = result?.text.split(",");
      navigate('/qc-entry', {state: {workorder: data[0], machinetype: data[2]}});
    }

    if (!!error) {
      console.info(error);
    }
  };

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

      <div
        style={{
          overflow: "hidden",
          position: "relative",  
          height:400,
          alignItems:"center"
        }}
      >
        <div
          style={{
            top: "0px",
            left: "0px",
            zIndex: 1,
            boxSizing: "border-box",
            border: "50px solid rgba(0, 0, 0, 0.3)",
            boxShadow: "rgba(255, 0, 0, 0.5) 0px 0px 0px 5px inset",
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
        ></div>
        
        <QrReader
          onResult={handleResult}
          scanDelay={2000}
          style={{
            display: "block",
            position: "absolute",
            overflow: "hidden",
          }}
          videoContainerStyle={{marginTop:10}}
        />
      </div>

      <Text align="center" style={{ marginTop: 0 }}>
        Scan QR code
      </Text>
    </div>
  );
}

export default QRScanner;
