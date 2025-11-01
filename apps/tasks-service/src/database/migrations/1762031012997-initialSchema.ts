import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1762031012997 implements MigrationInterface {
    name = 'InitialSchema1762031012997'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "task_comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL, "userId" uuid NOT NULL, "taskId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_83b99b0b03db29d4cafcb579b77" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "task_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "field" character varying(50) NOT NULL, "oldValue" text NOT NULL, "newValue" text NOT NULL, "taskId" uuid NOT NULL, "changedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_716670443aea4a2f4a599bb7c53" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."tasks_priority_enum" AS ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT')`);
        await queryRunner.query(`CREATE TYPE "public"."tasks_status_enum" AS ENUM('TODO', 'IN_PROGRESS', 'REVIEW', 'DONE')`);
        await queryRunner.query(`CREATE TABLE "tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" text NOT NULL, "dueDate" TIMESTAMP NOT NULL, "priority" "public"."tasks_priority_enum" NOT NULL DEFAULT 'MEDIUM', "status" "public"."tasks_status_enum" NOT NULL DEFAULT 'TODO', "creatorId" uuid NOT NULL, "assignedUserIds" uuid array NOT NULL DEFAULT '{}', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "task_comments" ADD CONSTRAINT "FK_ba265816ca1d93f51083e06c520" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_history" ADD CONSTRAINT "FK_158887786322644785a61e6980e" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_history" DROP CONSTRAINT "FK_158887786322644785a61e6980e"`);
        await queryRunner.query(`ALTER TABLE "task_comments" DROP CONSTRAINT "FK_ba265816ca1d93f51083e06c520"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."tasks_priority_enum"`);
        await queryRunner.query(`DROP TABLE "task_history"`);
        await queryRunner.query(`DROP TABLE "task_comments"`);
    }

}
