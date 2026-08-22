-- AlterTable
ALTER TABLE "User"
ADD COLUMN "totpPendingSecretCiphertext" TEXT,
ADD COLUMN "totpSecretCiphertext" TEXT,
ADD COLUMN "totpEnabledAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "SecurityAuditEvent" (
    "id" UUID NOT NULL,
    "actorId" UUID,
    "action" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SecurityAuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SecurityAuditEvent_actorId_occurredAt_idx" ON "SecurityAuditEvent"("actorId", "occurredAt");

-- CreateIndex
CREATE INDEX "SecurityAuditEvent_action_occurredAt_idx" ON "SecurityAuditEvent"("action", "occurredAt");

-- AddForeignKey
ALTER TABLE "SecurityAuditEvent" ADD CONSTRAINT "SecurityAuditEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
