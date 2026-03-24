import prisma from "@/lib/prisma";

export type StoredChatMessage = {
  id: number;
  text: string;
  sender: "bot" | "user" | "agent";
  time: string;
  channel: string;
};

type ConversationRow = {
  id: number;
  sessionId: string;
};

const CHAT_TABLE_STATEMENTS = [
  `
    CREATE TABLE IF NOT EXISTS "CustomerConversation" (
      "id" SERIAL PRIMARY KEY,
      "sessionId" TEXT NOT NULL UNIQUE,
      "status" TEXT NOT NULL DEFAULT 'OPEN',
      "customerPhone" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "latestMessageAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `,
  `
    CREATE TABLE IF NOT EXISTS "CustomerMessage" (
      "id" SERIAL PRIMARY KEY,
      "conversationId" INTEGER NOT NULL REFERENCES "CustomerConversation"("id") ON DELETE CASCADE,
      "sender" TEXT NOT NULL,
      "channel" TEXT NOT NULL DEFAULT 'WEB',
      "text" TEXT NOT NULL,
      "whatsappMessageId" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `,
  `
    CREATE INDEX IF NOT EXISTS "CustomerMessage_conversationId_createdAt_idx"
    ON "CustomerMessage"("conversationId", "createdAt")
  `,
] as const;

let tablesReady = false;

export async function ensureChatTables() {
  if (tablesReady) return;

  for (const statement of CHAT_TABLE_STATEMENTS) {
    await (prisma as any).$executeRawUnsafe(statement);
  }
  tablesReady = true;
}

export async function getOrCreateConversation(sessionId: string) {
  await ensureChatTables();

  const rows = (await (prisma as any).$queryRawUnsafe(
    `
      INSERT INTO "CustomerConversation" ("sessionId", "updatedAt", "latestMessageAt")
      VALUES ($1, NOW(), NOW())
      ON CONFLICT ("sessionId")
      DO UPDATE SET "updatedAt" = NOW()
      RETURNING "id", "sessionId"
    `,
    sessionId,
  )) as ConversationRow[];

  return rows[0];
}

export async function appendMessage(
  sessionId: string,
  message: {
    sender: "bot" | "user" | "agent";
    text: string;
    channel?: string;
    whatsappMessageId?: string | null;
  },
) {
  const conversation = await getOrCreateConversation(sessionId);

  const rows = (await (prisma as any).$queryRawUnsafe(
    `
      INSERT INTO "CustomerMessage" (
        "conversationId",
        "sender",
        "channel",
        "text",
        "whatsappMessageId",
        "createdAt"
      )
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING "id", "text", "sender", "channel", "createdAt"
    `,
    conversation.id,
    message.sender,
    message.channel || "WEB",
    message.text,
    message.whatsappMessageId || null,
  )) as Array<{
    id: number;
    text: string;
    sender: "bot" | "user" | "agent";
    channel: string;
    createdAt: Date;
  }>;

  await (prisma as any).$executeRawUnsafe(
    `
      UPDATE "CustomerConversation"
      SET "updatedAt" = NOW(), "latestMessageAt" = NOW()
      WHERE "id" = $1
    `,
    conversation.id,
  );

  return mapMessage(rows[0]);
}

export async function listMessages(sessionId: string) {
  await ensureChatTables();

  const rows = (await (prisma as any).$queryRawUnsafe(
    `
      SELECT m."id", m."text", m."sender", m."channel", m."createdAt"
      FROM "CustomerMessage" m
      INNER JOIN "CustomerConversation" c ON c."id" = m."conversationId"
      WHERE c."sessionId" = $1
      ORDER BY m."createdAt" ASC, m."id" ASC
    `,
    sessionId,
  )) as Array<{
    id: number;
    text: string;
    sender: "bot" | "user" | "agent";
    channel: string;
    createdAt: Date;
  }>;

  return rows.map(mapMessage);
}

export async function ensureWelcomeMessage(sessionId: string) {
  const messages = await listMessages(sessionId);

  if (messages.length > 0) {
    return messages;
  }

  await appendMessage(sessionId, {
    sender: "bot",
    text: "Hi there! Welcome to Royal Braids. Ask me about products, prices, order tracking, delivery, returns, or contact details.",
  });

  return listMessages(sessionId);
}

function mapMessage(row: {
  id: number;
  text: string;
  sender: "bot" | "user" | "agent";
  channel: string;
  createdAt: Date;
}): StoredChatMessage {
  return {
    id: row.id,
    text: row.text,
    sender: row.sender,
    channel: row.channel,
    time: formatTime(row.createdAt),
  };
}

function formatTime(date: Date) {
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
