import { Logger } from '@nestjs/common';
import {
  AuditLogChange,
  AuditLogEvent,
  Client,
  Guild,
  GuildAuditLogsActionType,
  GuildAuditLogsEntry,
  GuildAuditLogsTargetType,
} from 'discord.js';
import { ViolationCommand } from '../../command/commands/violation.command';

const logger = new Logger(onAuditLogCreate.name);
export async function onAuditLogCreate(
  auditLogEntry: AuditLogEntryCreate,
  guild: Guild,
  client: Client<boolean>,
  violationCommand: ViolationCommand
) {
  const { action } = auditLogEntry;
  logger.debug(auditLogEntry.toJSON());

  switch (action) {
    case AuditLogEvent.MemberDisconnect:
      onMemberDisconnect(auditLogEntry, guild, client, violationCommand);
      break;
    case AuditLogEvent.MemberKick:
      onMemberKick(auditLogEntry, guild, client, violationCommand);
      break;
    case AuditLogEvent.MemberUpdate:
      onMemberUpdate(auditLogEntry, guild, client, violationCommand);
      break;
  }
}

async function onMemberUpdate(
  auditLogEntry: AuditLogEntryCreate,
  guild: Guild,
  client: Client<boolean>,
  violationCommand: ViolationCommand
) {
  const { executorId, targetId, changes } = auditLogEntry;
  const executor = await client.users.fetch(executorId);
  const userUpdated = await client.users.fetch(targetId);

  if (wasMuted(changes)) {
    violationCommand.addViolation(executorId, guild.id, 'muted');
    logger.log(
      `${userUpdated.globalName} was muted by ${executor.globalName}.`
    );
  } else if (wasDeafen(changes)) {
    violationCommand.addViolation(executorId, guild.id, 'deafen');
    logger.log(
      `${userUpdated.globalName} was deafen by ${executor.globalName}.`
    );
  }
}

async function onMemberDisconnect(
  auditLogEntry: AuditLogEntryCreate,
  guild: Guild,
  client: Client<boolean>,
  violationCommand: ViolationCommand
) {
  const { executorId } = auditLogEntry;
  const executor = await client.users.fetch(executorId);

  violationCommand.addViolation(executorId, guild.id, 'disconnected');
  logger.log(`${executor.globalName} disconnected a user`);
}

async function onMemberKick(
  auditLogEntry: AuditLogEntryCreate,
  guild: Guild,
  client: Client<boolean>,
  violationCommand: ViolationCommand
) {
  const { executorId } = auditLogEntry;
  const executor = await client.users.fetch(executorId);

  violationCommand.addViolation(executor.id, guild.id, 'kicked');
  logger.log(`${executor.globalName} kicked a user`);
}

type AuditLogEntryCreate = GuildAuditLogsEntry<
  AuditLogEvent,
  GuildAuditLogsActionType,
  GuildAuditLogsTargetType,
  AuditLogEvent
>;

function wasMuted(changes: AuditLogChange[]) {
  return !!changes.find((c) => c.key === 'mute' && c.new);
}

function wasDeafen(changes: AuditLogChange[]) {
  return !!changes.find((c) => c.key === 'deaf' && c.new);
}
