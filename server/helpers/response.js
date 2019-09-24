export default function wrapper(rawData) {
    const data = { ...rawData };
    data.results = data.docs;
    delete data.docs;
    return data;
}
