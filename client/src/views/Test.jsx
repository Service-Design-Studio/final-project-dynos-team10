import { Group, Text, useMantineTheme, MantineTheme,Image, Input, Button } from '@mantine/core';
import { Dropzone, DropzoneStatus, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useState } from 'react';

const dropzoneChildren = (status: DropzoneStatus, theme: MantineTheme) => (
<Group position="center" style={{margin:0, pointerEvents: 'none', height: 85 }}>
    <div>
      <Text size="md" align='center'>
        Label
      </Text>
      
    </div>
  </Group>
);

// function Test() {
//   const theme = useMantineTheme();
//   const [images, setImages] = useState()

//   const handleChange = (e) => {
//     console.log(e.target.files);
//     setImages(URL.createObjectURL(e.target.files[0]));
    
    
//   }
//   return (
//     <div>
//     <Dropzone
//     onDrop={handleChange}
//     onReject={(files) => console.log('rejected files', files)}
//     maxSize={3 * 1024 ** 2}
//     accept={IMAGE_MIME_TYPE}
//     style={{width:120, height:120}}
//     multiple
//   >
//     {(status) => dropzoneChildren(status, theme)}
//   </Dropzone>

//   <Image
//         radius="md"
//         url={images}
//       />


//   </div>
//   );
// };

// export default Test;

function Test() {
  const [file, setFile] = useState();
  function handleChange(e) {
      console.log(e.target.files);
      setFile(URL.createObjectURL(e.target.files[0]));
  }

  return (
      <div className="Test">
          <h2>Add Image:</h2>

          <input id="file-upload" type="file" onChange={handleChange} multiple={true} accept="image/*" name="file-upload" />
          <img src={file} />

      </div>

  );
};
export default Test;