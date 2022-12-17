import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useState, Fragment, SetStateAction, Dispatch, useEffect } from 'react';
import { trpc } from '../utils/trpc';
import { MdFilterList, MdSave, MdClose, MdCheck } from 'react-icons/md';
import { TbSelector, TbArrowDown } from 'react-icons/tb';
import { Dialog, Combobox, Transition } from '@headlessui/react';

type TechnologyCardProps = {
    name: string;
    description: string;
    documentation: string;
};

const rainbow: string[] = [
    'text-red-500',
    'text-orange-500',
    'text-yellow-500',
    'text-green-500',
    'text-blue-500',
    'text-indigo-500',
    'text-purple-500',
];

type MyComboBoxProps<T> = {
    options: string[];
    multiple?: boolean;
    selected: T;
    label: string;
    setSelected: Dispatch<SetStateAction<T>>;
    queryIsSelected?: boolean;
};

function MyComboBox<T>({ options, selected, setSelected, multiple, label, queryIsSelected }: MyComboBoxProps<T>) {
    const [query, setQuery] = useState(queryIsSelected ? selected : '');

    useEffect(() => {
        if (queryIsSelected) {
            // @ts-ignore
            setSelected(query);
        }
    }, [queryIsSelected, query, setSelected]);

    const filteredOptions =
        (query as string).length > 0 ? options.filter((option) => option.toLowerCase().includes((query as string).toLowerCase())) : options;

    return (
        <Combobox
            multiple={multiple}
            value={selected}
            onChange={(sel) => {
                if (queryIsSelected) {
                    setQuery(sel);
                    setSelected(sel);
                } else {
                    setSelected(sel);
                }
            }}
        >
            <div className="relative mt-1">
                <div className="px-2">
                    <Combobox.Label className="text-lg pr-2">{label}</Combobox.Label>
                    {Array.isArray(selected) &&
                        selected.map((opt, index) => {
                            return (
                                <Fragment key={opt}>
                                    <button
                                        onClick={() => {
                                            if (queryIsSelected) {
                                                setQuery('');
                                            }
                                            setSelected((selected as unknown as any[]).filter((o) => o !== opt) as unknown as  T);
                                        }}
                                        className={
                                            rainbow[index % rainbow.length] +
                                            ' font-bold btn btn-ghost btn-sm btn-outline m-1'
                                        }
                                    >
                                        {opt}
                                    </button>
                                </Fragment>
                            );
                        })}
                </div>
                <div className="p-2">
                    <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                        <Combobox.Input
                            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                            onChange={(event) => setQuery(event.target.value)}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                            {!multiple && selected && (
                                <button onClick={() => setQuery('')}>
                                    <MdClose className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </button>
                            )}
                            <Combobox.Button>
                                <TbSelector className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </Combobox.Button>
                        </div>
                    </div>
                </div>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => {
                        if (!queryIsSelected) {
                            setQuery('');
                        }
                    }}
                >
                    <Combobox.Options className="absolute z-50 -mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredOptions.length === 0 && (query as string).length > 0 && (
                            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                Nothing found.
                            </div>
                        )}
                        {filteredOptions.map((filteredOption) => (
                            <Combobox.Option
                                key={filteredOption}
                                value={filteredOption}
                                className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                        active ? 'bg-teal-600 text-white' : 'text-gray-900'
                                    }`
                                }
                            >
                                {({ selected, active }) => (
                                    <>
                                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                            {filteredOption}
                                        </span>
                                        {selected ? (
                                            <span
                                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                    active ? 'text-white' : 'text-teal-600'
                                                }`}
                                            >
                                                <MdCheck className="h-5 w-5" aria-hidden="true" />
                                            </span>
                                        ) : null}
                                    </>
                                )}
                            </Combobox.Option>
                        ))}
                    </Combobox.Options>
                </Transition>
            </div>
        </Combobox>
    );
}

type FilterDialogProps = {
    open: boolean;
    onClose: () => void;
    selectedProducts: string[];
    productOptions: string[] | undefined;
    storeOptions: string[] | undefined;
    setSelectedProducts: Dispatch<SetStateAction<string[]>>;
    storeQuery: string;
    setStoreQuery: Dispatch<SetStateAction<string>>;
    shippingOptions: string[] | undefined;
    selectedShipping: string[];
    setSelectedShipping: Dispatch<SetStateAction<string[]>>;
    regionOptions: string[] | undefined;
    selectedRegions: string[];
    setSelectedRegions: Dispatch<SetStateAction<string[]>>;
};

const FilterDialog: React.FC<FilterDialogProps> = ({
    open,
    onClose,
    productOptions,
    regionOptions,
    selectedRegions,
    selectedShipping,
    setSelectedRegions,
    setSelectedShipping,
    shippingOptions,
    selectedProducts,
    setSelectedProducts,
    setStoreQuery,
    storeOptions,
    storeQuery,
}) => {
    const [spo, sspo] = useState(selectedProducts);
    const [ss, sss] = useState(storeQuery);
    const [sso, ssso] = useState(selectedShipping);
    const [sro, ssro] = useState(selectedRegions);

    return (
        <Dialog className="relative z-50" open={open} onClose={onClose}>
            <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-lg rounded bg-slate-700">
                    <Dialog.Title className="p-1 text-2xl text-center">Filter Stores</Dialog.Title>
                    <div>
                        {productOptions && (
                            <MyComboBox
                                multiple={true}
                                label="Products:"
                                options={productOptions}
                                selected={spo}
                                setSelected={sspo}
                            />
                        )}
                        {storeOptions && (
                            <MyComboBox
                                queryIsSelected={true}
                                label="Store:"
                                options={storeOptions}
                                selected={ss}
                                setSelected={sss}
                            />
                        )}
                        {regionOptions && (
                            <MyComboBox
                                multiple={true}
                                label="Regions:"
                                options={regionOptions}
                                selected={sro}
                                setSelected={ssro}
                            />
                        )}
                        {shippingOptions && (
                            <MyComboBox
                                multiple={true}
                                label="Ships to:"
                                options={shippingOptions}
                                selected={sso}
                                setSelected={ssso}
                            />
                        )}
                    </div>
                    <div className="flex justify-around p-2">
                        <button
                            className="btn btn-circle btn-success"
                            onClick={() => {
                                setSelectedProducts(spo);
                                setStoreQuery(ss);
                                setSelectedShipping(sso);
                                setSelectedRegions(sro);
                                onClose();
                            }}
                        >
                            <MdSave size={24} />
                        </button>
                        <button className="btn btn-circle" onClick={onClose}>
                            <MdClose />
                        </button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

type Sort = {
    field: 'region' | 'name' | 'shipsTo' | 'isManufacturer' | 'url';
    direction: 'asc' | 'desc';
};

const headers = [
    {
        label: 'Name',
        field: 'name',
    },
    {
        label: 'Region',
        field: 'region',
    },
    {
        label: 'Ships To',
        field: 'shipsTo',
    },
    {
        label: 'Store Type',
        field: 'isManufacturer',
    },
    {
        label: 'Website',
        field: 'url',
    },
] as const;

const Home: NextPage = () => {
    const [name, setName] = useState<string>('');
    const [products, setProducts] = useState<string[]>([]);
    const [shipping, setShipping] = useState<string[]>([]);
    const [regions, setRegions] = useState<string[]>([]);
    const [sorts, setSorts] = useState<Sort[]>([
        {
            direction: 'asc',
            field: 'name',
        },
    ]);
    const stores = trpc.useQuery(['stores.search', { name, products, shipping, regions, sorts }]);
    const storesList = trpc.useQuery(['stores.stores']);
    const productList = trpc.useQuery(['stores.products']);
    const regionList = trpc.useQuery(['stores.regions']);
    const shippingList = trpc.useQuery(['stores.ships']);

    const [filterOpen, setFilterOpen] = useState(false);

    return (
        <>
            <Head>
                <title>keebstores</title>
                <meta name="description" content="Keyboard store finder" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <FilterDialog
                open={filterOpen}
                onClose={() => setFilterOpen(false)}
                productOptions={productList.data?.map((product) => product.type)}
                selectedProducts={products}
                setSelectedProducts={setProducts}
                storeOptions={storesList.data}
                storeQuery={name}
                setStoreQuery={setName}
                shippingOptions={shippingList.data}
                regionOptions={regionList.data}
                selectedShipping={shipping}
                setSelectedShipping={setShipping}
                selectedRegions={regions}
                setSelectedRegions={setRegions}
            />
            <main className="container mx-auto flex flex-col items-center justify-center h-screen p-4">
                <div className="overflow-auto shadow-lg rounded-lg">
                    <table className="table w-full relative">
                        <thead className="sticky z-10 top-0">
                            <tr>
                                {headers.map((h) => {
                                    const onClick = () => {
                                        setSorts((old) => {
                                            const existing = old.find((v) => v.field === h.field);
                                            if (existing) {
                                                if (existing.direction === 'asc') {
                                                    return [
                                                        ...old.filter((v) => v.field !== h.field),
                                                        {
                                                            field: h.field,
                                                            direction: 'desc',
                                                        },
                                                    ];
                                                }
                                                return old.filter((v) => v.field !== h.field);
                                            } else {
                                                return [
                                                    ...old,
                                                    {
                                                        field: h.field,
                                                        direction: 'asc',
                                                    },
                                                ];
                                            }
                                        });
                                    };
                                    return (
                                        <th key={h.field}>
                                            <div className="flex items-center gap-1">
                                                {h.label}
                                                {sorts.find((v) => v.field === h.field) ? (
                                                    <button
                                                        className="btn btn-circle btn-sm btn-ghost"
                                                        onClick={onClick}
                                                    >
                                                        <TbArrowDown
                                                            className={`${
                                                                sorts.find((v) => v.field === h.field)?.direction ===
                                                                'asc'
                                                                    ? 'rotate-180'
                                                                    : ''
                                                            } transition-all`}
                                                        />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={onClick}
                                                        className="btn btn-circle btn-sm btn-ghost opacity-0 hover:opacity-70"
                                                    >
                                                        <TbArrowDown className="rotate-180 transition-all" />
                                                    </button>
                                                )}
                                            </div>
                                        </th>
                                    );
                                })}
                                <th key={'products'}>Product Types</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stores.data?.map((store) => {
                                return (
                                    <tr className="hover relative" key={store.id}>
                                        <td>{store.name}</td>
                                        <td>{store.region}</td>
                                        <td>{store.shipsTo}</td>
                                        <td>{store.isManufacturer ? 'Manufacturer & Store' : 'Store'}</td>
                                        <td className="link">
                                            <a href={store.url} className="rowlink" target="_blank" rel="noreferrer">
                                                {store.url}
                                            </a>
                                        </td>
                                        <td>
                                            {store.products
                                                .map((product) => {
                                                    return product.type;
                                                })
                                                .join(', ')}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </main>
            <div className="fixed bottom-0 right-0">
                <div className="p-4">
                    <button className="btn btn-circle btn-lg" onClick={() => setFilterOpen(true)}>
                        <MdFilterList size={32} />
                    </button>
                </div>
            </div>
        </>
    );
};

export default Home;
