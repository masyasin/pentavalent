import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/pages/public/business/BusinessPage.tsx');

try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    // Lines to remove (1-based index from view_file, so subtract 1 for 0-based array)
    // Range: 284 to 324 inclusive.
    // 284 -> index 283
    // 324 -> index 323

    // Check if the lines look like what we expect to ensure safety
    if (lines[283].includes('Competitive Advantages Section - Dynamic') && lines[323].includes(')}')) {
        console.log('Target lines identified correctly.');
        // Splice out the lines
        // Number of lines to remove = 324 - 284 + 1 = 41 lines
        lines.splice(283, 41);

        const newContent = lines.join('\n');
        fs.writeFileSync(filePath, newContent, 'utf-8');
        console.log('Successfully removed duplicate Competitive Advantages section.');
    } else {
        console.error('Line mismatch. Aborting to prevent damage.');
        console.log('Line 284 content:', lines[283]);
        console.log('Line 324 content:', lines[323]);
    }
} catch (error) {
    console.error('Error processing file:', error);
}
