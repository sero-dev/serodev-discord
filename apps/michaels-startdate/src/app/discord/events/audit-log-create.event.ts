import { Logger } from '@nestjs/common';
import {
  AuditLogChange,
  AuditLogEvent,
  Client,
  GuildAuditLogsActionType,
  GuildAuditLogsEntry,
  GuildAuditLogsTargetType,
} from 'discord.js';

const logger = new Logger(onAuditLogCreate.name);
export async function onAuditLogCreate(
  auditLogEntry: AuditLogEntryCreate,
  client: Client<boolean>
) {
  const { action } = auditLogEntry;

  switch (action) {
    case AuditLogEvent.MemberDisconnect:
      onMemberKick(auditLogEntry, client);
      break;
    case AuditLogEvent.MemberKick:
      onMemberDisconnect(auditLogEntry, client);
      break;
    case AuditLogEvent.MemberUpdate:
      onMemberUpdate(auditLogEntry, client);
      break;
  }
}

async function onMemberUpdate(
  auditLogEntry: AuditLogEntryCreate,
  client: Client<boolean>
) {
  const { executorId, targetId, changes } = auditLogEntry;
  const executor = await client.users.fetch(executorId);
  const userUpdated = await client.users.fetch(targetId);

  if (wasMuted(changes)) {
    logger.log(
      `${userUpdated.globalName} was muted by ${executor.globalName}.`
    );
  } else if (wasDeafen(changes)) {
    logger.log(
      `${userUpdated.globalName} was deafen by ${executor.globalName}.`
    );
  }
}

async function onMemberDisconnect(
  auditLogEntry: AuditLogEntryCreate,
  client: Client<boolean>
) {
  const { executorId, targetId } = auditLogEntry;
  const executor = await client.users.fetch(executorId);
  const disconnectedUser = await client.users.fetch(targetId);

  logger.log(
    `${disconnectedUser.globalName} was disconnected by ${executor.globalName}.`
  );
}

async function onMemberKick(
  auditLogEntry: AuditLogEntryCreate,
  client: Client<boolean>
) {
  const { executorId, targetId } = auditLogEntry;
  const executor = await client.users.fetch(executorId);
  const kickedUser = await client.users.fetch(targetId);

  logger.log(`${kickedUser.globalName} was kicked by ${executor.globalName}.`);
}

type AuditLogEntryCreate = GuildAuditLogsEntry<
  AuditLogEvent,
  GuildAuditLogsActionType,
  GuildAuditLogsTargetType,
  AuditLogEvent
>;

function wasMuted(changes: AuditLogChange[]) {
  return changes.find((c) => c.key === 'mute' && c.new);
}

function wasDeafen(changes: AuditLogChange[]) {
  return changes.find((c) => c.key === 'deaf' && c.new);
}
