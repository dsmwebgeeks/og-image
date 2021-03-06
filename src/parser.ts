import { IncomingMessage } from 'http';
import { parse } from 'url';

export function parseRequest(req: IncomingMessage) {
    console.log('HTTP ' + req.url);
    const { pathname = '/', query = {} } = parse(req.url || '', true);
    const { fontSize, images, theme, md } = query;

    if (Array.isArray(fontSize)) {
        throw new Error('Expected a single fontSize');
    }
    if (Array.isArray(theme)) {
        throw new Error('Expected a single theme');
    }

    const arr = pathname.slice(1).split('.');
    let extension = '';
    let text = '';
    if (arr.length === 0) {
        text = '';
    } else if (arr.length === 1) {
        text = arr[0];
    } else {
        extension = arr.pop() as string;
        text = arr.join('.');
    }

    const parsedRequest: ParsedRequest = {
        fileType: extension === 'jpeg' ? extension : 'png',
        text: decodeURIComponent(text),
        theme: theme as Theme,
        md: md === '1' || md === 'true',
        fontSize: fontSize || '96px',
        images: Array.isArray(images) ? images : [images],
    };
    parsedRequest.images = getDefaultImages(parsedRequest.images, parsedRequest.theme);
    return parsedRequest;
}

function getDefaultImages(images: string[], theme: Theme) {
    if (images.length > 0 && images[0] && images[0].includes('wg-logo.svg')) {
        return images;
    }
    return theme === 'light'
    ? ['https://files-1w5r2ne8r.now.sh/wg-logo.svg']
    : ['https://files-1w5r2ne8r.now.sh/wg-logo.svg'];
}
