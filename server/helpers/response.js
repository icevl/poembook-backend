export default function wrapper(data) {
    data.results = data.docs;
    delete data.docs;
    return data;
}
