import { createRouter } from './context';
import { z } from 'zod';

export const storeRouter = createRouter()
    .query('search', {
        input: z.object({
            name: z.string().nullish(),
            products: z.array(z.string()),
            shipping: z.array(z.string()),
            regions: z.array(z.string()),
            sorts: z.array(
                z.object({
                    field: z.enum(['name', 'region', 'shipsTo', 'isManufacturer', 'url']),
                    direction: z.enum(['asc', 'desc']),
                }),
            ),
        }),
        async resolve({ input, ctx }) {
            const { name, products, shipping, regions, sorts } = input;

            const orderBy = sorts.map((sort) => {
                return {
                    [sort.field]: sort.direction,
                };
            });

            const nameQuery =
                name && name.length > 0
                    ? ({
                          contains: name,
                          mode: 'insensitive',
                      } as {
                          contains: string;
                          mode: 'insensitive';
                      })
                    : undefined;

            const typeQuery =
                products.length > 0
                    ? {
                          in: products,
                      }
                    : undefined;

            const shipsQuery =
                shipping.length > 0
                    ? {
                          in: shipping,
                      }
                    : undefined;

            const regionQuery =
                regions.length > 0
                    ? {
                          in: regions,
                      }
                    : undefined;

            const stores = await ctx.prisma.store.findMany({
                where: {
                    name: nameQuery,
                    shipsTo: shipsQuery,
                    region: regionQuery,
                    products: {
                        some: {
                            type: typeQuery,
                        },
                    },
                },
                orderBy,
                include: {
                    products: true,
                },
            });
            return stores;
        },
    })
    .query('stores', {
        async resolve({ ctx }) {
            const stores = await ctx.prisma.store.findMany({
                orderBy: {
                    name: 'asc',
                },
                select: {
                    name: true,
                },
            });
            return stores.map((s) => s.name);
        },
    })
    .query('regions', {
        async resolve({ ctx }) {
            const regions = await ctx.prisma.store.groupBy({
                by: ['region'],
            });
            return regions.map((r) => r.region);
        },
    })
    .query('ships', {
        async resolve({ ctx }) {
            const ships = await ctx.prisma.store.groupBy({
                by: ['shipsTo'],
            });
            return ships.map((r) => r.shipsTo);
        },
    })
    .query('products', {
        async resolve({ ctx }) {
            const products = await ctx.prisma.product.findMany({
                orderBy: {
                    type: 'asc',
                },
            });
            return products;
        },
    });
