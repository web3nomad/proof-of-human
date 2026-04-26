-- DropForeignKey
ALTER TABLE "game_participants" DROP CONSTRAINT "game_participants_persona_id_fkey";

-- AlterTable
ALTER TABLE "game_participants" ADD COLUMN     "human_alias" TEXT,
ADD COLUMN     "is_human" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "persona_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "game_participants" ADD CONSTRAINT "game_participants_persona_id_fkey" FOREIGN KEY ("persona_id") REFERENCES "personas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
