import { useState } from "react";
import { Button } from '@mantine/core'

function Upload() {
    const [pictures, setPictures] = useState([]);

    const handleChange = (e) => {
        const file = Array.from(e.target.files);
        console.log("files: " + file)
       const pics = file.map(data => (
            URL.createObjectURL(data)
        ))
        console.log(pics)
        // file.forEach(i => {
        //     console.log(i)
        //     setPictures([...pictures, URL.createObjectURL(i)]);
        // })

    }
    return ( 
    <div>

        <input
        multiple={true}
        onChange={handleChange}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        id="contained-button-file"
        />

        <img src={pictures} alt="" />

        <label htmlFor="contained-button-file">
        <Button 
        variant="outline" color="primary" component="span">
          Upload
        </Button>
      </label>

    </div>

     );
}

export default Upload;