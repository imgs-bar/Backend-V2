import {EmbedBuilder} from './../util/Embed';
import {FastifyInstance} from 'fastify';
import {authHandler} from '../handlers/AuthHandler';
import {cf, fetchAllZones} from '../util/Cloudflare';
import {sendDomainLog} from '../util/LogUtil';
import colors from '../util/colors.json';
import {deletev1Domain} from '../util/v1Util';
export default async function DomainRouter(router: FastifyInstance) {
  router.get('/list', {preHandler: authHandler}, async (req, res) => {
    res.send({
      message: 'Hello world!',
    });
  });
}

export async function checkDomains() {
  const cfzones = await fetchAllZones();
  for (const zone of cfzones) {
    if (zone.status !== 'active') {
      const embed = new EmbedBuilder()
        .setTitle(`${zone.name} Removed from the account`)
        .setColor(colors.cloudflare)
        .setDescription(
          `Zone ${zone.name} has been removed from the Cloudflare account.`
        )
        .addField('Zone ID', `\`\`\`${zone.id}\`\`\``, true)
        .addField('Zone Status', `\`\`\`${zone.status}\`\`\``, true);

      try {
        sendDomainLog(embed);

        await deletev1Domain(zone.name);
        await cf.zones.del(zone.id);
      } catch (err) {
        console.error(err);
      }
    }
  }
}

export const autoPrefix = '/domains';
