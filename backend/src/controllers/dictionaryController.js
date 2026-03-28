// src/controllers/dictionaryController.js
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic(); // utilise ANTHROPIC_API_KEY depuis .env

/**
 * POST /api/dictionary/batch
 * Body : { batchNum: number (1-9) }
 * Retourne un tableau de 500 mots : [word_en, trans_fr, pos, level]
 */
export const getDictionaryBatch = async (req, res) => {
    const { batchNum = 1 } = req.body;

    const prompt = `Return ONLY a JSON array (no markdown, no code block, no explanation) of exactly 500 common English words.
This is batch ${batchNum} of 9. Each batch must cover different words — do not repeat words from other batches.

Batch distribution guide:
- Batch 1: most basic everyday words (A1 focus)
- Batch 2: elementary vocabulary (A1/A2 focus)
- Batch 3: pre-intermediate vocabulary (A2/B1 focus)
- Batch 4: intermediate vocabulary (B1 focus)
- Batch 5: intermediate-plus vocabulary (B1/B2 focus)
- Batch 6: upper-intermediate vocabulary (B2 focus)
- Batch 7: advanced vocabulary (B2/C1 focus)
- Batch 8: advanced/academic vocabulary (C1 focus)
- Batch 9: proficient/academic vocabulary (C1/C2 focus)

Each element must be: ["english_word", "french_translation", "part_of_speech", "CEFR_level"]
- part_of_speech: one of n/v/adj/adv/prep/conj/pron/det/num/interj
- CEFR_level: A1/A2/B1/B2/C1/C2
- french_translation: concise, accurate, include article for nouns (e.g. "le chien" not just "chien")

Return ONLY the raw JSON array starting with [ and ending with ]. No other text.`;

    try {
        const message = await client.messages.create({
            model:      'claude-opus-4-5',
            max_tokens: 4096,
            messages:   [{ role: 'user', content: prompt }],
        });

        const text  = message.content[0]?.text || '[]';
        const match = text.match(/\[[\s\S]*\]/);

        if (!match) {
            return res.status(500).json({ error: 'Failed to parse word list' });
        }

        const words = JSON.parse(match[0]);

        if (!Array.isArray(words)) {
            return res.status(500).json({ error: 'Invalid word list format' });
        }

        return res.json({ words, batchNum, count: words.length });
    } catch (err) {
        console.error('[getDictionaryBatch]', err);
        return res.status(500).json({ error: 'Failed to generate dictionary batch' });
    }
};