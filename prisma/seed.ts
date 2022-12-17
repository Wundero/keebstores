import { prisma } from '../src/server/db/client';
import fs from 'fs';

const file = __dirname + "/stores.csv";

const data = fs.readFileSync(file, 'utf8');
const lines = data.replace(/\r/g, '').split('\n');

const main = async () => {
    for (const line of lines.slice(1)) {
        if (line === '') continue;
        const parts = line.split(',');
        const [name, url, status, isManufacturer, region, shipsTo] = parts.map((p) => p.trim());
        let productstr = parts.slice(6).join(',')
        if (productstr.startsWith('"')) {
            productstr = productstr.slice(1, -1);
        }
        const products = productstr.split(',').map((p) => p.trim());

        await prisma.store.upsert({
            where: {
                url: url,
            },
            update: {
                status,
            },
            create: {
                name: name!,
                url: url!,
                status: status!,
                isManufacturer: isManufacturer === 'TRUE',
                region: region!,
                shipsTo: shipsTo!,
                products: {
                    connectOrCreate: products.map((product) => {
                        return {
                            create: {
                                type: product,
                            },
                            where: {
                                type: product,
                            },
                        };
                    }),
                },
            },
        });
    }
};

main().then(console.log).catch(console.error);
