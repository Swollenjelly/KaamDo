import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1759472622557 implements MigrationInterface {
  name = 'Auto1759472622557'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1) Add phone column as NULLABLE first
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "phone" character varying(15)`);

    // 2) Backfill unique placeholder phone numbers for existing rows
    //    Using a sequence to generate 10-digit numbers starting at 9000000000
    await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS users_phone_seq START 9000000000`);
    await queryRunner.query(`
      UPDATE "users"
      SET "phone" = NEXTVAL('users_phone_seq')::varchar
      WHERE "phone" IS NULL
    `);

    // 3) Enforce NOT NULL
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "phone" SET NOT NULL`);

    // 4) Enforce UNIQUE on phone
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "UQ_users_phone" ON "users" ("phone")`);

    // 5) Make email optional (nullable). Unique on email can remain as-is.
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert email to NOT NULL
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL`);

    // Drop phone unique index
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_users_phone"`);

    // Drop phone column
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);

    // Drop the sequence used for backfill
    await queryRunner.query(`DROP SEQUENCE IF EXISTS users_phone_seq`);
  }
}
