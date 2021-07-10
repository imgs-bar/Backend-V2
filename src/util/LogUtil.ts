import {EmbedBuilder} from './Embed';
import axios from 'axios';
import config from '../config/config.json';

//Send embed to a discord webhook via axios
export async function sendPremiumExpire(embed: EmbedBuilder) {
  const options = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const response = await axios.post(
    `${config.webhooks.premium}`,
    embed,
    options
  );
  return response;
}
