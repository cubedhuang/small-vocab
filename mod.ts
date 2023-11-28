const englishWordCategories =
	// @ts-expect-error
	(Deno.readTextFileSync('english.txt') as string)
		.split('\n\n')
		.map(category => category.split('\n'));

const consonants = 'nbdk'.split('');
const vowels = 'aiu'.split('');

function phonemesToRealization(word: string) {
	let result = '';

	for (let i = 0; i < word.length; i++) {
		switch (word[i]) {
			case 'n':
				result += 'n';
				break;
			case 'a':
				result += 'a';
				break;
			case 'N':
				if (
					word[i + 1] === 'b' ||
					(word[i + 1] === 'Q' && word[i + 2] === 'b')
				) {
					result += 'm';
				} else {
					result += 'n';
				}
				break;
			case 'b':
				if (i === 0) {
					result += 'm';
				} else if (word[i - 1] === 'Q') {
					result += 'pp';
				} else {
					result += 'b';
				}
				break;
			case 'd':
				if (i === 0 || word[i - 1] === 'N') {
					result += 'd';
				} else if (word[i - 1] === 'Q') {
					result += 'tt';
				} else {
					result += 'r';
				}
				break;
			case 'k':
				if (i === 0) {
					result += 'k';
				} else if (word[i - 1] === 'Q') {
					result += 'kk';
				} else {
					result += 'g';
				}
				break;
			case 'i':
				if (word[i + 1] === 'a') {
					result += 'e';
				} else {
					result += 'i';
				}
				break;
			case 'u':
				if (
					word[i + 1] === 'a' ||
					word[i + 1] === 'i' ||
					word[i - 1] === 'a' ||
					word[i - 1] === 'i'
				) {
					result += 'o';
				} else {
					result += 'u';
				}
				break;
		}
	}

	return result;
}

function pick<T>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)];
}

function generatePhonemes() {
	// const syllables = Math.random() * 2.5 + 0.5;
	const syllables = 2;

	let word = '';

	for (let i = 0; i < syllables; i++) {
		let vowel: string;

		do {
			vowel = pick(vowels);
		} while (word[word.length - 1] === vowel);

		const c =
			word[word.length - 1] === 'N'
				? pick(consonants.filter(c => c !== 'n'))
				: pick([...consonants, '']);
		const q = i !== 0 && c && c !== 'n' && Math.random() < 0.2 ? 'Q' : '';
		const n = Math.random() < 0.2 ? 'N' : '';

		// if (q) i++;
		// if (n) i += 0.5;

		word += q + c + vowel + n;
	}

	return word;
}

// const count = englishWordCategories.reduce(
// 	(count, category) => count + category.length,
// 	0
// );
const count = 1000;

const words = new Set<string>();
const realizations = new Set<string>();

while (words.size < count) {
	const phonemes = generatePhonemes();
	const realization = phonemesToRealization(phonemes);

	if (!realizations.has(realization)) {
		words.add(phonemes);
		realizations.add(realization);
	}
}

const wordsArray = [...words];

const dictionary = englishWordCategories
	.map(category =>
		category.map(word => {
			const phonemes = wordsArray.pop()!;
			const realization = phonemesToRealization(phonemes);

			return { phonemes, realization, word };
		})
	)
	.flat()
	.sort((a, b) => a.phonemes.localeCompare(b.phonemes));

// const csv = wordsArray
// 	.map(word => {
// 		const realization = phonemesToRealization(word);

// 		return `${word},${realization}`;
// 	})
// 	.join('\n');

const csv = dictionary
	.map(word => `${word.realization},${word.phonemes},${word.word}`)
	.join('\n');

// @ts-expect-error
Deno.writeTextFileSync('words.csv', csv);
