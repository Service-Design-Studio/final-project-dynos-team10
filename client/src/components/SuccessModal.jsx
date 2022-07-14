import { useState } from 'react';
import { Modal, 
        Text    } from '@mantine/core';

function SuccessModal() {
    const[opened, setOpened] = useState(true)
    return (  
        <div>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
            >
                <Text>Upload Successful</Text>
            </Modal>
        </div>
    );
}

export default SuccessModal
l;