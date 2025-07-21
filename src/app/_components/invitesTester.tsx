"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export function InviteTester() {
  const [groupId, setGroupId] = useState<number>(1);
  const [recipientId, setRecipientId] = useState<number>(2);
  const [senderId, setSenderId] = useState<number>(3);
  const [logs, setLogs] = useState<string[]>([]);

  const log = (message: string) => setLogs((prev) => [message, ...prev]);

  const sendInvite = api.invites.send.useMutation();
  const acceptInvite = api.invites.accept.useMutation();
  const declineInvite = api.invites.decline.useMutation();
  const withdrawInvite = api.invites.withdraw.useMutation();
  const getOutboundInvites = api.invites.getOutboundInvites.useQuery();
  const getInboundInvites = api.invites.getInboundInvites.useQuery();

  const handleSend = async () => {
    try {
      const result = await sendInvite.mutateAsync({ groupId, recipientId });
      log("✅ Sent invite: " + JSON.stringify(result));
    } catch (err: any) {
      log("❌ Send failed: " + err.message);
    }
  };

  const handleAccept = async () => {
    try {
      await acceptInvite.mutateAsync({ groupId, senderId });
      log("✅ Accepted invite");
    } catch (err: any) {
      log("❌ Accept failed: " + err.message);
    }
  };

  const handleDecline = async () => {
    try {
      await declineInvite.mutateAsync({ groupId, senderId });
      log("✅ Declined invite");
    } catch (err: any) {
      log("❌ Decline failed: " + err.message);
    }
  };

  const handleWithdraw = async () => {
    try {
      await withdrawInvite.mutateAsync({ groupId, recipientId });
      log("✅ Withdrawn invite");
    } catch (err: any) {
      log("❌ Withdraw failed: " + err.message);
    }
  };

  const handleGetOutbound = async () => {
    try {
      const result = await getOutboundInvites.refetch();
      log("📤 Outbound: " + JSON.stringify(result.data));
    } catch (err: any) {
      log("❌ Get outbound failed: " + err.message);
    }
  };

  const handleGetInbound = async () => {
    try {
      const result = await getInboundInvites.refetch();
      log("📥 Inbound: " + JSON.stringify(result.data));
    } catch (err: any) {
      log("❌ Get inbound failed: " + err.message);
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-2xl font-bold">🎯 Invite API Tester</h1>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <div>
          <label>Group ID</label>
          <input
            type="number"
            value={groupId}
            onChange={(e) => setGroupId(Number(e.target.value))}
            className="w-full border px-2 py-1"
          />
        </div>
        <div>
          <label>Recipient ID</label>
          <input
            type="number"
            value={recipientId}
            onChange={(e) => setRecipientId(Number(e.target.value))}
            className="w-full border px-2 py-1"
          />
        </div>
        <div>
          <label>Sender ID</label>
          <input
            type="number"
            value={senderId}
            onChange={(e) => setSenderId(Number(e.target.value))}
            className="w-full border px-2 py-1"
          />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={handleSend}
          className="rounded bg-blue-500 px-3 py-1 text-white"
        >
          Send
        </button>
        <button
          onClick={handleAccept}
          className="rounded bg-green-500 px-3 py-1 text-white"
        >
          Accept
        </button>
        <button
          onClick={handleDecline}
          className="rounded bg-yellow-500 px-3 py-1 text-white"
        >
          Decline
        </button>
        <button
          onClick={handleWithdraw}
          className="rounded bg-red-500 px-3 py-1 text-white"
        >
          Withdraw
        </button>
        <button
          onClick={handleGetOutbound}
          className="rounded bg-purple-500 px-3 py-1 text-white"
        >
          Get Outbound
        </button>
        <button
          onClick={handleGetInbound}
          className="rounded bg-teal-500 px-3 py-1 text-white"
        >
          Get Inbound
        </button>
      </div>

      <div className="h-64 overflow-y-auto rounded bg-black p-4">
        <h2 className="mb-2 font-semibold">📝 Logs:</h2>
        <ul className="space-y-1 text-sm">
          {logs.map((log, idx) => (
            <li key={idx} className="font-mono">
              {log}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
