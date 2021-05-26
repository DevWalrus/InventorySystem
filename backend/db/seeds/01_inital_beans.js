const tableNames = require('../../src/constants/tableNames')

exports.seed = async (knex) => {

    await knex(tableNames.company_type).insert([
        {
            name: 'Food Manufacturer',
        },
        {
            name: 'Grocery Store',
        },
    ]);

    await knex(tableNames.inventory_location).insert([
        {
            name: 'Kitchen Pantry',
        },
        {
            name: 'Garage Freezer',
        },
        {
            name: 'Kitchen Fridge',
        },
    ]);

    const [new_jersey, idaho, usa, food_manufacturer_type, grocery_store_type, clint, kitchen_pantry] = await Promise.all([
        knex(tableNames.subnationalDivision)
            .where({
                code: 'NJ',
            })
            .first(),
        knex(tableNames.subnationalDivision)
            .where({
                code: 'ID',
            })
            .first(),
        knex(tableNames.country)
            .where({
                code: 'US',
            })
            .first(),
        knex(tableNames.company_type)
            .where({
                name: 'Food Manufacturer',
            })
            .first(),
        knex(tableNames.company_type)
            .where({
                name: 'Grocery Store',
            })
            .first(),
        knex(tableNames.user)
            .where({
                name: 'Clint',
            })
            .first(),
        knex(tableNames.inventory_location)
            .where({
                name: 'Kitchen Pantry',
            })
            .first(),
    ]);

    await knex(tableNames.address).insert([
        {
            street_address_1: '1 Old Bloomfield Avenue',
            city: 'Mountain Lakes',
            zipcode: '07046',
            latitude: 40.889780,
            longitude: -74.444250,
            subnationalDivision_id: new_jersey.id,
            country_id: usa.id,
        },
        {
            street_address_1: '6452 S Main St',
            city: 'Bonners Ferry',
            zipcode: '83805',
            latitude: 48.677310,
            longitude: -116.333280,
            subnationalDivision_id: idaho.id,
            country_id: usa.id,
        },
    ]);

    const [nalley_address, super_1_address] = await Promise.all([
        knex(tableNames.address)
            .where({
                street_address_1: '1 Old Bloomfield Avenue',
            })
            .first(),
        knex(tableNames.address)
            .where({
                street_address_1: '6452 S Main St',
            })
            .first(),
    ]);

    const [manufacturer_id] = await knex(tableNames.company).insert([
        {
            name: 'Nalley',
            logo_url: 'https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-original-577x577/s3/0004/8847/brand.gif?itok=ow-f_lKm',
            description:
                "FINE FOODS Since 1918",
            website_url: 'https://NALLEYFOODS.com/',
            address_id: nalley_address.id,
            company_type_id: food_manufacturer_type.id,
        },
    ])
        .returning('id');

    const [retailer_id] = await knex(tableNames.company).insert([
        {
            name: 'Super 1 Foods',
            logo_url: 'https://ellensburgrodeo.com/wp-content/uploads/2011/04/Super1Foods.jpg',
            description:
                "Local Grocery Store",
            website_url: 'https://super1foods.net/',
            address_id: super_1_address.id,
            company_type_id: grocery_store_type.id,
        },
    ])
        .returning('id');

    const [shape_id] = await knex(tableNames.shape).insert({
        name: 'Stackable Food Can',
    })
        .returning('id');

    const [size_id] = await knex(tableNames.size).insert({
        shape_id,
        name: 'Regular Stackable Food Can',
        width: '6.0',
        height: '4.4375',
        volume: '14.0',
    })
        .returning('id');

    const [item_type_id] = await knex(tableNames.item_type).insert({
        name: 'Canned Goods',
    })
        .returning('id');

    const [item_id] = await knex(tableNames.item).insert({
        user_id: clint.id,
        item_type_id,
        manufacturer_id,
        size_id,
        name: 'Thick Chili Con Carne With Beans',
        description: `For those who like it Thick! Nalley's combines a unique blend of seasonings, ground beef and plump beans in a rich, 
            hearty sauce to create this deliciously thick chili. It's a mild, flavorful chili the whole family can enjoy and is perfect 
            for adding your own special touches like fresh tomatoes, cheese, and onions.`,
        sku: '041321241253',
    })
        .returning('id');

    const [item_image_id] = await knex(tableNames.item_image).insert({
        item_id,
        image_url: 'https://images.barcodelookup.com/3146/31465187-1.jpg',
    })
        .returning('id');

    await knex(tableNames.item_info).insert({
        user_id: clint.id,
        item_id,
        retailer_id,
        inventory_location_id: kitchen_pantry.id,
        expiration_date: '2022-05-16 00:00:00+00',
    });
};
