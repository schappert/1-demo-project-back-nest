import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTablesFromEntities1757936884099 implements MigrationInterface {
    name = 'CreateTablesFromEntities1757936884099'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "username" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`);
    }

}
