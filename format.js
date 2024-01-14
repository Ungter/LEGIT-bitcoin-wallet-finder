const fs = require('fs');

// Specify the path of your file
const filePath = './btc.txt';

// Read the file
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    // Check if the data is not empty
    if (data.trim() === '') {
        console.error('File is empty or contains only whitespace');
        return;
    }

    // Process each line
    const lines = data.split(/\r?\n/); // Handles both UNIX (\n) and Windows (\r\n) line breaks
    const processedLines = lines.map(line => {
        return line
            .replace(/Address: /, '') // Remove 'Address: '
            .replace(/ +BALANCE: .+/, ''); // Remove ' BALANCE: ...'
    });

    // Check if there's any processed content
    if (processedLines.join('').trim() === '') {
        console.error('No content after processing');
        return;
    }

    // Join the processed lines back into a single string
    const processedContent = processedLines.join('\n');

    // Write the processed content to a new file (or you can overwrite the original file)
    const outputFilePath = './processed_file.txt';
    fs.writeFile(outputFilePath, processedContent, 'utf8', (err) => {
        if (err) {
            console.error('Error writing the file:', err);
            return;
        }
        console.log(`File has been processed and saved to ${outputFilePath}`);
    });
});
