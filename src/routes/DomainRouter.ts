import {EmbedBuilder} from './../util/Embed';
import {FastifyInstance} from 'fastify';
import {authHandler} from '../handlers/AuthHandler';
import {cf, fetchAllZones} from '../util/Cloudflare';
import {sendCloudflareLog} from '../util/LogUtil';
import colors from '../util/colors.json';
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
          `Zone ${zone.name} has been removed from your Cloudflare account.`
        )
        .addField('Zone ID', `\`\`\`${zone.id}\`\`\``, true)
        .addField('Zone Status', `\`\`\`${zone.status}\`\`\``, true);
      sendCloudflareLog(embed);
      await cf.zones.del(zone.id);
    }
  }
}

export const autoPrefix = '/domains';
