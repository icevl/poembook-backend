import config from '../../config/config';

async function findWithPaginate(model, options, cacheTable = '') {
    const page = options.page ? options.page : 1;
    const countingOptions = {};
    const findOptions = {
        ...options,
        limit: config.paginatorSize,
        offset: (page - 1) * config.paginatorSize
    };

    if (options.where) {
        countingOptions.where = options.where;
    }

    const total = await model.findAndCountAll(countingOptions);
    let response;

    if (!cacheTable) {
        response = await model.findAll(findOptions);
    } else {
        response = await model.cache(cacheTable).findAll(findOptions);
    }

    return {
        total: total.count,
        pages: Math.floor((total.count + (config.paginatorSize - 1)) / config.paginatorSize),
        results: response
    };
}

// export default function wrapper(rawData) {
//     const data = { ...rawData };
//     data.results = data.docs;
//     delete data.docs;
//     return data;
// }

export default { findWithPaginate };
