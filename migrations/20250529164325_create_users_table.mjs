
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    console.log("Running migration...");
    await knex.schema.createTable('positions', (table) => {
        table.increments('id').primary();
        table.string('position').notNullable().unique();
    });

    await knex.schema.createTable('user', (table) => {
        table.increments('id').primary();
        table.string('first_name').notNullable();
        table.string('last_name').notNullable();
        table.string('username').notNullable().unique();
        table.string('email').notNullable().unique();
        table
        .integer('position')
        .unsigned()
        .references('id')
        .inTable('positions')
        .onDelete('CASCADE');
        table.string('password').notNullable();
        table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
        table.datetime('updated_at');
    });

    await knex.schema.createTable('user_attendance', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().references('id').inTable('user');
        table.datetime('attendance_at').notNullable();
        table.string('img_url').notNullable();
        table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
        table.datetime('updated_at');
    });

    await knex.schema.createTable('admin', (table) => {
        table.increments('id').primary();
        table.string('username').notNullable().unique();
        table.string('password').notNullable();
        table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
        table.datetime('updated_at');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    await knex.schema.dropTableIfExists('admin');
    await knex.schema.dropTableIfExists('user_attendance');
    await knex.schema.dropTableIfExists('user');
    await knex.schema.dropTableIfExists('positions');
};

