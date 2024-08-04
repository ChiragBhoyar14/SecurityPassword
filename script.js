// Function to convert a string to an ArrayBuffer
function strToArrayBuffer(str) {
    return new TextEncoder().encode(str);
}

// Function to convert an ArrayBuffer to a Base64 string
function arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    bytes.forEach(b => binary += String.fromCharCode(b));
    return window.btoa(binary);
}

// Function to convert a Base64 string to an ArrayBuffer
function base64ToArrayBuffer(base64) {
    let binary = window.atob(base64);
    let bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

// Function to encrypt a string
async function encryptString(plainText, key, iv) {
    try {
        const keyBuffer = strToArrayBuffer(key);
        const ivBuffer = strToArrayBuffer(iv);
        const keyCrypto = await crypto.subtle.importKey(
            'raw', keyBuffer, { name: 'AES-CBC' }, false, ['encrypt']
        );
        const encryptedBuffer = await crypto.subtle.encrypt(
            { name: 'AES-CBC', iv: ivBuffer }, keyCrypto, strToArrayBuffer(plainText)
        );
        return arrayBufferToBase64(encryptedBuffer);
    } catch (error) {
        console.error('Encryption Error:', error);
        throw error;
    }
}

// Function to decrypt a string
async function decryptString(cipherText, key, iv) {
    try {
        const keyBuffer = strToArrayBuffer(key);
        const ivBuffer = strToArrayBuffer(iv);
        const keyCrypto = await crypto.subtle.importKey(
            'raw', keyBuffer, { name: 'AES-CBC' }, false, ['decrypt']
        );
        const decryptedBuffer = await crypto.subtle.decrypt(
            { name: 'AES-CBC', iv: ivBuffer }, keyCrypto, base64ToArrayBuffer(cipherText)
        );
        return new TextDecoder().decode(decryptedBuffer);
    } catch (error) {
        console.error('Decryption Error:', error);
        throw error;
    }
}

document.getElementById('encryptButton').addEventListener('click', async () => {
    const secretKey = document.getElementById('secretKey').value;
    const textInput = document.getElementById('textInput').value;
    const iv = document.getElementById('iv').value; 

    if (secretKey.length !== 16) {
        alert('Secret Key must be 16 characters long.');
        return;
    }

    try {
        const encryptedText = await encryptString(textInput, secretKey, iv);
        document.getElementById('encryptedText').value = encryptedText;
    } catch (error) {
        alert('Encryption failed. Check console for details.');
    }
});

document.getElementById('decryptButton').addEventListener('click', async () => {
    const secretKey = document.getElementById('secretKey').value;
    const encryptedText = document.getElementById('textInput').value;
    const iv = document.getElementById('iv').value; 

    if (secretKey.length !== 16) {
        alert('Secret Key must be 16 characters long.');
        return;
    }

    try {
        const decryptedText = await decryptString(encryptedText, secretKey, iv);
        document.getElementById('encryptedText').value = decryptedText;
    } catch (error) {
        alert('Decryption failed. Check console for details.');
    }
});
