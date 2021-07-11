import axios, {Method} from 'axios';
import Cloudflare from 'cloudflare';
import config from '../config/config.json';

export const cf = new Cloudflare({
  email: config.cloudflare.email,
  key: config.cloudflare.apiKey,
});

async function request(
  endpoint: string,
  method: Method,
  body?: object,
  params?: object
) {
  try {
    const baseUrl = 'https://api.cloudflare.com/client/v4';
    const {data} = await axios({
      url: `${baseUrl}${endpoint}`,
      method,
      headers: {
        'X-Auth-Email': config.cloudflare.email,
        'X-Auth-Key': config.cloudflare.apiKey,
        'Content-Type': 'application/json',
      },
      data: body ? body : null,
      params: params ? params : null,
    });

    return data;
  } catch (err) {
    throw new Error(err.response.data.errors[0].message);
  }
}

/**
 * Get all cloudflare zones.
 *
 * @export
 * @param {number} [page=1] - The page number.
 * @return {*} The list of zones
 */
export async function fetchAllZones(page = 1) {
  const data = await request(
    '/zones',
    'GET',
    {},
    {
      per_page: 50,
      page: page,
    }
  );

  if (page < data.data.result_info.total_pages) {
    data.data.result = data.data.result.concat(await fetchAllZones(page + 1));
  }

  return data.data.result;
}
