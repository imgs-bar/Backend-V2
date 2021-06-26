import {User} from '../documents/User';
import emojis from './emojis.json';
import uniqueRandomArray from 'unique-random-array';
import {extname} from 'path';

const getRandomEmoji = uniqueRandomArray(emojis);

export function generateFileName(user: User, fileName: string) {
  return (user.settings.emojiUrl
    ? generateRandomEmojis(user.settings.longUrl ? 10 : 5)
    : generateRandomString(user.settings.longUrl ? 10 : 5)) +
    user.settings.showExtension
    ? extname(fileName)
    : '';
}
export function generateRandomString(length: number) {
  const randomChars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length)
    );
  }
  return result;
}

export function generateRandomEmojis(length: number) {
  let randomEmojis = '';
  for (let i = 0; i < length; i++) {
    randomEmojis = randomEmojis + getRandomEmoji();
  }
  return randomEmojis;
}
