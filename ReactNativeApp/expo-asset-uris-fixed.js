export function getFilename(url) {
    const { pathname, searchParams } = new URL(url, 'https://e');
    if (__DEV__) {
        if (searchParams.has('unstable_path')) {
            const encodedFilePath = decodeURIComponent(searchParams.get('unstable_path'));
            return getBasename(encodedFilePath);
        }
    }
    return getBasename(pathname);
}

function getBasename(pathname) {
    return pathname.substring(pathname.lastIndexOf('/') + 1);
}

export function getFileExtension(url) {
    const filename = getFilename(url);
    const dotIndex = filename.lastIndexOf('.');
    return dotIndex > 0 ? filename.substring(dotIndex) : '';
}

export function getManifestBaseUrl(manifestUrl) {
    let url = String(manifestUrl);
    // Normalize the Expo scheme to http(s) without mutating the URL object,
    // since Hermes exposes read-only accessors for URL fields.
    if (url.startsWith('exp://')) {
        url = 'http://' + url.slice('exp://'.length);
    }
    else if (url.startsWith('exps://')) {
        url = 'https://' + url.slice('exps://'.length);
    }
    const urlObject = new URL(url);
    const directory = urlObject.pathname.substring(0, urlObject.pathname.lastIndexOf('/') + 1);
    return urlObject.origin + directory;
}
