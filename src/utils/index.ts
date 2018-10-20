export const hasKeyword = (keyword: string, text: string) => {
    const words = text.toLowerCase().trim().split(' ');
    return words.indexOf(keyword) !== -1
};

export const splitByKeyword = (keyword: string, text: string) => {
    const words = text.toLowerCase().trim().split(' ');

    let hadKeyword = false;
    let context = [];
    let command = [];
    for(let word of words) {
        if(hadKeyword) {
            if(word === keyword) continue;
            command.push(word)
        }
        else if(word === keyword) {
            hadKeyword = true
        }
        else {
            context.push(word)
        }
    }

    return {
        context: context.join(' '),
        command: command.join(' ')
    }
};

export const extractVoiceEmoji = (emojiList: string[], text: string) => {
    text = text.toLowerCase();

    for(let emoji of emojiList) {
        if(text.indexOf(emoji) !== -1) return emoji;
    }

    return false
};