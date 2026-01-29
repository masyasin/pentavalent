/**
 * Simple translation utility using a public API
 * Note: For production use, it is recommended to use a paid service like Google Cloud Translate or DeepL.
 */
export async function translateText(text: string, from: string = 'id', to: string = 'en'): Promise<string> {
    if (!text || text.trim() === '') return '';

    try {
        const response = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`
        );

        if (!response.ok) throw new Error('Translation service unavailable');

        const data = await response.json();

        // The Google GTX API returns an array of parts
        // data[0] contains the translated segments
        if (data && data[0]) {
            return data[0].map((part: any) => part[0]).join('');
        }

        return text; // Fallback to original text
    } catch (error) {
        console.error('Translation error:', error);
        return text; // Fallback to original text
    }
}
