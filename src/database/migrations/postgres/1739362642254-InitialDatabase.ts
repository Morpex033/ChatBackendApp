import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialDatabase1739362642254 implements MigrationInterface {
    name = 'InitialDatabase1739362642254'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "chats" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying, "isPublic" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" uuid, CONSTRAINT "PK_0117647b3c4a4e5ff198aeb6206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nickname" character varying NOT NULL, "description" character varying, "username" character varying NOT NULL, "dateOfBirth" date NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "role" character varying NOT NULL, "user_id" uuid, CONSTRAINT "UQ_477e3187cedfb5a3ac121e899c9" UNIQUE ("username"), CONSTRAINT "UQ_477e3187cedfb5a3ac121e899c9" UNIQUE ("username"), CONSTRAINT "REL_3000dad1da61b29953f0747632" UNIQUE ("user_id"), CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "account_chat" ("chatsId" uuid NOT NULL, "accountsId" uuid NOT NULL, CONSTRAINT "PK_e0410811a06d53d899b8446dcf4" PRIMARY KEY ("chatsId", "accountsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9cb7bf5fa706057176bc41ea8e" ON "account_chat" ("chatsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_51abe1fce2df29407904bc29a8" ON "account_chat" ("accountsId") `);
        await queryRunner.query(`ALTER TABLE "chats" ADD CONSTRAINT "FK_40d195fcbaada4020f429df8b48" FOREIGN KEY ("ownerId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "FK_3000dad1da61b29953f07476324" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "account_chat" ADD CONSTRAINT "FK_9cb7bf5fa706057176bc41ea8e3" FOREIGN KEY ("chatsId") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "account_chat" ADD CONSTRAINT "FK_51abe1fce2df29407904bc29a85" FOREIGN KEY ("accountsId") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account_chat" DROP CONSTRAINT "FK_51abe1fce2df29407904bc29a85"`);
        await queryRunner.query(`ALTER TABLE "account_chat" DROP CONSTRAINT "FK_9cb7bf5fa706057176bc41ea8e3"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_3000dad1da61b29953f07476324"`);
        await queryRunner.query(`ALTER TABLE "chats" DROP CONSTRAINT "FK_40d195fcbaada4020f429df8b48"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_51abe1fce2df29407904bc29a8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9cb7bf5fa706057176bc41ea8e"`);
        await queryRunner.query(`DROP TABLE "account_chat"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "accounts"`);
        await queryRunner.query(`DROP TABLE "chats"`);
    }

}
