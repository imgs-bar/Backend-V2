import {promisify} from 'util';
import {redis} from '../index';

const getAsync = promisify(redis.get).bind(redis);

export async function getFromRedis(
  name: string,
  defaultValue = 1
): Promise<any> {
  const val = await getAsync(name);
  if (!val) {
    await setInRedis(name, defaultValue);
    return defaultValue;
  }
  return val;
}

export async function setInRedis(name: string, value: any) {
  redis.set(name, value);
}

export async function getNextUid() {
  const uid = await getFromRedis('uid', 1);
  await setInRedis('uid', uid + 1);
  return uid;
}