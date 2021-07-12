import {FastifyInstance} from 'fastify';
import {authHandler} from '../handlers/AuthHandler';
import {deleteZone, fetchAllZones} from '../util/Cloudflare';
import colors from '../util/colors.json';
import {sendDomainLog} from '../util/LogUtil';
import {deletev1Domain} from '../util/v1Util';
import {Domain} from './../documents/Domain';
import {EmbedBuilder} from './../util/Embed';

export default async function DomainRouter(router: FastifyInstance) {
  router.get('/list', {preHandler: authHandler}, async (req, res) => {
    const domains = await Domain.find({}).select('domain _id');

    return res.send({domains});
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
        .addField('Zone Status', `\`\`\`${zone.status}\`\`\``, true)
        .addField(
          'NameServers',
          `\`\`\`${zone.original_name_servers[0]} --> ${zone.name_servers[0]} \n ${zone.original_name_servers[1]} --> ${zone.name_servers[1]}\`\`\``,
          true
        );

      try {
        sendDomainLog(embed);

        await deleteZone(zone.id);
        await deletev1Domain(zone.name);
      } catch (err) {
        console.error(err);
      }
    }
  }
}

const autoPrefix = '/domains';
