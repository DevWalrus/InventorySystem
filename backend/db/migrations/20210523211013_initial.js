const Knex = require('knex');

const tableNames = require('../../src/constants/tableNames');

const {
    addDefaultColumns,
    createNameTable,
    url,
    email,
    references,
} = require('../../src/lib/tableUtils');

/** 
 * @param {Knex} knex
 */
exports.up = async (knex) => {
    console.log('Creating:', tableNames.user);
    console.log('Creating:', tableNames.item_type);
    console.log('Creating:', tableNames.company_type);
    console.log('Creating:', tableNames.shape);
    console.log('Creating:', tableNames.inventory_location);

    await Promise.all([
        knex.schema.createTable(tableNames.user, (table) => {
            table.increments().notNullable();
            email(table, 'email').notNullable().unique();
            table.string('name').notNullable();
            table.string('password', 500).notNullable();
            table.datetime('last_login');
            addDefaultColumns(table);
        }),
        createNameTable(knex, tableNames.item_type),
        createNameTable(knex, tableNames.company_type),
        createNameTable(knex, tableNames.shape),
        knex.schema.createTable(tableNames.inventory_location, (table) => {
            table.increments().notNullable();
            table.string('name').notNullable().unique();
            table.string('description', 1000);
            url(table, 'image_url');
            addDefaultColumns(table);
        }),
    ]);

    console.log('Creating:', tableNames.country);
    await knex.schema.createTable(tableNames.country, (table) => {
        table.increments().notNullable();
        table.string('name').notNullable().unique();
        table.string('code', 2).notNullable().unique();
        addDefaultColumns(table);
    });

    console.log('Creating:', tableNames.subnationalDivision);
    await knex.schema.createTable(tableNames.subnationalDivision, (table) => {
        table.increments().notNullable();
        references(table, tableNames.country)
        table.string('name').notNullable().unique();
        table.string('code', 2).notNullable().unique();
        addDefaultColumns(table);
    });

    console.log('Creating:', tableNames.address);
    await knex.schema.createTable(tableNames.address, (table) => {
        table.increments().notNullable();
        references(table, tableNames.subnationalDivision, false);
        references(table, tableNames.country);
        table.string('street_address_1', 50).notNullable();
        table.string('street_address_2', 50);
        table.string('city', 50).notNullable();
        table.string('zipcode', 15).notNullable();
        table.float('latitude').notNullable();
        table.float('longitude').notNullable();
        addDefaultColumns(table);
    });
    
    console.log('Creating:', tableNames.company);
    await knex.schema.createTable(tableNames.company, (table) => {
        table.increments().notNullable();
        references(table, tableNames.address);
        references(table, tableNames.company_type);
        table.string('name').notNullable();
        url(table, 'logo_url');
        table.string('description', 1000);
        url(table, 'website_url');
        email(table, 'email');
        addDefaultColumns(table);
    });

    console.log('Creating:', tableNames.size);
    await knex.schema.createTable(tableNames.size, (table) => {
        table.increments().notNullable();
        references(table, tableNames.shape);
        table.string('name').notNullable();
        table.float('length');
        table.float('width');
        table.float('height').notNullable();
        table.float('volume');
        addDefaultColumns(table);
    });
    console.log('Creating:', tableNames.item);
    await knex.schema.createTable(tableNames.item, (table) => {
        table.increments().notNullable();
        references(table, tableNames.user);
        references(table, tableNames.item_type);
        references(table, tableNames.company, true, 'manufacturer');
        references(table, tableNames.size);
        table.string('name').notNullable();
        table.string('description', 1000);
        table.float('msrp').notNullable().defaultTo(0);
        table.string('sku', 42);
        addDefaultColumns(table);
    });

    console.log('Creating:', tableNames.item_info);
    await knex.schema.createTable(tableNames.item_info, (table) => {
        table.increments().notNullable();
        references(table, tableNames.item);
        references(table, tableNames.user);
        references(table, tableNames.company, true, 'retailer');
        references(table, tableNames.inventory_location);
        table.datetime('purchase_date');
        table.datetime('expiration_date');
        table.datetime('last_used');
        table.float('purchase_price').notNullable().defaultTo(0);
        addDefaultColumns(table);
    });

    console.log('Creating:', tableNames.item_image);
    await knex.schema.createTable(tableNames.item_image, (table) => {
        table.increments().notNullable();
        references(table, tableNames.item);
        url(table, 'image_url');
        addDefaultColumns(table);
    });

    console.log('Creating:', tableNames.related_item);
    await knex.schema.createTable(tableNames.related_item, (table) => {
        table.increments().notNullable();
        references(table, tableNames.item);
        references(table, tableNames.item, true, 'related_item');
        addDefaultColumns(table);
    });
};

exports.down = async (knex) => {
    await Promise.all([
        tableNames.user,
        tableNames.item_type,
        tableNames.company_type,
        tableNames.shape,
        tableNames.inventory_location,
        tableNames.country,
        tableNames.subnationalDivision,
        tableNames.address,
        tableNames.company,
        tableNames.size,
        tableNames.item,
        tableNames.item_info,
        tableNames.item_image,
        tableNames.related_item,
        ].reverse().map((tableName) => knex.schema.dropTableIfExists(tableName)));
};
