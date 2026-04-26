-- CreateTable
CREATE TABLE "personas" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "background" TEXT NOT NULL,
    "traits" TEXT[],
    "model_family" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "personas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_sessions" (
    "id" SERIAL NOT NULL,
    "game_type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'waiting',
    "config" JSONB NOT NULL DEFAULT '{}',
    "timeline" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "result" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_participants" (
    "id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "persona_id" INTEGER NOT NULL,
    "seat_index" INTEGER NOT NULL,
    "model_name" TEXT NOT NULL,
    "stake_sats" INTEGER NOT NULL DEFAULT 0,
    "payoff_sats" INTEGER NOT NULL DEFAULT 0,
    "final_action" TEXT,

    CONSTRAINT "game_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_records" (
    "id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "direction" TEXT NOT NULL,
    "amount_sats" INTEGER NOT NULL,
    "lnbits_payment" JSONB,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "game_participants_session_id_seat_index_key" ON "game_participants"("session_id", "seat_index");

-- AddForeignKey
ALTER TABLE "game_participants" ADD CONSTRAINT "game_participants_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "game_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_participants" ADD CONSTRAINT "game_participants_persona_id_fkey" FOREIGN KEY ("persona_id") REFERENCES "personas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_records" ADD CONSTRAINT "payment_records_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "game_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
